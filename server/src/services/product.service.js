// This service module handles all product-related operations such as fetching products, submitting reviews, asking questions, and creating/updating products. It interacts with the Product, Order, ProductQnA, and Review models to perform database operations and also integrates with the NotificationService to emit events for actions like new product creation or question submission. The service includes methods for customers to get products and submit reviews/questions, as well as methods for sellers to manage their products.

import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import {
  uploadMultiple,
  deleteMultipleFromCloudinary,
} from "../utils/cloudinary.js";
import { Order } from "../models/order.model.js";
import { ProductQnA } from "../models/productQnA.model.js";
import { Review } from "../models/review.model.js";
import NotificationService from "../services/notification/notification.service.js";
import mongoose from "mongoose";

// NOTE: All methods that take productId as input validate it first before proceeding with any database operations to ensure that the ID is in the correct format and to prevent unnecessary database queries. This validation step is crucial for maintaining the integrity of the application and providing meaningful error messages to the client when invalid IDs are supplied.
export const productService = {
  // This method allows customers to retrieve a list of products based on various query parameters such as search keywords, category, brand, price range, rating, discount, size, stock availability, and sorting options. It constructs a dynamic filter object based on the provided query parameters and executes a MongoDB query to fetch the matching products. The results are paginated and returned along with metadata about the total number of products and total pages.
  async customerGetAllProducts(query) {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      discount,
      size,
      inStock,
      sort,
      page = 1,
      limit = 12,
    } = query;

    const filter = {
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    };

    // SEARCH
    if (search) {
      filter.$text = { $search: search };
    }

    // CATEGORY
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(400, "Invalid category ID");
      }
      filter.category = category;
    }

    // BRAND
    if (brand) {
      filter.brand = { $in: brand.split(",") };
    }

    // PRICE FILTER (Decimal Safe)
    if (minPrice || maxPrice) {
      filter.finalPrice = {};

      if (minPrice) {
        filter.finalPrice.$gte = mongoose.Types.Decimal128.fromString(minPrice);
      }

      if (maxPrice) {
        filter.finalPrice.$lte = mongoose.Types.Decimal128.fromString(maxPrice);
      }
    }

    // RATING
    if (rating) {
      filter.ratings = { $gte: Number(rating) };
    }

    // DISCOUNT
    if (discount) {
      filter.discount = { $gte: Number(discount) };
    }

    // STOCK
    if (inStock === "true") {
      filter.stock = { $gt: 0 };
    }

    // VARIANT SIZE
    if (size) {
      filter["variants.options.value"] = { $in: size.split(",") };
    }

    // SORT
    const sortOptions = {
      priceLowToHigh: { finalPrice: 1 },
      priceHighToLow: { finalPrice: -1 },
      ratingHighToLow: { ratings: -1 },
      bestSelling: { sold: -1 },
      discountHighToLow: { discount: -1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select(
        "name slug finalPrice price discount ratings images stock brand category",
      )
      .populate("category", "name slug");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    };
  },

  // This method retrieves detailed information about a specific product by its ID. It first validates the product ID format, then queries the database for a product that matches the ID and is not deleted, active, and approved. If the product is found, it populates the seller's basic information and category details before returning the product data. If the product is not found or if the ID is invalid, it throws an appropriate error.
  async getProductById(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    })
      .populate("seller", "fullname username avatar")
      .populate("category", "name slug");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  },

  // This method retrieves the top-rated products based on their ratings. It queries the database for products that are not deleted, active, and approved, sorts them in descending order of their ratings, and limits the results to a specified number (default is 10). The returned product data includes the name, final price, discount, ratings, images, and stock information.
  async getTopRatedProduct(limit = 10) {
    const products = await Product.find({
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    })
      .sort({ ratings: -1 })
      .limit(Number(limit))
      .select("name finalPrice discount ratings images stock");

    return products;
  },

  // This method retrieves the newest products based on their creation date. It queries the database for products that are not deleted, active, and approved, sorts them in descending order of their creation date, and limits the results to a specified number (default is 10). The returned product data includes the name, final price, discount, ratings, images, and stock information.
  async getNewArrivalProduct(limit = 10) {
    return await Product.find({
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("name finalPrice discount ratings images stock");
  },

  // This method retrieves products that belong to a specific category. It validates the category ID, constructs a filter to find products that match the category and are not deleted, active, and approved, and applies sorting based on query parameters. The results are paginated and returned along with metadata about the total number of products and total pages.
  async getProductsByCategory(categoryId, query) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const { page = 1, limit = 10, sort } = query;

    const filter = {
      category: categoryId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    };

    const sortOptions = {
      priceLowToHigh: { finalPrice: 1 },
      priceHighToLow: { finalPrice: -1 },
      ratingHighToLow: { ratings: -1 },
      bestSelling: { sold: -1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select("name slug finalPrice discount ratings images stock brand")
      .populate("category", "name slug");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    };
  },

  // This method allows customers to submit a review for a specific product. It validates the product ID, checks if the user has purchased the product, and then either creates a new review or updates an existing one. After saving the review, it recalculates the average rating and total reviews for the product and updates the product document accordingly. The method returns the review and a message indicating whether it was created or updated.
  async searchProduct(queryParams) {
    const {
      query,
      brand,
      category,
      minPrice,
      maxPrice,
      sort,
      tags,
      page = 1,
      limit = 10,
    } = queryParams;

    const filter = {
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    };

    if (query) {
      filter.$text = { $search: query };
    }

    if (brand) {
      filter.brand = { $in: brand.split(",") };
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(400, "Invalid category ID");
      }
      filter.category = category;
    }

    if (tags) {
      filter.tags = { $in: tags.split(",") };
    }

    if (minPrice || maxPrice) {
      filter.finalPrice = {};

      if (minPrice) {
        filter.finalPrice.$gte = mongoose.Types.Decimal128.fromString(minPrice);
      }

      if (maxPrice) {
        filter.finalPrice.$lte = mongoose.Types.Decimal128.fromString(maxPrice);
      }
    }

    const sortOptions = {
      priceLowToHigh: { finalPrice: 1 },
      priceHighToLow: { finalPrice: -1 },
      ratingHighToLow: { ratings: -1 },
      bestSelling: { sold: -1 },
      newest: { createdAt: -1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select("name slug finalPrice discount ratings images stock brand");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    };
  },

  // This method retrieves products that are related to a specific product based on shared category, tags, and brand. It validates the product ID, fetches the main product to determine its category, tags, and brand, and then constructs a filter to find other products that share these attributes while excluding the main product itself. The results are sorted by ratings and sales, paginated, and returned along with metadata about the total number of related products and total pages.
  async getRelatedProducts(productId, query) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { page = 1, limit = 10 } = query;

    const mainProduct = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    });

    if (!mainProduct) {
      throw new ApiError(404, "Product not found");
    }

    const filter = {
      _id: { $ne: productId },
      category: mainProduct.category,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    };

    // OPTIONAL MATCH CONDITIONS
    const optionalConditions = [];

    if (mainProduct.tags && mainProduct.tags.length > 0) {
      optionalConditions.push({ tags: { $in: mainProduct.tags } });
    }

    if (mainProduct.brand) {
      optionalConditions.push({ brand: mainProduct.brand });
    }

    if (optionalConditions.length > 0) {
      filter.$or = optionalConditions;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort({ ratings: -1, sold: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select("name slug finalPrice discount ratings images stock brand");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    };
  },

  // This method retrieves the reviews for a specific product based on the product ID and query parameters such as rating filter, pagination, and sorting. It validates the product ID, checks if the product exists and is active, and then constructs a filter to find reviews that match the product and have an approved status. The reviews are sorted by creation date, paginated, and returned along with metadata about the total number of reviews and total pages.
  async getProductReviews(productId, query) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { rating, page = 1, limit = 10 } = query;

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const filter = {
      product: productId,
      status: "approved", // IMPORTANT
    };

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("user", "fullname username avatar");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reviews,
    };
  },

  // This method allows customers to submit a review for a specific product. It validates the product ID, checks if the user has purchased the product, and then either creates a new review or updates an existing one. After saving the review, it recalculates the average rating and total reviews for the product and updates the product document accordingly. The method returns the review and a message indicating whether it was created or updated.
  async submitReview(productId, userId, body) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { rating, comment, title = "" } = body;

    if (!rating || rating < 1 || rating > 5) {
      throw new ApiError(400, "Rating must be between 1 and 5");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const hasPurchased = await Order.exists({
      user: userId,
      "items.product": productId,
      status: "delivered",
    });

    if (!hasPurchased) {
      throw new ApiError(403, "Only verified buyers can review this product");
    }

    let review = await Review.findOne({
      product: productId,
      user: userId,
    });

    let message = "";

    if (review) {
      review.rating = rating;
      review.comment = comment;
      review.title = title;
      review.status = "pending";
      await review.save();
      message = "Review updated successfully";
    } else {
      review = await Review.create({
        product: productId,
        user: userId,
        rating,
        title,
        comment,
        status: "pending",
      });
      message = "Review submitted successfully";
    }

    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
          total: { $sum: 1 },
        },
      },
    ]);

    const avg = stats[0]?.averageRating || 0;
    const count = stats[0]?.total || 0;

    await Product.findByIdAndUpdate(productId, {
      ratings: avg,
      reviews: count,
    });

    return { review, message };
  },

  // This method retrieves the questions and answers (QnA) for a specific product. It validates the product ID, checks if the product exists and is active, and then constructs a filter to find QnA entries that match the product and have a status of either "pending" or "answered". The QnA entries are sorted by creation date, paginated, and returned along with metadata about the total number of QnA entries and total pages. Each QnA entry includes populated information about the user who asked the question and the seller who answered it.
  async getProductQnA(productId, query) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { page = 1, limit = 10 } = query;

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const filter = {
      product: productId,
      status: { $in: ["pending", "answered"] },
    };

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const total = await ProductQnA.countDocuments(filter);

    const qna = await ProductQnA.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("user", "fullname username avatar")
      .populate("answeredBy", "fullname username avatar role");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      qna,
    };
  },

  // This method allows customers to ask a question about a specific product. It validates the product ID, checks if the product exists and is active, and then creates a new QnA entry with the question. After saving the QnA entry, it emits a notification to the seller of the product to inform them about the new question. The method returns the created QnA entry.
  async askProductQuestion(productId, userId, body) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { question } = body;

    if (!question || question.trim().length < 5) {
      throw new ApiError(400, "Question must be at least 5 characters");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved",
    }).populate("seller", "email");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const newQnA = await ProductQnA.create({
      product: productId,
      seller: product.seller._id,
      user: userId,
      question: question.trim(),
      status: "pending",
    });

    // Notify seller
    await NotificationService.emit("NEW_PRODUCT_QUESTION", {
      recipientId: product.seller._id,
      recipientRole: "seller",
      relatedEntity: {
        entityType: "product",
        entityId: product._id,
      },
      meta: {
        questionId: newQnA._id,
      },
    });

    return newQnA;
  },

  // This method allows sellers to respond to a question asked about their product. It validates the product ID and question ID, checks if the QnA entry exists and belongs to the seller, and then updates the QnA entry with the provided answer. After saving the answer, it emits a notification to the customer who asked the question to inform them about the response. The method returns the updated QnA entry.
  async respondToProductQnA(productId, questionId, sellerId, body) {
    const { answer } = body;

    if (!answer || answer.trim().length < 3) {
      throw new ApiError(400, "Answer must be at least 3 characters");
    }

    const qna = await ProductQnA.findOne({
      _id: questionId,
      product: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!qna) {
      throw new ApiError(404, "Question not found");
    }

    if (qna.status === "answered") {
      throw new ApiError(400, "Question already answered");
    }

    qna.answer = answer.trim();
    qna.answeredBy = sellerId;
    qna.status = "answered";

    await qna.save();

    await NotificationService.emit("QNA_ANSWERED", {
      recipientId: qna.user,
      recipientRole: "customer",
      relatedEntity: {
        entityType: "product",
        entityId: productId,
      },
      meta: {
        questionId: qna._id,
      },
    });

    return qna;
  },

  // This method allows sellers to create a new product listing. It validates the required fields, checks the validity and status of the category, and ensures that at least one image is provided. The images are uploaded to Cloudinary with rollback safety in case of any errors during product creation. After successfully creating the product, it emits a notification to all active admins to inform them about the new product pending approval. The method returns the created product.
  async createProduct(sellerId, body, files) {
    const { name, description, price, stock, brand, category, variants } = body;

    if (!name || !description || !price || !stock || !category) {
      throw new ApiError(400, "Required fields are missing");
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const categoryDoc = await Category.findOne({
      _id: category,
      isDeleted: false,
      isActive: true,
      status: "approved",
    });

    if (!categoryDoc) {
      throw new ApiError(400, "Invalid or inactive category");
    }

    if (!files || files.length === 0) {
      throw new ApiError(400, "At least one image is required");
    }

    // Upload Images with rollback safety

    const uploadedImages = await uploadMultiple(files, {
      folder: "SmartCart/products",
    });
    try {
      const product = await Product.create({
        name,
        description,
        price: mongoose.Types.Decimal128.fromString(price.toString()),
        stock: Number(stock),
        brand,
        category,
        images: uploadedImages,
        seller: sellerId,
        variants: variants ? JSON.parse(variants) : [],
        approvalStatus: "pending",
        isActive: false, // IMPORTANT FIX
      });

      // Fetch all active admins
      const admins = await User.find({
        role: "admin",
        isActive: true,
        isDeleted: false,
      });

      for (const admin of admins) {
        await NotificationService.emit("PRODUCT_CREATED_PENDING", {
          recipient: admin._id, // ✅ REQUIRED
          recipientRole: "admin",
          entityType: "Product",
          entityId: product._id,
          category: "product",
          priority: "medium",
          meta: {
            productName: product.name,
            sellerId,
          },
        });
      }

      return product;
    } catch (error) {
      // Rollback Cloudinary images
      for (const img of uploadedImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }

      throw error;
    }
  },

  // This method allows sellers to retrieve a list of their own products based on various query parameters such as approval status, category, pagination, and sorting options. It constructs a dynamic filter object based on the provided query parameters and executes a MongoDB query to fetch the matching products that belong to the seller. The results are paginated and returned along with metadata about the total number of products and total pages.
  async getSellerProducts(sellerId, query) {
    const { status, category, page = 1, limit = 10, sort = "newest" } = query;

    const filter = {
      seller: sellerId,
      isDeleted: false,
    };

    if (status) {
      filter.approvalStatus = status;
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(400, "Invalid category ID");
      }
      filter.category = category;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit)); // CAP at 50

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      pending: { approvalStatus: 1 },
      bestSelling: { sold: -1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select(
        "name slug finalPrice stock approvalStatus isActive isArchived createdAt",
      )
      .lean();

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    };
  },

  // This method allows sellers to update an existing product listing. It validates the product ID, checks if the product exists and belongs to the seller, and then applies updates based on a whitelist of allowed fields. The method also handles image updates with rollback safety, resets the approval status to pending, and emits notifications to all active admins about the updated product pending approval. The updated product is returned at the end.
  async updateProduct(productId, sellerId, body, files) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    /////////////////////////////////////////////////////////
    // FIELD WHITELIST
    /////////////////////////////////////////////////////////

    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "brand",
      "category",
      "variants",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    /////////////////////////////////////////////////////////
    // CATEGORY VALIDATION
    /////////////////////////////////////////////////////////

    if (updates.category) {
      if (!mongoose.Types.ObjectId.isValid(updates.category)) {
        throw new ApiError(400, "Invalid category ID");
      }

      const categoryDoc = await Category.findOne({
        _id: updates.category,
        isDeleted: false,
        isActive: true,
        status: "approved",
      });

      if (!categoryDoc) {
        throw new ApiError(400, "Invalid or inactive category");
      }
    }

    /////////////////////////////////////////////////////////
    // DECIMAL SAFE PRICE
    /////////////////////////////////////////////////////////

    if (updates.price) {
      updates.price = mongoose.Types.Decimal128.fromString(
        updates.price.toString(),
      );
    }

    /////////////////////////////////////////////////////////
    // IMAGE HANDLING (SAFE + ROLLBACK READY)
    /////////////////////////////////////////////////////////

    if (files && files.length > 0) {
      // 1️⃣ Upload new images first (atomic via cloudinary util)
      const newImages = await uploadMultiple(files, {
        folder: "SmartCart/products",
      });

      // 2️⃣ Delete old images AFTER successful upload
      const oldPublicIds = product.images.map((img) => img.public_id);

      await deleteMultipleFromCloudinary(oldPublicIds);

      product.images = newImages;
    }

    /////////////////////////////////////////////////////////
    // APPLY UPDATES
    /////////////////////////////////////////////////////////

    Object.assign(product, updates);

    /////////////////////////////////////////////////////////
    // RESET APPROVAL FLOW
    /////////////////////////////////////////////////////////

    product.approvalStatus = "pending";
    product.isActive = false;

    await product.save();

    /////////////////////////////////////////////////////////
    // NOTIFY ADMINS
    /////////////////////////////////////////////////////////

    const admins = await User.find({
      role: "admin",
      isActive: true,
      isDeleted: false,
    });

    for (const admin of admins) {
      await NotificationService.emit("PRODUCT_UPDATED_PENDING", {
        recipient: admin._id,
        recipientRole: "admin",
        category: "product",
        entityType: "Product",
        entityId: product._id,
        meta: {
          productName: product.name,
          sellerId,
        },
      });
    }

    return product;
  },

  // This method allows sellers to delete a product listing. It validates the product ID, checks if the product exists and belongs to the seller, and then determines whether to perform a soft delete or archive the product based on existing order dependencies. If the product has existing orders, it is archived instead of deleted. The method also handles image cleanup from Cloudinary and returns a message indicating the result of the deletion operation.
  async deleteProduct(productId, sellerId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    /////////////////////////////////////////////////////////
    // CHECK ORDER DEPENDENCY
    /////////////////////////////////////////////////////////

    const hasOrders = await Order.exists({
      "items.product": productId,
    });

    if (hasOrders) {
      product.isActive = false;
      product.isArchived = true;

      await product.save();

      return {
        message: "Product archived because it has existing orders",
      };
    }

    /////////////////////////////////////////////////////////
    // SOFT DELETE
    /////////////////////////////////////////////////////////

    product.isDeleted = true;
    product.isActive = false;
    product.isArchived = false;

    await product.save();

    /////////////////////////////////////////////////////////
    // CLEANUP IMAGES SAFELY
    /////////////////////////////////////////////////////////

    const publicIds = product.images.map((img) => img.public_id);

    await deleteMultipleFromCloudinary(publicIds);

    return {
      message: "Product deleted successfully",
    };
  },

  // This method allows sellers to manage the stock of a product. It validates the product ID, checks if the product exists and belongs to the seller, and then updates the stock value. The method also includes variant safety checks to prevent updating base stock when variants exist. Additionally, it automatically controls the visibility of the product based on stock availability. If the stock is set to zero, the product is marked as inactive. The updated product is returned at the end.
  async manageProductStock(productId, sellerId, stockValue) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    if (stockValue === undefined || stockValue === null) {
      throw new ApiError(400, "Stock value is required");
    }

    const stock = Number(stockValue);

    if (isNaN(stock) || stock < 0) {
      throw new ApiError(400, "Stock must be a non-negative number");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // VARIANT SAFETY

    if (product.variants && product.variants.length > 0) {
      throw new ApiError(
        400,
        "Cannot update base stock when variants exist. Update variant stock instead.",
      );
    }

    // UPDATE STOCK

    product.stock = stock;

    // Auto visibility control
    if (stock === 0) {
      product.isActive = false;
    }

    await product.save();

    return product;
  },

  // This method allows sellers to manage the variants of a product. It validates the product ID, checks if the product exists and belongs to the seller, and then applies updates to the variants based on the provided data. The method includes comprehensive validation for variant labels, options, stock values, and price overrides. After updating the variants, it resets the approval status to pending and emits notifications to all active admins about the updated product pending approval. The updated product is returned at the end.
  async variantManagement(productId, sellerId, variants) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    if (!Array.isArray(variants) || variants.length === 0) {
      throw new ApiError(400, "Variants must be a non-empty array");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // VALIDATION LOGIC

    for (const variant of variants) {
      if (!variant.label || typeof variant.label !== "string") {
        throw new ApiError(400, "Each variant must have a label");
      }

      if (!Array.isArray(variant.options) || variant.options.length === 0) {
        throw new ApiError(
          400,
          `Variant "${variant.label}" must have at least one option`,
        );
      }

      const seenValues = new Set();

      for (const option of variant.options) {
        if (!option.value) {
          throw new ApiError(
            400,
            `Option value missing in variant "${variant.label}"`,
          );
        }

        if (seenValues.has(option.value)) {
          throw new ApiError(
            400,
            `Duplicate option "${option.value}" in variant "${variant.label}"`,
          );
        }

        seenValues.add(option.value);

        const stock = Number(option.stock);

        if (isNaN(stock) || stock < 0) {
          throw new ApiError(400, `Invalid stock for option "${option.value}"`);
        }

        option.stock = stock;

        // Optional: price override validation
        if (option.price) {
          option.price = mongoose.Types.Decimal128.fromString(
            option.price.toString(),
          );
        }
      }
    }

    // APPLY VARIANTS

    product.variants = variants;

    // Base stock meaningless now
    product.stock = 0;

    // RESET APPROVAL FLOW

    product.approvalStatus = "pending";
    product.isActive = false;

    await product.save();

    // NOTIFY ADMINS

    const admins = await User.find({
      role: "admin",
      isActive: true,
      isDeleted: false,
    });

    for (const admin of admins) {
      await NotificationService.emit("PRODUCT_UPDATED_PENDING", {
        recipient: admin._id,
        recipientRole: "admin",
        category: "product",
        entityType: "Product",
        entityId: product._id,
        meta: {
          productName: product.name,
          sellerId,
        },
      });
    }

    return product;
  },

  // This method allows sellers to retrieve the orders that include a specific product. It validates the product ID, checks if the product exists and belongs to the seller, and then constructs a filter to find orders that contain the product in their items. The method also supports filtering by order status and includes pagination. The results are returned along with metadata about the total number of orders and total pages.
  async getProductOrders(productId, sellerId, query) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { page = 1, limit = 10, status } = query;

    // VERIFY PRODUCT OWNERSHIP

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    // BUILD FILTER

    const filter = {
      "items.product": productId,
      "items.seller": sellerId,
    };

    if (status) {
      filter.orderStatus = status;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));

    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("user", "fullname email")
      .lean();

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      orders,
    };
  },

  // This method allows sellers to archive a product listing. It validates the product ID, checks if the product exists and belongs to the seller, and then updates the product's status to archived. If the product is already archived, it returns a message indicating that. The method returns the updated product along with information about whether it was already archived or not.
  async archiveProduct(productId, sellerId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.isArchived) {
      return {
        alreadyArchived: true,
        product,
      };
    }

    product.isActive = false;
    product.isArchived = true;

    await product.save();

    return {
      alreadyArchived: false,
      product,
    };
  },

  // This method allows sellers to restore an archived product listing. It validates the product ID, checks if the product exists and belongs to the seller, and then updates the product's status to active and not archived. If the product is not currently archived, it returns a message indicating that. The method returns the updated product along with information about whether it was not archived or not.
  async restoreArchiveProduct(productId, sellerId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (!product.isArchived) {
      return {
        notArchived: true,
        product,
      };
    }

    product.isArchived = false;

    if (product.approvalStatus === "approved") {
      product.isActive = true;
    }

    await product.save();

    return {
      notArchived: false,
      product,
    };
  },

  // This method allows sellers to retrieve the feedback (reviews) for a specific product. It validates the product ID, checks if the product exists and belongs to the seller, and then constructs a filter to find reviews that match the product and have an approved status. The reviews are sorted by creation date, paginated, and returned along with metadata about the average rating, total number of reviews, and total pages. Each review includes populated information about the user who submitted it.
  async getProductFeedback(productId, sellerId, query) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { page = 1, limit = 10 } = query;

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Number(limit));

    // Only APPROVED reviews matter

    const filter = {
      product: productId,
      status: "approved",
    };

    const total = await Review.countDocuments(filter);

    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("user", "fullname username avatar")
      .lean();

    // Rating Stats (optimized)

    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
          status: "approved",
        },
      },
      {
        $group: {
          _id: "$product",
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    return {
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      reviews,
    };
  },

  // This method allows sellers to toggle the featured status of a product. It validates the product ID, checks if the product exists and belongs to the seller, and then updates the featured status based on the provided value. The method includes checks to ensure that only approved and active products can be featured, and it enforces a limit of 5 active featured products per seller. The updated product is returned at the end.
  async toggleProductFeature(productId, sellerId, featured) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    if (typeof featured !== "boolean") {
      throw new ApiError(400, "featured must be true or false");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (featured) {
      if (
        product.approvalStatus !== "approved" ||
        !product.isActive ||
        product.isArchived
      ) {
        throw new ApiError(
          400,
          "Only approved and active products can be featured",
        );
      }

      const featuredCount = await Product.countDocuments({
        seller: sellerId,
        featured: true,
        isActive: true,
        isDeleted: false,
      });

      if (featuredCount >= 5) {
        throw new ApiError(
          400,
          "Feature limit reached (max 5 active featured products)",
        );
      }
    }

    product.featured = featured;

    await product.save();

    return product;
  },

  // This method allows sellers to schedule a flash sale for a specific product. It validates the product ID, checks if the product exists and belongs to the seller, and then validates the provided start and end dates as well as the discount percentage. The method ensures that only approved and active products can have flash sales and that there are no overlapping flash sales for the same product. After setting up the flash sale details, it saves the product and returns the updated product information.
  async scheduleFlashSale(productId, sellerId, body) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const { start, end, discount } = body;

    if (!start || !end || discount === undefined) {
      throw new ApiError(400, "Start, end and discount are required");
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();

    if (isNaN(startDate) || isNaN(endDate)) {
      throw new ApiError(400, "Invalid date format");
    }

    if (startDate <= now) {
      throw new ApiError(400, "Start date must be in the future");
    }

    if (endDate <= startDate) {
      throw new ApiError(400, "End date must be after start date");
    }

    const discountNum = Number(discount);

    if (isNaN(discountNum) || discountNum < 1 || discountNum > 90) {
      throw new ApiError(400, "Discount must be between 1 and 90");
    }

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (
      product.approvalStatus !== "approved" ||
      !product.isActive ||
      product.isArchived
    ) {
      throw new ApiError(
        400,
        "Only approved and active products can have flash sales",
      );
    }

    if (product.flashSale?.isActive && product.flashSale.end > now) {
      throw new ApiError(
        400,
        "An active flash sale already exists for this product",
      );
    }

    product.flashSale = {
      start: startDate,
      end: endDate,
      discount: discountNum,
      isActive: true,
    };

    await product.save();

    return product;
  },

  // This method allows admins to approve a product listing. It validates the product ID, checks if the product exists, and then updates the product's approval status to approved and marks it as active. If the product is already approved, it returns a message indicating that. After approving the product, it emits a notification to the seller to inform them about the approval. The method returns the updated product along with information about whether it was already approved or not.
  async approveProduct(productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).populate("seller", "email fullname role");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.isArchived) {
      throw new ApiError(400, "Archived product cannot be approved");
    }

    if (product.approvalStatus === "approved") {
      return {
        alreadyApproved: true,
        product,
      };
    }

    product.approvalStatus = "approved";
    product.isActive = true;

    await product.save();

    await NotificationService.emit("PRODUCT_APPROVED", {
      recipient: product.seller._id,
      recipientRole: "seller",
      category: "product",
      entityType: "Product",
      entityId: product._id,
      priority: "high",
      meta: {
        productName: product.name,
      },
      email: product.seller.email,
    });

    return {
      alreadyApproved: false,
      product,
    };
  },

  // This method allows admins to reject a product listing. It validates the product ID and the rejection reason, checks if the product exists, and then updates the product's approval status to rejected and marks it as inactive. If the product is already rejected, it returns a message indicating that. After rejecting the product, it emits a notification to the seller to inform them about the rejection along with the provided reason. The method returns the updated product along with information about whether it was already rejected or not.
  async rejectProduct(productId, reason) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    if (!reason || reason.trim().length < 5) {
      throw new ApiError(400, "Rejection reason must be at least 5 characters");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).populate("seller", "email fullname role");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (product.isArchived) {
      throw new ApiError(400, "Archived product cannot be rejected");
    }

    if (product.approvalStatus === "rejected") {
      return {
        alreadyRejected: true,
        product,
      };
    }

    product.approvalStatus = "rejected";
    product.isActive = false;

    await product.save();

    await NotificationService.emit("PRODUCT_REJECTED", {
      recipient: product.seller._id,
      recipientRole: "seller",
      category: "product",
      entityType: "Product",
      entityId: product._id,
      priority: "high",
      meta: {
        productName: product.name,
        reason: reason.trim(),
      },
      email: product.seller.email,
    });

    return {
      alreadyRejected: false,
      product,
    };
  },

  // This method allows admins to retrieve a list of all products based on various query parameters such as approval status, seller, category, activity status, deletion status, search term, pagination, and sorting options. It constructs a dynamic filter object based on the provided query parameters and executes a MongoDB query to fetch the matching products. The results are paginated and returned along with metadata about the total number of products and total pages. Each product includes populated information about the seller and category.
  async adminGetAllProducts(query) {
    const {
      status,
      seller,
      category,
      isActive,
      isDeleted,
      search,
      page = 1,
      limit = 20,
      sort = "newest",
    } = query;

    const filter = {};

    if (status) {
      filter.approvalStatus = status;
    }

    if (seller) {
      if (!mongoose.Types.ObjectId.isValid(seller)) {
        throw new ApiError(400, "Invalid seller ID");
      }
      filter.seller = seller;
    }

    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        throw new ApiError(400, "Invalid category ID");
      }
      filter.category = category;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (isDeleted !== undefined) {
      filter.isDeleted = isDeleted === "true";
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Number(limit));

    const sortOptions = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      rating: { ratings: -1 },
      bestSelling: { sold: -1 },
    };

    const sortQuery = sortOptions[sort] || { createdAt: -1 };

    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .populate("seller", "fullname email")
      .populate("category", "name")
      .select(
        "name slug approvalStatus isActive isArchived isDeleted ratings sold createdAt",
      )
      .lean();

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products,
    };
  },

  // This method allows admins to moderate the content of a product listing. It validates the product ID, checks if the product exists, and then applies updates to the product based on a whitelist of allowed fields. The method includes validation for category ID, price format, stock value, and discount percentage. After applying the updates, it saves the product and returns the updated product information. The method is designed to allow admins to make necessary adjustments to a product's content without going through the full approval process again, while still ensuring that the updates adhere to the required data formats and constraints.
  async moderateProductContent(productId, body) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    const allowedFields = [
      "name",
      "description",
      "price",
      "stock",
      "brand",
      "category",
      "discount",
      "featured",
    ];

    const updates = {};

    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    if (updates.category) {
      if (!mongoose.Types.ObjectId.isValid(updates.category)) {
        throw new ApiError(400, "Invalid category ID");
      }
    }

    if (updates.price) {
      updates.price = mongoose.Types.Decimal128.fromString(
        updates.price.toString(),
      );
    }

    if (updates.stock !== undefined) {
      const stockNum = Number(updates.stock);
      if (isNaN(stockNum) || stockNum < 0) {
        throw new ApiError(400, "Invalid stock value");
      }
      updates.stock = stockNum;
    }

    if (updates.discount !== undefined) {
      const discountNum = Number(updates.discount);
      if (isNaN(discountNum) || discountNum < 0 || discountNum > 90) {
        throw new ApiError(400, "Invalid discount value");
      }
      updates.discount = discountNum;
    }

    Object.assign(product, updates);

    await product.save();

    return product;
  },

  // This method allows admins to toggle the active status of a product listing. It validates the product ID, checks if the product exists, and then updates the active status based on the provided value. The method includes checks to ensure that only approved products can be activated and that archived products cannot be activated. After updating the status, it emits a notification to the seller to inform them about the status change. The updated product is returned at the end.
  async toggleProductStatus(productId, isActive) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "isActive must be true or false");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).populate("seller", "email fullname role");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    if (isActive) {
      if (product.approvalStatus !== "approved") {
        throw new ApiError(400, "Only approved products can be activated");
      }

      if (product.isArchived) {
        throw new ApiError(400, "Archived product cannot be activated");
      }
    }

    product.isActive = isActive;

    await product.save();

    await NotificationService.emit("PRODUCT_STATUS_TOGGLED", {
      recipient: product.seller._id,
      recipientRole: "seller",
      category: "product",
      entityType: "Product",
      entityId: product._id,
      priority: "medium",
      meta: {
        productName: product.name,
        status: isActive ? "active" : "inactive",
      },
      email: product.seller.email,
    });

    return product;
  },

  // This method allows admins to perform bulk moderation actions (approve or reject) on multiple product listings at once. It validates the input data, checks if the products exist, and then applies the specified action to each product while ensuring that archived products are skipped. The method also emits notifications to the respective sellers for each approved or rejected product. Finally, it returns a summary of the moderation results, including counts of updated and skipped products.
  async bulkModerateProducts(body) {
    const { ids, action, reason } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(400, "IDs array required");
    }

    if (!["approve", "reject"].includes(action)) {
      throw new ApiError(400, "Invalid action");
    }

    const validIds = ids.filter((id) => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      throw new ApiError(400, "No valid product IDs");
    }

    const products = await Product.find({
      _id: { $in: validIds },
      isDeleted: false,
    }).populate("seller", "email fullname role");

    const updated = [];
    const skipped = [];

    for (const product of products) {
      if (product.isArchived) {
        skipped.push(product._id);
        continue;
      }

      if (action === "approve") {
        if (product.approvalStatus === "approved") {
          skipped.push(product._id);
          continue;
        }

        product.approvalStatus = "approved";
        product.isActive = true;

        await NotificationService.emit("PRODUCT_APPROVED", {
          recipient: product.seller._id,
          recipientRole: "seller",
          category: "product",
          entityType: "Product",
          entityId: product._id,
          priority: "high",
          meta: { productName: product.name },
          email: product.seller.email,
        });
      } else {
        if (!reason || reason.trim().length < 5) {
          throw new ApiError(
            400,
            "Rejection reason required (min 5 characters)",
          );
        }

        if (product.approvalStatus === "rejected") {
          skipped.push(product._id);
          continue;
        }

        product.approvalStatus = "rejected";
        product.isActive = false;

        await NotificationService.emit("PRODUCT_REJECTED", {
          recipient: product.seller._id,
          recipientRole: "seller",
          category: "product",
          entityType: "Product",
          entityId: product._id,
          priority: "high",
          meta: {
            productName: product.name,
            reason: reason.trim(),
          },
          email: product.seller.email,
        });
      }

      await product.save();
      updated.push(product._id);
    }

    return {
      updatedCount: updated.length,
      skippedCount: skipped.length,
      updated,
      skipped,
    };
  },
};
