import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {Review} from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import createAndSendNotification from "../utils/sendNotification.js";




// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================




// this controller is used to create a review for a product
const createReview = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    let {productId, orderId, orderItemId,rating,title,comment,aspects} = req.body;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    rating = Number(rating);
    
    if(!rating || rating<1||rating>5){
        throw new ApiError(400, "Rating must be between 1 and 5");
    }

    const product = await Product.findOne(
        {
            _id:productId,
            isActive:true,
            isDeleted:false
        }
    );
    if(!product){
        throw new ApiError(404, "Product not found");
    }

    let isVerifiedPurchase = false;
    let linkedOrderId = null;
    let linkedOrderItemId = null;

    if(orderId && orderItemId){
        const order = await Order.findOne(
            {
                _id:orderId,
                customer:userId,
                status:{$in:["Delivered","Completed"]},
            }
        );
        if(!order){
            throw new ApiError(400, "Order ID is required");
        }
        const orderItem = order.products?.find(
            (item) => item._id.toString() === orderItemId.toString() && item.product.toString() === productId.toString()
        );
        if(!orderItem){
            throw new ApiError(400, "Order item not found in the given order");
        }
        isVerifiedPurchase = true;
        linkedOrderId = orderId;
        linkedOrderItemId = orderItemId;
    }

    const existingReview = await Review.findOne({
        product:productId,
        user:userId,
        ...(linkedOrderItemId ? {orderItem : linkedOrderItemId} :{}),
        isDeleted:false,
    });
    if(existingReview){
        throw new ApiError(400, "You have already reviewed this product for the given order item");
    }

    let images = [];
    if(req.files && req.files.length >0){
        for(const file of req.files){
            const uploadResult = await uploadOnCloudinary(file.path);
            if(uploadResult && uploadResult.url){
                images.push({
                    url:uploadResult.url,
                    public_id: uploadResult.public_id,
                })
            }
        }
    }
    
    let aspectsPayload = [];
    if(aspects){
        try{
            const parsed = typeof aspects === 'string' ? JSON.parse(aspects) : aspects;

            if(Array.isArray(parsed)){
                aspectsPayload = parsed
                .filter(
                    (a) => a && a.key && a.score && Number(a.score)>=1 && Number(a.score)<=5
                )
                .map(
                    (a) => ({
                        key: String(a.key).trim(),
                        score: Number(a.score)
                    })
                )
            }
        }
        catch(err){
            throw new ApiError(400, "Invalid aspects format");
        }
    }

    const review = await Review.create({
        product: productId,
        user:userId,
        order:linkedOrderId,
        orderItem:linkedOrderItemId,
        rating,
        title: title || "",
        comment: comment || "",
        images,
        aspects:aspectsPayload,
        isVerifiedPurchase,
        status:"pending",
        isDeleted:false,
        createdBy: userId,
        updatedBy: userId,

    })
    try {
        await createAndSendNotification({
            recipientId: userId,
            recipientRole: "customer",
            recipientEmail: req.user.email,
            type: "REVIEW_SUBMITTED_CUSTOMER",
            title: "Review submitted",
            message: `Your review for "${product.name}" has been submitted and is pending approval.`,
            relatedEntity: {
                entityType: "review",
                entityId: review._id,
            },
            channels: ["in-app", "email"],
            meta: {
                productId: product._id,
                productName: product.name,
                rating: review.rating,
            },
        });
    } catch (err) {
        console.error("REVIEW_SUBMITTED_CUSTOMER notification failed", err);
    }

    return res.status(201).json(
        new ApiResponse(
            201, 
            "Review created successfully", 
            review
        )
    );


});


// this controller is used to update a review for a product
const updateReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { reviewId } = req.params;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  let {rating,title,comment,aspects, keepExistingImages, } = req.body;

  const review = await Review.findOne({
    _id: reviewId,
    user: userId,
    isDeleted: false,
  });

  if (!review) {
    throw new ApiError(404,"Review not found or not accessible for update");
  }

  // Update rating if provided
  if (rating !== undefined) {
    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }
    review.rating = numRating;
  }

  // Update title/comment if provided
  if (title !== undefined) {
    review.title = title || "";
  }
  if (comment !== undefined) {
    review.comment = comment || "";
  }

  // Handle aspects (optional, JSON)
  if (aspects !== undefined) {
    let aspectsPayload = [];
    if (aspects) {
      try {
        const parsed =
          typeof aspects === "string" ? JSON.parse(aspects) : aspects;
        if (Array.isArray(parsed)) {
          aspectsPayload = parsed
            .filter(
              (a) => a && a.key && a.score && Number(a.score) >= 1 && Number(a.score) <= 5
            )
            .map((a) => ({
              key: String(a.key).trim(),
              score: Number(a.score),
            }));
        }
      } catch (err) {
        throw new ApiError(400, "Invalid aspects format");
      }
    }
    review.aspects = aspectsPayload;
  }

  // Handle images:
  // 1) keepExistingImages from client
  // 2) append new uploaded images from req.files
  let finalImages = [];

  // Step 1: keep existing if requested
  if (keepExistingImages !== undefined) {
    let keepList = [];
    try {
      keepList =
        typeof keepExistingImages === "string"
          ? JSON.parse(keepExistingImages)
          : keepExistingImages;
    } catch (err) {
      throw new ApiError(400, "Invalid keepExistingImages format");
    }

    if (!Array.isArray(keepList)) {
      throw new ApiError(400, "keepExistingImages must be an array");
    }

    // in keepList we can use either url or basis of public_id 
    finalImages = review.images.filter((img) =>
      keepList.some(
        (k) =>
          k === img.url ||
          k === img.public_id ||
          (k.url && k.url === img.url)
      )
    );
  } else {
    // if client does not specify explicitly then keep old images as it is by default 
    finalImages = review.images || [];
  }

  // Step 2: new files upload to Cloudinary
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const uploadResult = await uploadOnCloudinary(file.path);
      if (uploadResult && uploadResult.url) {
        finalImages.push({
          url: uploadResult.url,
          public_id: uploadResult.public_id,
        });
      }
    }
  }

  review.images = finalImages;

  review.status = "pending";
  review.updatedBy = userId;

  await review.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      true,
      "Review updated successfully and is pending approval",
      review
    )
  );
});

// this controller is used to delete a review for a product
const deleteReview = asyncHandler(async(req,res) => {
    const userId = req.user._id;
    const { reviewId } = req.params;

    if (!reviewId) {
      throw new ApiError(400, "Review ID is required");
    }
    const review = await Review.findOne({
        _id: reviewId,
        user: userId,
        isDeleted: false,
    });
    if(!review){
        throw new ApiError(404, "Review not found or not accessible for deletion");
    }

    review.isDeleted = true;
    review.updatedBy = userId;
    await review.save();
    return res.status(200).json(
        new ApiResponse(
            200,
            true,
            "Review deleted successfully",
            null
        )
    );
});

// this controller is used to get reviews for a product
const getProductReviews = asyncHandler(async(req,res) => {
    const {productId} = req.params;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }
    const productExists = await Product.exists({
        _id:productId,
        isActive:true,
        isDeleted:false
    });
    if(!productExists){
        throw new ApiError(404, "Product not found");
    }

    const page = parseInt(req.querypage,10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10)|| 10,50);
    const skip = (page -1)*limit;
    
    const ratingFilter = req.query.rating?Number(req.query.rating):null;

    const withImages = req.query.withImages === 'true' || req.query.withImages === true;

    let sort = {createdAt: -1};
    const sortBy = req.query.sortBy || 'newest';

    switch (sortBy) {
        case "oldest":
            sort = { 
                createdAt: 1 
            };
            break;
        case "highest":
            sort = { 
                rating: -1, 
                createdAt: -1 
            };
            break;
        case "lowest":
            sort = { 
                rating: 1, 
                createdAt: -1 
            };
            break;
        case "helpful":
            sort = { 
                helpfulCount: -1, 
                createdAt: -1 
            };
            break;
        default:
        sort = { createdAt: -1 };
    }

    const filters = {
        product: productId,
        status: "approved",
        isDeleted: false,
    };

    if(ratingFilter && ratingFilter>=1 && ratingFilter<=5){
        filters.rating = ratingFilter;
    }
    if(withImages){
        filters["images.0"] = { $exists: true };
    }

    const [reviews, totalCount] = await Promise.all([
        Review.find(filters)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("user","fullname avatar")
        .lean(),
        Review.countDocuments(filters),
    ]);

    return res.status(200)
    .json(new ApiResponse(
        200,
        true,
        "Product reviews fetched successfully",
        {
            reviews,
            totalCount,
            page,
            limit,
        }
    ));
    

});

// this controller is used to get reviews of the logged-in user
const getMyReviews = asyncHandler(async(req,res) => {
    const userId = req.user._id;


    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const skip = (page - 1) * limit;

    const {status, productId} = req.query;

    const filters = {
        user:userId,
        isDeleted:false,
    }

    if(status && ["pending","approved","rejected"].includes(status)){
        filters.status = status;
    }

    if(productId){
        filters.product = productId;
    }

    const [reviews, totalCount] = await Promise.all ([
        Review.find(filters)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("product","name images slug")
        .lean(),
        Review.countDocuments(filters),
    ]);

    return res.status(200)
    .json(new ApiResponse(
        200,
        true,
        "User reviews fetched successfully",
        {
            reviews,
            totalCount,
            page,
            limit
        }
    ))

});

// this controller is used to mark a review as helpful or not helpful
const markReviewHelpful = asyncHandler(async(req,res) =>{

    const userId = req.user._id;
    const {reviewId} = req.params;
    const {value} = req.body;

    if(!reviewId){
        throw new ApiError(400, "Review ID is required");
    }

    if(!["up", "down"].includes(value)){
        throw new ApiError(400, "Value must be either 'up' or 'down'");
    }

    const review = await Review.findOne({
        _id:reviewId,
        isDeleted:false,
        status:"approved",
    })

    if(!review){
        throw new ApiError(404, "Review not found");
    }


    const existingVoteIndex = review.helpfulVotes.findIndex(
        (v) => v.user.toString() === userId.toString()
    )

    let previousValue = null;

    if(existingVoteIndex !== -1){
        previousValue = review.helpfulVotes[existingVoteIndex].value;
    }

    if(previousValue === value){
        return res.status(200)
        .json(new ApiResponse(
            200,
            true,
            "Review helpfulness already marked",
            {
                helpfulCount: review.helpfulCount,
                notHelpfulCount: review.notHelpfulCount,
            }
            
        ))
    }

    if(previousValue === "up"){
        review.helpfulCount = Math.max(0, review.helpfulCount -1);
    }
    else if(previousValue === "down"){
        review.notHelpfulCount = Math.max(0, review.notHelpfulCount -1);
    }

    if(value === "up"){
        review.helpfulCount += 1;
    }
    else if(value === "down"){
        review.notHelpfulCount +=1;
    }

    if(existingVoteIndex === -1){
        review.helpfulVotes.push({
            user:userId,
            value,
        });
    }
    else{
        review.helpfulVotes[existingVoteIndex].value = value;
    }

    await review.save();

    return res 
    .status(200)
    .json(new ApiResponse(
        200,
        true,
        "Review helpfulness updated successfully",
        {
            helpfulCount: review.helpfulCount,
            notHelpfulCount: review.notHelpfulCount,
        }
    ))
});

// this controller is used to report a review
const reportReview = asyncHandler(async(req, res) => {

    const userId = req.user._id;
    const {reviewId} = req.params;
    const {reason} = req.body;

    if(!reviewId){
        throw new ApiError(400, "Review ID is required");
    }
    const review = await Review.findOne({
        _id:reviewId,
        isDeleted:false,
    }).populate("product","name")

    if(!review){
        throw new ApiError(404, "Review not found");
    }

    const alreadyReported = review.reports.some(
        (r) => r.user.toString() === userId.toString()
    );

    if(alreadyReported){
        throw new ApiError(400, "You have already reported this review");
    }
    
    review.reports.push({
        user:userId,
        reason: reason || "",
        reportedAt: new Date(),
    });

    review.reportedCount += 1;

    await review.save();

    const REPORT_THRESHOLD = 3;
    if(review.reportedCount === REPORT_THRESHOLD){
        try {
            await createAndSendNotification({       
                recipientId: null,       
                recipientRole: "admin",      
                recipientEmail: null,
                type: "REVIEW_REPORTED_ADMIN",
                title: "Review reported multiple times",
                message: `A review for "${review.product?.name || "a product"}" has been reported multiple times and may need moderation.`,
                relatedEntity: {
                    entityType: "review",
                    entityId: review._id,
                },
                channels: ["in-app"],
                meta: {
                    productId: review.product?._id,
                    productName: review.product?.name,
                    reviewId: review._id,
                    reportCount: review.reportedCount,
                },
            });
        } catch (err){
            console.error("REVIEW_REPORTED_ADMIN notification failed", err);    
        }
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Review reported successfully",
            {
                reportedCount: review.reportedCount,
            }
        )
    )

});



// ======================================================
// ================ SELLER PANEL HANDLERS ===============
// ======================================================


// this controller is used to get reviews for the seller's products
const getSellerReviews = asyncHandler(async(req,res) => {

    const sellerId = req.user._id;

    const page = parseInt(req.query.page,10) || 1;
    const limit = Math.min(parseInt(req.query.limit,10) || 20,100);
    const skip = (page -1)*limit;

   const {productId, rating, status, hasImages} = req.query;

   const productFilter = {
    seller:sellerId,
    isDeleted: false,
   }
    if(productId){
        productFilter._id = productId;
    }

    const sellerProducts = await Product.find(productFilter).select("_id name images").lean();

    if(sellerProducts.length ===0){
        throw new ApiError(404, "No products found for the seller");
    }

    const productIds = sellerProducts.map((p) => p._id);

    const reviewFilters = {
        product: { $in: productIds},
        isDeleted: false,
    };

    if(rating && Number(rating)>=1 && Number(rating)<=5){
        reviewFilters.rating = Number(rating);
    }

    if(status && ["pending","approved","rejected"].includes(status)){
        reviewFilters.status = status;
    }

    if(hasImages === 'true' || hasImages === true){
        reviewFilters["images.0"] = { $exists: true };
    }

    const [reviews, totalCount] = await Promise.all([
        Review.find(reviewFilters)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("user","fullname email avatar")
        .lean(),
        Review.countDocuments(reviewFilters),
    ]);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Seller reviews fetched successfully",
            {
                reviews,
                totalCount,
                page,
                limit
            }
        )
    )

});

// this controller is used by the seller to reply to a review
const replyToReview = asyncHandler(async(req, res) => {

    const sellerId = req.user._id;
    const { reviewId } = req.params;
    const { reply } = req.body;

    if(!reviewId){
        throw new ApiError(400, "Review ID is required");
    }

    if(!reply || String(reply).trim().length ===0){
        throw new ApiError(400, "Reply content is required");
    }

    const review = await Review.findOne({
        _id: reviewId,
        isDeleted: false,
    }).populate("product", "seller name");

    if(!review){
        throw new ApiError(404, "Review not found");
    }

    const product = await Product.findById(review.product?.id).select("seller name");

    if(!product || product.seller.toString() !== sellerId.toString()){
        throw new ApiError(403, "You are not authorized to reply to this review");
    }

    review.sellerTResponse = {
        reply: String(reply).trim(),
        repliedAt: new Date(),
        replyBy: sellerId,
    }

    await review.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Review replied successfully",
            review
        )
    )
});

// this controller is used to get review summary for the seller's products
const getSellerReviewSummary = asyncHandler(async(req, res) =>{

    const sellerId = req.user._id;
    const {productId} = req.params;

    const productFilter = {
        seller:sellerId,
        isDeleted: false,
    }

    if(productId){
        productFilter._id = productId;
    }

    const products = await Product.find(productFilter).select("_id name images").lean();
    if(products.length ===0){
        throw new ApiError(404, "No products found for the seller");
    }

    const productIds = products.map((p) => p._id);

    const summary = await Review.aggregate([
        {
            $match:{
                product:{ $in: productIds.map((id) => new mongoose.Types.ObjectId(id))},
                status:"approved",
                isDeleted:false,
            },
        },
        {
            $group:{
                _id: "$product",
                avgRating: {$avg: "$rating"},
                totalReviews: {$sum:1},
                star1:{
                    $sum:{
                        $cond:[{$eq:["$rating",1]},1,0]
                    }
                },
                star2:{
                    $sum:{
                        $cond:[{$eq:["$rating",2]},1,0]
                    }
                },
                star3:{
                    $sum:{
                        $cond:[{$eq:["$rating",3]},1,0]
                    }
                },
                star4:{
                    $sum:{
                        $cond:[{$eq:["$rating",4]},1,0]
                    }
                },
                star5:{
                    $sum:{
                        $cond:[{$eq:["$rating",5]},1,0]
                    }
                }
            }
        },
        {
            $sort:{avgRating:-1},
        }
    ]);


    const productMap = new Map();
    for(const p of products){
        productMap.set(String(p._id), p);
    }

    const data = summary.map((s) => {
        const prod = productMap.get(String(s._id)) || {};
        return {
            productId: s._id,
            productName: prod.name || "",
            productImage: prod.images?.[0]?.url || "",
            avgRating: s.avgRating || 0,
            totalReviews: s.totalReviews || 0,
            starBreakdown: {
                1: s.star1 || 0,
                2: s.star2 || 0,
                3: s.star3 || 0,
                4: s.star4 || 0,
                5: s.star5 || 0,
            },
        };
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Seller review summary fetched successfully",
            data
        )
    )

});




// ======================================================
// ================ ADMIN PANEL HANDLERS ================
// ======================================================


// This controller is used to list all reviews in the admin panel
const adminListReviews = asyncHandler(async(req,res) => {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const skip = (page - 1) * limit;

    const {status, rating, productId, sellerId, userId, reportedOnly, from, to} = req.query;


    const filters = {
        isDeleted: false,
    };

    if(status && ["pending","approved","rejected"].includes(status)){
        filters.status = status;
    }

    if(rating && Number(rating)>=1 && Number(rating)<=5){
        filters.rating = Number(rating);
    }

    if(productId){
        filters.product = productId;
    }

    if(userId){
        filters.user = userId;
    }

    if(reportedOnly === 'true' || reportedOnly === true){
        filters.reportedCount = { $gt: 0 };
    }

    if(from || to){
        filters.createdAt = {};
        if(from){
            filters.createdAt.$gte = new Date(from);
        }
        if(to){
            filters.createdAt.$lte = new Date(to);
        }
    }

    let productIdFilterBySeller = null;
    if(sellerId){
        const sellerProducts = await Product.find({
            seller: sellerId,
            isDeleted: false,
        }).select("_id").lean();

        if(sellerProducts.length ===0){
            return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    true,
                    "No reviews found for the given seller",
                    {
                        reviews: [],
                        totalCount: 0,
                        page,
                        limit,
                    }
                )
            )
        }
        productIdFilterBySeller = sellerProducts.map((p) => p._id);
        filters.product = { $in: productIdFilterBySeller };
    };

    const [reviews, totalCount] = await Promise.all([
        Review.find(filters)
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)
        .populate("product","name seller")
        .populate("user","fullname email")
        .lean(),
        Review.countDocuments(filters),
    ]);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Admin reviews fetched successfully",
            {
                reviews,
                totalCount,
                page,
                limit
            }
        )
    )

});

// This controller is used to get review details in the admin panel
const adminGetReviewDetails = asyncHandler(async(req,res) => {
    const {reviewId} = req.params;

    if(!reviewId){
        throw new ApiError(400, "Review ID is required");
    }

    const review = await Review.findOne({
        _id:reviewId,
        isDeleted:false,
    })
    .populate("product", "name images seller")
    .populate("user","fullname email")
    .populate("order", "orderId status createdAt")
    .populate("sellerResponse.respondeBy","fullname email")
    .lean();

    if(!review){
        throw new ApiError(404, "Review not found");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            "Review details fetched successfully",
            review
        )
    )
});

// This controller is used by admin to approve or reject a review
const adminModerateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { action, reason } = req.body; 

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  if (!["approve", "reject"].includes(action)) {
    throw new ApiError(400, 'Action must be "approve" or "reject"');
  }

  const review = await Review.findOne({
    _id: reviewId,
    isDeleted: false,
  })
    .populate("product", "name seller")
    .populate("user", "fullname email");

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.status === "approved" && action === "approve") {
    throw new ApiError(400, "Review is already approved");
  }

  if (review.status === "rejected" && action === "reject") {
    throw new ApiError(400, "Review is already rejected");
  }

  if (action === "approve") {
    review.status = "approved";
    review.rejectionReason = "";
  } else if (action === "reject") {
    review.status = "rejected";
    review.rejectionReason =
      reason || "Review does not comply with guidelines";
  }

  await review.save();

  const product = await Product.findById(review.product?._id)
    .select("name seller")
    .populate("seller", "fullname email");

  try {
    if (action === "approve") {
      await createAndSendNotification({
        recipientId: review.user._id,
        recipientRole: "customer",
        recipientEmail: review.user.email,
        type: "REVIEW_APPROVED_CUSTOMER",
        title: "Your review is now live",
        message: `Your review on "${review.product?.name}" has been approved and is now visible.`,
        relatedEntity: {
          entityType: "review",
          entityId: review._id,
        },
        channels: ["in-app", "email"],
        meta: {
          productId: review.product?._id,
          productName: review.product?.name,
          rating: review.rating,
        },
      });
    } else if (action === "reject") {
      await createAndSendNotification({
        recipientId: review.user._id,
        recipientRole: "customer",
        recipientEmail: review.user.email,
        type: "REVIEW_REJECTED_CUSTOMER",
        title: "Your review was not approved",
        message: `Your review on "${review.product?.name}" was rejected.`,
        relatedEntity: {
          entityType: "review",
          entityId: review._id,
        },
        channels: ["in-app", "email"],
        meta: {
          productId: review.product?._id,
          productName: review.product?.name,
          rating: review.rating,
          reason: review.rejectionReason,
        },
      });
    }
  } catch (err) {
    console.error("Customer review moderation notification failed", err);
  }

  if (action === "approve" && product && product.seller) {
    try {

      await createAndSendNotification({
        recipientId: product.seller._id,
        recipientRole: "seller",
        recipientEmail: product.seller.email,
        type: "NEW_REVIEW_FOR_PRODUCT",
        title: "New review on your product",
        message: `Your product "${product.name}" received a new ${review.rating}★ review.`,
        relatedEntity: {
          entityType: "review",
          entityId: review._id,
        },
        channels: ["in-app", "email"],
        meta: {
          productId: product._id,
          productName: product.name,
          rating: review.rating,
        },
      });

      if (review.rating <= 2) {
        await createAndSendNotification({
          recipientId: product.seller._id,
          recipientRole: "seller",
          recipientEmail: product.seller.email,
          type: "LOW_RATING_REVIEW_ALERT",
          title: "Low rating review alert",
          message: `Your product "${product.name}" received a low rating (${review.rating}★).`,
          relatedEntity: {
            entityType: "review",
            entityId: review._id,
          },
          channels: ["in-app", "email"],
          meta: {
            productId: product._id,
            productName: product.name,
            rating: review.rating,
          },
        });
      }
    } catch (err) {
      console.error("Seller review notification failed", err);
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      true,
      `Review ${action === "approve" ? "approved" : "rejected"} successfully`,
      review
    )
  );
});

// This controller is used by admin to feature or unfeature a review
const adminFeatureReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { featured } = req.body; // boolean

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  if (typeof featured !== "boolean") {
    throw new ApiError(400, "Featured must be a boolean");
  }

  const review = await Review.findOne({
    _id: reviewId,
    isDeleted: false,
  });

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  review.isFeatured = featured;
  await review.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      true,
      `Review ${
        featured ? "featured" : "unfeatured"
      } successfully`,
      review
    )
  );
});

// This controller is used by admin to delete a review
const adminDeleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    throw new ApiError(400, "Review ID is required");
  }

  const review = await Review.findOne({
    _id: reviewId,
    isDeleted: false,
  });

  if (!review) {
    throw new ApiError(404, "Review not found or already deleted");
  }

  review.isDeleted = true;
  await review.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      true,
      "Review deleted successfully",
      null
    )
  );
});

// This controller is used by admin to get reviews analytics
const adminReviewsAnalytics = asyncHandler(async (req, res) => {

  const [summary] = await Review.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        pending: {
          $sum: {
            $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
          },
        },
        approved: {
          $sum: {
            $cond: [{ $eq: ["$status", "approved"] }, 1, 0],
          },
        },
        rejected: {
          $sum: {
            $cond: [{ $eq: ["$status", "rejected"] }, 1, 0],
          },
        },
        avgRating: { $avg: "$rating" },
        star1: {
          $sum: {
            $cond: [{ $eq: ["$rating", 1] }, 1, 0],
          },
        },
        star2: {
          $sum: {
            $cond: [{ $eq: ["$rating", 2] }, 1, 0],
          },
        },
        star3: {
          $sum: {
            $cond: [{ $eq: ["$rating", 3] }, 1, 0],
          },
        },
        star4: {
          $sum: {
            $cond: [{ $eq: ["$rating", 4] }, 1, 0],
          },
        },
        star5: {
          $sum: {
            $cond: [{ $eq: ["$rating", 5] }, 1, 0],
          },
        },
      },
    },
  ]);

  const topProducts = await Review.aggregate([
    {
      $match: {
        isDeleted: false,
        status: "approved",
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
  ]);

  const productIds = topProducts.map((t) => t._id);
  const products = await Product.find({
    _id: { $in: productIds },
  })
    .select("name images")
    .lean();

  const productMap = new Map();
  for (const p of products) {
    productMap.set(String(p._id), p);
  }

  const topProductsWithInfo = topProducts.map((t) => {
    const p = productMap.get(String(t._id)) || {};
    return {
      productId: t._id,
      productName: p.name || "",
      productImage: p.images?.[0]?.url || "",
      totalReviews: t.totalReviews,
      avgRating: t.avgRating,
    };
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      true,
      "Reviews analytics fetched successfully",
      {
        summary: summary || {
          totalReviews: 0,
          pending: 0,
          approved: 0,
          rejected: 0,
          avgRating: 0,
          star1: 0,
          star2: 0,
          star3: 0,
          star4: 0,
          star5: 0,
        },
        topProducts: topProductsWithInfo,
      }
    )
  );
});




export {
    createReview,
    updateReview,
    deleteReview,
    getProductReviews,
    getMyReviews,
    markReviewHelpful,
    reportReview,

    getSellerReviews,
    replyToReview,
    getSellerReviewSummary,
    adminListReviews,
    adminGetReviewDetails,
    adminModerateReview,
    adminFeatureReview,
    adminDeleteReview,
    adminReviewsAnalytics,
}
