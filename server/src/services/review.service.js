// This service module handles all review-related operations, including creating, updating, deleting reviews, fetching reviews for products and sellers, marking reviews as helpful/not helpful, and reporting reviews. It also integrates with the notification system to send alerts to sellers and customers based on review activities. The service uses Mongoose transactions to ensure data consistency when creating/updating/deleting reviews and recalculating product ratings.

import mongoose from "mongoose";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ApiError } from "../utils/ApiError.js";
import NotificationService from "../services/notification/notification.service.js";

// The reviewService object encapsulates all review-related operations. It provides methods for creating a new review, updating an existing review, deleting a review, fetching reviews for a specific product, fetching reviews submitted by the logged-in user, marking a review as helpful or not helpful, reporting a review for inappropriate content, and fetching reviews for a seller's products. Each method includes necessary validations, error handling, and interactions with the database to ensure that reviews are managed effectively while maintaining data integrity and providing appropriate notifications to users.
export const reviewService = {
  // This method allows a user to create a review for a product they have purchased. It validates the input data, checks if the product and order are eligible for review, and ensures that the user has not already submitted a review for the same order item. If all checks pass, it creates the review, recalculates the product's average rating and total reviews count, and emits notifications to the seller and customer about the new review.
  async createReview(userId, productId, body) {
    const {
      rating,
      title = "",
      comment = "",
      orderId,
      orderItemId,
      images = [],
    } = body;

    if (!mongoose.Types.ObjectId.isValid(productId))
      throw new ApiError(400, "Invalid product ID");

    if (!mongoose.Types.ObjectId.isValid(orderId))
      throw new ApiError(400, "Invalid order ID");

    if (!rating || rating < 1 || rating > 5)
      throw new ApiError(400, "Rating must be between 1 and 5");

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    }).populate("seller", "_id email");

    if (!product) throw new ApiError(404, "Product not found");

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      orderStatus: "delivered",
    });

    if (!order) throw new ApiError(403, "Order not eligible for review");

    const item = order.items.find(
      (i) =>
        i._id.toString() === orderItemId && i.product.toString() === productId,
    );

    if (!item) throw new ApiError(400, "Invalid order item");

    const existing = await Review.findOne({
      user: userId,
      order: orderId,
      orderItemId,
    });

    if (existing)
      throw new ApiError(409, "Review already submitted for this item");

    const variantSnapshot = item.selectedVariant || null;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const review = await Review.create(
        [
          {
            product: productId,
            user: userId,
            order: orderId,
            orderItemId,
            variantSnapshot,
            rating,
            title,
            comment,
            images,
            isVerifiedPurchase: true,
          },
        ],
        { session },
      );

      //////////////////////////////////////////////////
      // RECALCULATE PRODUCT RATING
      //////////////////////////////////////////////////

      const stats = await Review.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(productId),
            status: "approved",
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: "$product",
            avgRating: { $avg: "$rating" },
            total: { $sum: 1 },
          },
        },
      ]).session(session);

      const avg = stats[0]?.avgRating || 0;
      const count = stats[0]?.total || 0;

      await Product.findByIdAndUpdate(
        productId,
        {
          ratings: Number(avg.toFixed(2)),
          reviews: count,
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      await NotificationService.emit("NEW_REVIEW_FOR_PRODUCT", {
        recipient: product.seller._id,
        recipientRole: "seller",
        entityType: "Product",
        entityId: productId,
        category: "product",
        priority: "medium",
        meta: {
          productName: product.name,
          rating,
        },
        email: product.seller.email,
      });
      await NotificationService.emit("REVIEW_SUBMITTED_CUSTOMER", {
        recipient: userId,
        recipientRole: "customer",
        entityType: "Product",
        entityId: productId,
        category: "review",
        priority: "low",
        meta: {
          productName: product.name,
        },
      });

      if (rating <= 2) {
        await NotificationService.emit("LOW_RATING_REVIEW_ALERT", {
          recipient: product.seller._id,
          recipientRole: "seller",
          entityType: "Product",
          entityId: productId,
          category: "product",
          priority: "high",
          meta: {
            productName: product.name,
            rating,
          },
          email: product.seller.email,
        });
      }

      return review[0];
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  // This method allows a user to update their existing review. It checks if the review exists and belongs to the user, and that it is not rejected (as rejected reviews cannot be updated). The user can update the rating, title, comment, images, and aspects of the review. After updating the review, it resets the moderation status to pending and recalculates the product's average rating and total reviews count. Notifications are emitted to inform the seller about the updated review.
  async updateReview(userId, reviewId, body) {
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      throw new ApiError(400, "Invalid review ID");

    const review = await Review.findOne({
      _id: reviewId,
      user: userId,
      isDeleted: false,
    });

    if (!review) throw new ApiError(404, "Review not found");

    if (review.status === "rejected")
      throw new ApiError(400, "Rejected reviews cannot be updated");

    const allowedFields = ["rating", "title", "comment", "images", "aspects"];

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        review[key] = body[key];
      }
    }

    if (body.rating && (body.rating < 1 || body.rating > 5))
      throw new ApiError(400, "Rating must be between 1 and 5");

    review.status = "pending";
    review.moderatedBy = null;
    review.moderatedAt = null;
    review.rejectionReason = null;

    const productId = review.product;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await review.save({ session });

      const stats = await Review.aggregate([
        {
          $match: {
            product: new mongoose.Types.ObjectId(productId),
            status: "approved",
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: "$product",
            avgRating: { $avg: "$rating" },
            total: { $sum: 1 },
          },
        },
      ]).session(session);

      const avg = stats[0]?.avgRating || 0;
      const count = stats[0]?.total || 0;

      await Product.findByIdAndUpdate(
        productId,
        {
          ratings: Number(avg.toFixed(2)),
          reviews: count,
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      const product = await Product.findById(productId).populate(
        "seller",
        "_id email name",
      );

      await NotificationService.emit("REVIEW_SUBMITTED_CUSTOMER", {
        recipient: userId,
        recipientRole: "customer",
        entityType: "Product",
        entityId: productId,
        category: "review",
        priority: "low",
        meta: {
          productName: product.name,
        },
      });

      await NotificationService.emit("NEW_REVIEW_FOR_PRODUCT", {
        recipient: product.seller._id,
        recipientRole: "seller",
        entityType: "Product",
        entityId: productId,
        category: "product",
        priority: "medium",
        meta: {
          productName: product.name,
          rating: review.rating,
        },
        email: product.seller.email,
      });

      if (review.rating <= 2) {
        await NotificationService.emit("LOW_RATING_REVIEW_ALERT", {
          recipient: product.seller._id,
          recipientRole: "seller",
          entityType: "Product",
          entityId: productId,
          category: "product",
          priority: "high",
          meta: {
            productName: product.name,
            rating: review.rating,
          },
          email: product.seller.email,
        });
      }

      return review;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  // This method allows a user to delete their review. It checks if the review exists and belongs to the user, and that the user has the appropriate role to delete the review (sellers cannot delete reviews). Instead of permanently deleting the review, it marks it as deleted. After deletion, it recalculates the product's average rating and total reviews count. A notification is emitted to inform the seller that a review was deleted by the customer.
  async deleteReview(userId, reviewId, role = "customer") {
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      throw new ApiError(400, "Invalid review ID");

    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) throw new ApiError(404, "Review not found");

    if (role === "customer") {
      if (review.user.toString() !== userId.toString())
        throw new ApiError(403, "Not authorized to delete this review");
    }

    if (role === "seller")
      throw new ApiError(403, "Sellers cannot delete reviews");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      review.isDeleted = true;
      await review.save({ session });

      const stats = await Review.aggregate([
        {
          $match: {
            product: review.product,
            status: "approved",
            isDeleted: false,
          },
        },
        {
          $group: {
            _id: "$product",
            avgRating: { $avg: "$rating" },
            total: { $sum: 1 },
          },
        },
      ]).session(session);

      const avg = stats[0]?.avgRating || 0;
      const count = stats[0]?.total || 0;

      await Product.findByIdAndUpdate(
        review.product,
        {
          ratings: Number(avg.toFixed(2)),
          reviews: count,
        },
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      const product = await Product.findById(review.product).populate(
        "seller",
        "_id email name",
      );

      await NotificationService.emit("SYSTEM_ALERT", {
        recipient: product.seller._id,
        recipientRole: "seller",
        entityType: "Product",
        entityId: review.product,
        category: "review",
        priority: "low",
        meta: {
          message: "A review was deleted by the customer.",
        },
        email: product.seller.email,
      });

      return { success: true };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  // This method fetches reviews for a specific product based on the provided query parameters such as page, limit, rating filter, and sorting options. It validates the product ID, checks if the product exists and is eligible for reviews, and then retrieves the reviews that match the criteria. The method also calculates a rating breakdown for the product and formats the review data to include helpful/not helpful vote counts before returning the results in a paginated format.
  async getProductReviews(productId, query) {
    if (!mongoose.Types.ObjectId.isValid(productId))
      throw new ApiError(400, "Invalid product ID");

    const { page = 1, limit = 10, rating, sort = "newest" } = query;

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    });

    if (!product) throw new ApiError(404, "Product not found");

    const filter = {
      product: productId,
      status: "approved",
      isDeleted: false,
    };

    if (rating) filter.rating = Number(rating);

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highestRating: { rating: -1 },
      lowestRating: { rating: 1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort(sortQuery)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("user", "fullname username avatar")
        .lean(),

      Review.countDocuments(filter),
    ]);

    const breakdown = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          status: "approved",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    breakdown.forEach((item) => {
      ratingBreakdown[item._id] = item.count;
    });

    const formattedReviews = reviews.map((r) => {
      const helpfulCount =
        r.votes?.filter((v) => v.type === "helpful").length || 0;
      const notHelpfulCount =
        r.votes?.filter((v) => v.type === "not_helpful").length || 0;

      return {
        ...r,
        helpfulCount,
        notHelpfulCount,
      };
    });

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      ratingBreakdown,
      reviews: formattedReviews,
    };
  },

  // This method fetches reviews submitted by the logged-in user based on the provided query parameters such as page, limit, sorting options, and review status filter. It retrieves the reviews that match the criteria and formats the review data to include helpful/not helpful vote counts before returning the results in a paginated format. This allows users to view and manage their submitted reviews effectively.
  async getMyReviews(userId, query) {
    const { page = 1, limit = 10, sort = "newest", status } = query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));

    const filter = {
      user: userId,
      isDeleted: false,
    };

    if (status && ["pending", "approved", "rejected"].includes(status)) {
      filter.status = status;
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highestRating: { rating: -1 },
      lowestRating: { rating: 1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort(sortQuery)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate("product", "name slug images")
        .lean(),

      Review.countDocuments(filter),
    ]);

    const formattedReviews = reviews.map((r) => {
      const helpfulCount =
        r.votes?.filter((v) => v.type === "helpful").length || 0;
      const notHelpfulCount =
        r.votes?.filter((v) => v.type === "not_helpful").length || 0;

      return {
        _id: r._id,
        product: {
          _id: r.product?._id,
          name: r.product?.name,
          slug: r.product?.slug,
          image: r.product?.images?.[0]?.url || null,
        },
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        status: r.status,
        rejectionReason: r.rejectionReason || null,
        sellerResponse: r.sellerResponse || null,
        helpfulCount,
        notHelpfulCount,
        createdAt: r.createdAt,
      };
    });

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reviews: formattedReviews,
    };
  },

  // This method allows a user to mark a review as helpful or not helpful. It validates the review ID and vote type, checks if the review exists and is eligible for voting, and ensures that users cannot vote on their own reviews. The method then updates the review's votes array accordingly, either adding a new vote or updating an existing one. Mongoose transactions are used to ensure data consistency during the voting process. Finally, it returns the updated review document with the new vote counts.
  async markReviewHelpful(userId, reviewId, type) {
    if (!["helpful", "not_helpful"].includes(type))
      throw new ApiError(400, "Invalid vote type");

    if (!mongoose.Types.ObjectId.isValid(reviewId))
      throw new ApiError(400, "Invalid review ID");

    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
      status: "approved",
    });

    if (!review) throw new ApiError(404, "Review not found");

    if (review.user.toString() === userId.toString())
      throw new ApiError(403, "You cannot vote on your own review");

    const existingVote = review.votes.find(
      (v) => v.user.toString() === userId.toString(),
    );

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (!existingVote) {
        review.votes.push({
          user: userId,
          type,
        });
      } else {
        if (existingVote.type === type) {
          await session.abortTransaction();
          session.endSession();
          return review; // already voted same way
        }

        existingVote.type = type;
      }

      await review.save({ session });

      await session.commitTransaction();
      session.endSession();

      return review;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  // This method allows a user to report a review for inappropriate content. It validates the review ID and report reason, checks if the review exists and is eligible for reporting, and ensures that users cannot report their own reviews or report the same review multiple times. The method then adds the report to the review's reports array and checks if the number of reports has exceeded a predefined threshold. If the threshold is exceeded, the review's status is set to pending for moderation, and a system alert notification is emitted to inform administrators about the reported review. Mongoose transactions are used to ensure data consistency during the reporting process. Finally, it returns the updated report count for the review.
  async reportReview(userId, reviewId, reason) {
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      throw new ApiError(400, "Invalid review ID");

    if (!reason || reason.trim().length < 5)
      throw new ApiError(400, "Report reason must be at least 5 characters");

    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
    });

    if (!review) throw new ApiError(404, "Review not found");

    if (review.user.toString() === userId.toString())
      throw new ApiError(403, "You cannot report your own review");

    const alreadyReported = review.reports.find(
      (r) => r.user.toString() === userId.toString(),
    );

    if (alreadyReported)
      throw new ApiError(409, "You have already reported this review");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      review.reports.push({
        user: userId,
        reason: reason.trim(),
        reportedAt: new Date(),
      });

      await review.save({ session });
      const reportCount = review.reports.length;
      const REPORT_THRESHOLD = 3;

      if (reportCount >= REPORT_THRESHOLD) {
        review.status = "pending";
        await review.save({ session });

        await NotificationService.emit("SYSTEM_ALERT", {
          recipientRole: "admin",
          entityType: "Review",
          entityId: review._id,
          category: "review",
          priority: "high",
          meta: {
            message: "Review exceeded report threshold",
            reviewId: review._id,
            reportCount,
          },
        });
      }

      await session.commitTransaction();
      session.endSession();

      return {
        reportCount,
      };
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  // This method fetches reviews for a seller's products based on the provided query parameters such as page, limit, rating filter, review status filter, and sorting options. It validates the seller ID, checks if the seller exists, and then retrieves the reviews that match the criteria for the products sold by the seller. The method uses MongoDB aggregation to join the reviews with product data and applies the necessary filters and sorting. Finally, it formats the review data to include helpful/not helpful vote counts and returns the results in a paginated format.
  async getSellerReviews(sellerId, query) {
    const { page = 1, limit = 20, rating, status, sort = "newest" } = query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const matchStage = {
      isDeleted: false,
    };

    if (rating) matchStage.rating = Number(rating);

    if (status && ["pending", "approved", "rejected"].includes(status))
      matchStage.status = status;

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highestRating: { rating: -1 },
      lowestRating: { rating: 1 },
    };

    const sortStage = sortOptions[sort] || { createdAt: -1 };

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },

      { $unwind: "$productData" },

      {
        $match: {
          "productData.seller": new mongoose.Types.ObjectId(sellerId),
          "productData.isDeleted": false,
        },
      },

      {
        $sort: sortStage,
      },

      {
        $facet: {
          reviews: [
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
            {
              $project: {
                rating: 1,
                title: 1,
                comment: 1,
                status: 1,
                createdAt: 1,
                votes: 1,
                reports: 1,
                "productData.name": 1,
                "productData.slug": 1,
                "productData.images": 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Review.aggregate(pipeline);
    const reviews = result[0].reviews;
    const total = result[0].totalCount[0]?.count || 0;

    const formattedReviews = reviews.map((r) => {
      const helpfulCount =
        r.votes?.filter((v) => v.type === "helpful").length || 0;
      const reportCount = r.reports?.length || 0;

      return {
        rating: r.rating,
        title: r.title,
        comment: r.comment,
        status: r.status,
        createdAt: r.createdAt,
        helpfulCount,
        reportCount,
        product: {
          name: r.productData.name,
          slug: r.productData.slug,
          image: r.productData.images?.[0]?.url || null,
        },
      };
    });

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reviews: formattedReviews,
    };
  },

  // This method allows a seller to reply to a review left on their product. It validates the review ID and reply message, checks if the review exists and is approved, and ensures that the review belongs to one of the seller's products. If all checks pass, it updates the review document with the seller's response and emits a notification to inform the customer that the seller has replied to their review. Finally, it returns the updated review document with the seller's response included.
  async replyToReview(sellerId, reviewId, message) {
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      throw new ApiError(400, "Invalid review ID");

    if (!message || message.trim().length < 3)
      throw new ApiError(400, "Reply message is required");

    const review = await Review.findOne({
      _id: reviewId,
      isDeleted: false,
      status: "approved",
    })
      .populate("product", "seller name")
      .populate("user", "_id email fullname");

    if (!review) throw new ApiError(404, "Review not found");

    if (review.product.seller.toString() !== sellerId.toString())
      throw new ApiError(403, "Not authorized to reply to this review");

    review.sellerResponse = {
      message: message.trim(),
      respondedBy: sellerId,
      respondedAt: new Date(),
    };

    await review.save();

    await NotificationService.emit("SYSTEM_ALERT", {
      recipient: review.user._id,
      recipientRole: "customer",
      entityType: "Review",
      entityId: review._id,
      category: "review",
      priority: "medium",
      meta: {
        message: "Seller replied to your review",
        productName: review.product.name,
      },
      email: review.user.email,
    });

    return review;
  },

  // This method provides a summary of reviews for a seller's products, including the average rating, total number of reviews, and a breakdown of ratings by star level. It accepts optional parameters for filtering by product ID. The method uses MongoDB aggregation to join reviews with product data, apply necessary filters, and calculate the required statistics. Finally, it returns an array of review summaries for the seller's products.
  async getSellerReviewSummary(sellerId, productId) {
    const matchStage = {
      status: "approved",
      isDeleted: false,
    };

    if (productId) {
      matchStage.product = new mongoose.Types.ObjectId(productId);
    }

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },

      { $unwind: "$productData" },

      {
        $match: {
          "productData.seller": new mongoose.Types.ObjectId(sellerId),
          "productData.isDeleted": false,
        },
      },

      {
        $group: {
          _id: "$product",
          productName: { $first: "$productData.name" },
          productImage: {
            $first: { $arrayElemAt: ["$productData.images.url", 0] },
          },
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },

      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: 1,
          productImage: 1,
          avgRating: { $round: ["$avgRating", 2] },
          totalReviews: 1,
          starBreakdown: {
            1: "$star1",
            2: "$star2",
            3: "$star3",
            4: "$star4",
            5: "$star5",
          },
        },
      },

      { $sort: { avgRating: -1 } },
    ];

    const summary = await Review.aggregate(pipeline);

    return summary;
  },

  // This method allows administrators to list reviews with advanced filtering and sorting options. It accepts various query parameters such as page, limit, review status, rating filter, product ID, seller ID, user ID, reported-only filter, date range, and sorting options. The method uses MongoDB aggregation to join reviews with product and user data, apply the necessary filters based on the query parameters, and calculate helpful/not helpful vote counts and report counts. Finally, it returns the filtered and sorted list of reviews in a paginated format along with the total count of matching reviews.
  async adminListReviews(query) {
    const {
      page = 1,
      limit = 20,
      status,
      rating,
      productId,
      sellerId,
      userId,
      reportedOnly,
      from,
      to,
      sort = "newest",
    } = query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const matchStage = {
      isDeleted: false,
    };

    if (status && ["pending", "approved", "rejected"].includes(status))
      matchStage.status = status;

    if (rating) matchStage.rating = Number(rating);

    if (productId) matchStage.product = new mongoose.Types.ObjectId(productId);

    if (userId) matchStage.user = new mongoose.Types.ObjectId(userId);

    if (from || to) {
      matchStage.createdAt = {};
      if (from) matchStage.createdAt.$gte = new Date(from);
      if (to) matchStage.createdAt.$lte = new Date(to);
    }

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      lowestRating: { rating: 1 },
      highestRating: { rating: -1 },
      mostReported: { reportCount: -1 },
    };

    const sortStage = sortOptions[sort] || { createdAt: -1 };

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "productData",
        },
      },

      { $unwind: "$productData" },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userData",
        },
      },

      { $unwind: "$userData" },

      ...(sellerId
        ? [
            {
              $match: {
                "productData.seller": new mongoose.Types.ObjectId(sellerId),
              },
            },
          ]
        : []),
      {
        $addFields: {
          helpfulCount: {
            $size: {
              $filter: {
                input: "$votes",
                as: "v",
                cond: { $eq: ["$$v.type", "helpful"] },
              },
            },
          },
          reportCount: { $size: "$reports" },
        },
      },

      ...(reportedOnly === "true"
        ? [
            {
              $match: { reportCount: { $gt: 0 } },
            },
          ]
        : []),

      { $sort: sortStage },

      {
        $facet: {
          reviews: [
            { $skip: (pageNum - 1) * limitNum },
            { $limit: limitNum },
            {
              $project: {
                rating: 1,
                title: 1,
                comment: 1,
                status: 1,
                helpfulCount: 1,
                reportCount: 1,
                createdAt: 1,
                "productData.name": 1,
                "userData.fullname": 1,
                "userData.email": 1,
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await Review.aggregate(pipeline);

    const reviews = result[0].reviews;
    const total = result[0].totalCount[0]?.count || 0;

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reviews,
    };
  },

  // This method allows administrators to view detailed information about a specific review, including the review content, associated product and user details, votes, and reports. It validates the review ID, checks if the review exists, and then populates related data such as product information, user information, order details, seller responses, votes, and reports. The method also calculates helpful/not helpful vote counts and report counts before returning the comprehensive review details.
  async adminGetReviewDetails(reviewId) {
    if (!mongoose.Types.ObjectId.isValid(reviewId))
      throw new ApiError(400, "Invalid review ID");

    const review = await Review.findById(reviewId)
      .populate("product", "name slug images seller")
      .populate("user", "fullname email role")
      .populate("order", "orderNumber orderStatus createdAt")
      .populate("sellerResponse.respondedBy", "fullname email")
      .populate("votes.user", "fullname email")
      .populate("reports.user", "fullname email");

    if (!review) throw new ApiError(404, "Review not found");

    const helpfulCount = review.votes.filter(
      (v) => v.type === "helpful",
    ).length;
    const notHelpfulCount = review.votes.filter(
      (v) => v.type === "not_helpful",
    ).length;
    const reportCount = review.reports.length;

    return {
      review,
      metrics: {
        helpfulCount,
        notHelpfulCount,
        reportCount,
      },
    };
  },

  // This method allows administrators to moderate a review by approving or rejecting it. It validates the review ID and action, checks if the review exists and is eligible for moderation, and then updates the review's status accordingly. If the review's status changes, it conditionally recalculates the product's average rating and total reviews count. After moderation, it emits notifications to inform the customer about the approval or rejection of their review, and also notifies the seller if the review was approved. Mongoose transactions are used to ensure data consistency during the moderation process.
  async adminModerateReview(adminId, reviewId, action, reason) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(400, "Invalid review ID");
    }

    if (!["approve", "reject"].includes(action)) {
      throw new ApiError(400, "Action must be 'approve' or 'reject'");
    }

    const review = await Review.findById(reviewId)
      .populate("product", "name seller")
      .populate("user", "fullname email");

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    if (review.isDeleted) {
      throw new ApiError(400, "Cannot moderate deleted review");
    }

    const previousStatus = review.status;

    //////////////////////////////////////////////////////
    // VALIDATION RULES
    //////////////////////////////////////////////////////

    if (action === "reject") {
      if (!reason || reason.trim().length < 5) {
        throw new ApiError(
          400,
          "Rejection reason must be at least 5 characters",
        );
      }
    }

    if (action === "approve" && previousStatus === "approved") {
      throw new ApiError(400, "Review is already approved");
    }

    if (action === "reject" && previousStatus === "rejected") {
      throw new ApiError(400, "Review is already rejected");
    }

    //////////////////////////////////////////////////////
    // START TRANSACTION
    //////////////////////////////////////////////////////

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Update status
      if (action === "approve") {
        review.status = "approved";
        review.rejectionReason = null;
      }

      if (action === "reject") {
        review.status = "rejected";
        review.rejectionReason = reason.trim();
      }

      review.moderatedBy = adminId;
      review.moderatedAt = new Date();

      await review.save({ session });

      //////////////////////////////////////////////////////
      // CONDITIONAL RATING RECALCULATION
      //////////////////////////////////////////////////////

      if (previousStatus !== review.status) {
        const ratingImpactChange =
          previousStatus === "approved" || review.status === "approved";

        if (ratingImpactChange) {
          const stats = await Review.aggregate([
            {
              $match: {
                product: review.product._id,
                status: "approved",
                isDeleted: false,
              },
            },
            {
              $group: {
                _id: "$product",
                avgRating: { $avg: "$rating" },
                total: { $sum: 1 },
              },
            },
          ]).session(session);

          const avg = stats[0]?.avgRating || 0;
          const count = stats[0]?.total || 0;

          await Product.findByIdAndUpdate(
            review.product._id,
            {
              ratings: Number(avg.toFixed(2)),
              reviews: count,
            },
            { session },
          );
        }
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    //////////////////////////////////////////////////////
    // NOTIFICATIONS (AFTER COMMIT)
    //////////////////////////////////////////////////////

    if (action === "approve") {
      await NotificationService.emit("REVIEW_APPROVED_CUSTOMER", {
        recipient: review.user._id,
        recipientRole: "customer",
        entityType: "Review",
        entityId: review._id,
        category: "review",
        priority: "medium",
        meta: {
          productName: review.product.name,
        },
        email: review.user.email,
      });

      await NotificationService.emit("NEW_REVIEW_FOR_PRODUCT", {
        recipient: review.product.seller,
        recipientRole: "seller",
        entityType: "Review",
        entityId: review._id,
        category: "review",
        priority: "medium",
      });
    }

    if (action === "reject") {
      await NotificationService.emit("REVIEW_REJECTED_CUSTOMER", {
        recipient: review.user._id,
        recipientRole: "customer",
        entityType: "Review",
        entityId: review._id,
        category: "review",
        priority: "medium",
        meta: {
          reason: review.rejectionReason,
        },
        email: review.user.email,
      });
    }

    return review;
  },

  // This method allows administrators to feature or unfeature a review on the product page. It validates the review ID and featured flag, checks if the review exists and is eligible for featuring, and then updates the review's isFeatured field accordingly. The method also tracks which admin performed the action and when. Finally, it returns the updated review document with the new featured status.
  async adminFeatureReview(adminId, reviewId, featured) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(400, "Invalid review ID");
    }

    if (typeof featured !== "boolean") {
      throw new ApiError(400, "Featured must be a boolean value");
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    if (review.isDeleted) {
      throw new ApiError(400, "Cannot feature a deleted review");
    }

    if (review.status !== "approved") {
      throw new ApiError(400, "Only approved reviews can be featured");
    }

    // Idempotent behavior
    if (review.isFeatured === featured) {
      return review;
    }

    review.isFeatured = featured;
    review.moderatedBy = adminId; // optional: track admin action
    review.moderatedAt = new Date();

    await review.save();

    return review;
  },

  // This method allows administrators to delete a review. It validates the review ID, checks if the review exists and is not already deleted, and then marks the review as deleted by setting the isDeleted flag. If the review was previously approved, it conditionally recalculates the product's average rating and total reviews count. After deletion, it emits a system alert notification to inform administrators about the deleted review. Mongoose transactions are used to ensure data consistency during the deletion process.
  async adminDeleteReview(adminId, reviewId) {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      throw new ApiError(400, "Invalid review ID");
    }

    const review = await Review.findById(reviewId).populate("product", "_id");

    if (!review) {
      throw new ApiError(404, "Review not found");
    }

    if (review.isDeleted) {
      throw new ApiError(400, "Review already deleted");
    }

    const previousStatus = review.status;
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      review.isDeleted = true;
      review.moderatedBy = adminId;
      review.moderatedAt = new Date();

      await review.save({ session });

      if (previousStatus === "approved") {
        const stats = await Review.aggregate([
          {
            $match: {
              product: review.product._id,
              status: "approved",
              isDeleted: false,
            },
          },
          {
            $group: {
              _id: "$product",
              avgRating: { $avg: "$rating" },
              total: { $sum: 1 },
            },
          },
        ]).session(session);

        const avg = stats[0]?.avgRating || 0;
        const count = stats[0]?.total || 0;

        await Product.findByIdAndUpdate(
          review.product._id,
          {
            ratings: Number(avg.toFixed(2)),
            reviews: count,
          },
          { session },
        );
      }

      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }

    return { success: true };
  },

  // This method provides analytics and insights on reviews for administrators. It accepts optional query parameters for filtering by date range and returns a comprehensive summary of reviews, including total counts by status, average rating, star breakdown, number of reported reviews, top products by review count and average rating, and monthly review trends. The method uses MongoDB aggregation to calculate the required statistics and returns the results in a structured format for easy consumption by the admin dashboard.
  async adminReviewsAnalytics(query) {
    const { from, to } = query;

    const dateFilter = {};

    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.$gte = new Date(from);
      if (to) dateFilter.createdAt.$lte = new Date(to);
    }

    const [summary] = await Review.aggregate([
      {
        $match: {
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          approved: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
          },
          rejected: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] },
          },
          deleted: {
            $sum: { $cond: [{ $eq: ["$isDeleted", true] }, 1, 0] },
          },
        },
      },
    ]);

    const [ratingStats] = await Review.aggregate([
      {
        $match: {
          status: "approved",
          isDeleted: false,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          star1: { $sum: { $cond: [{ $eq: ["$rating", 1] }, 1, 0] } },
          star2: { $sum: { $cond: [{ $eq: ["$rating", 2] }, 1, 0] } },
          star3: { $sum: { $cond: [{ $eq: ["$rating", 3] }, 1, 0] } },
          star4: { $sum: { $cond: [{ $eq: ["$rating", 4] }, 1, 0] } },
          star5: { $sum: { $cond: [{ $eq: ["$rating", 5] }, 1, 0] } },
        },
      },
    ]);

    const reportedCount = await Review.countDocuments({
      "reports.0": { $exists: true },
      isDeleted: false,
    });

    const topProducts = await Review.aggregate([
      {
        $match: {
          status: "approved",
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: "$product",
          totalReviews: { $sum: 1 },
          avgRating: { $avg: "$rating" },
        },
      },
      { $sort: { totalReviews: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productData",
        },
      },
      { $unwind: "$productData" },
      {
        $project: {
          productId: "$_id",
          productName: "$productData.name",
          productImage: { $arrayElemAt: ["$productData.images.url", 0] },
          totalReviews: 1,
          avgRating: { $round: ["$avgRating", 2] },
        },
      },
    ]);

    const monthlyTrend = await Review.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    return {
      summary: summary || {
        totalReviews: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        deleted: 0,
      },
      rating: {
        avgRating: ratingStats?.avgRating
          ? Number(ratingStats.avgRating.toFixed(2))
          : 0,
        starBreakdown: {
          1: ratingStats?.star1 || 0,
          2: ratingStats?.star2 || 0,
          3: ratingStats?.star3 || 0,
          4: ratingStats?.star4 || 0,
          5: ratingStats?.star5 || 0,
        },
      },
      reportedReviews: reportedCount,
      topProducts,
      monthlyTrend,
    };
  },
};
