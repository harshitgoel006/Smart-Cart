import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import {uploadMultiple,deleteMultipleFromCloudinary} from "../utils/cloudinary.js";
import { Order } from "../models/order.model.js"
import { ProductQnA } from "../models/productQnA.model.js";
import { Review } from "../models/review.model.js";
import NotificationService from "../services/notification/notification.service.js";
import mongoose from "mongoose";

export const productService = {

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
      limit = 12
    } = query;

    const filter = {
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved"
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
        filter.finalPrice.$gte =
          mongoose.Types.Decimal128.fromString(minPrice);
      }

      if (maxPrice) {
        filter.finalPrice.$lte =
          mongoose.Types.Decimal128.fromString(maxPrice);
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
      discountHighToLow: { discount: -1 }
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
        "name slug finalPrice price discount ratings images stock brand category"
      )
      .populate("category", "name slug");

    return {
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      products
    };
  },

  async getProductById(productId) {

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new ApiError(400, "Invalid product ID");
    }

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved"
    })
      .populate("seller", "fullname username avatar")
      .populate("category", "name slug");

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    return product;
  },

  async getTopRatedProduct(limit = 10) {

    const products = await Product.find({
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved"
    })
      .sort({ ratings: -1 })
      .limit(Number(limit))
      .select("name finalPrice discount ratings images stock");

    return products;
  },

  async getNewArrivalProduct(limit = 10) {

    return await Product.find({
      isDeleted: false,
      isActive: true,
      approvalStatus: "approved"
    })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select("name finalPrice discount ratings images stock");
      
  },

  async getProductsByCategory(categoryId, query) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const { page = 1, limit = 10, sort } = query;

  const filter = {
    category: categoryId,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved"
  };

  const sortOptions = {
    priceLowToHigh: { finalPrice: 1 },
    priceHighToLow: { finalPrice: -1 },
    ratingHighToLow: { ratings: -1 },
    bestSelling: { sold: -1 }
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
    products
  };
  },

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
    limit = 10
  } = queryParams;

  const filter = {
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved"
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
      filter.finalPrice.$gte =
        mongoose.Types.Decimal128.fromString(minPrice);
    }

    if (maxPrice) {
      filter.finalPrice.$lte =
        mongoose.Types.Decimal128.fromString(maxPrice);
    }
  }

  const sortOptions = {
    priceLowToHigh: { finalPrice: 1 },
    priceHighToLow: { finalPrice: -1 },
    ratingHighToLow: { ratings: -1 },
    bestSelling: { sold: -1 },
    newest: { createdAt: -1 }
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
    products
  };
  },

  async getRelatedProducts(productId, query) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const { page = 1, limit = 10 } = query;

  const mainProduct = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved"
  });

  if (!mainProduct) {
    throw new ApiError(404, "Product not found");
  }

  const filter = {
    _id: { $ne: productId },
    category: mainProduct.category,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved"
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
    products
  };
  },

  async getProductReviews(productId, query) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const { rating, page = 1, limit = 10 } = query;

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved"
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const filter = {
    product: productId,
    status: "approved" // IMPORTANT
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
    reviews
  };
  },

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
    approvalStatus: "approved"
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const hasPurchased = await Order.exists({
    user: userId,
    "items.product": productId,
    status: "delivered"
  });

  if (!hasPurchased) {
    throw new ApiError(403, "Only verified buyers can review this product");
  }

  let review = await Review.findOne({
    product: productId,
    user: userId
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
      status: "pending"
    });
    message = "Review submitted successfully";
  }

  const stats = await Review.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: "approved"
      }
    },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        total: { $sum: 1 }
      }
    }
  ]);

  const avg = stats[0]?.averageRating || 0;
  const count = stats[0]?.total || 0;

  await Product.findByIdAndUpdate(productId, {
    ratings: avg,
    reviews: count
  });

  return { review, message };
  },

  async getProductQnA(productId, query) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const { page = 1, limit = 10 } = query;

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false,
    isActive: true,
    approvalStatus: "approved"
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const filter = {
    product: productId,
    status: { $in: ["pending", "answered"] }
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
    qna
  };
  },

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
    approvalStatus: "approved"
  }).populate("seller", "email");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const newQnA = await ProductQnA.create({
    product: productId,
    seller: product.seller._id,
    user: userId,
    question: question.trim(),
    status: "pending"
  });

  // Notify seller
  await NotificationService.emit("NEW_PRODUCT_QUESTION", {
  recipientId: product.seller._id,
  recipientRole: "seller",
  relatedEntity: {
    entityType: "product",
    entityId: product._id
  },
  meta: {
    questionId: newQnA._id
  }
});
  

  return newQnA;
  },

  async respondToProductQnA(productId, questionId, sellerId, body) {

  const { answer } = body;

  if (!answer || answer.trim().length < 3) {
    throw new ApiError(400, "Answer must be at least 3 characters");
  }

  const qna = await ProductQnA.findOne({
    _id: questionId,
    product: productId,
    seller: sellerId,
    isDeleted: false
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
      entityId: productId
    },
    meta: {
      questionId: qna._id
    }
  });
  

  return qna;
  },

  async createProduct(sellerId, body, files) {

  const {
    name,
    description,
    price,
    stock,
    brand,
    category,
    variants
  } = body;

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
    status: "approved"
  });

  if (!categoryDoc) {
    throw new ApiError(400, "Invalid or inactive category");
  }

  if (!files || files.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  // Upload Images with rollback safety

  const uploadedImages = await uploadMultiple(files, {
  folder: "SmartCart/products"
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
      isActive: false // IMPORTANT FIX
    });

    // Fetch all active admins
const admins = await User.find({
  role: "admin",
  isActive: true,
  isDeleted: false
});

for (const admin of admins) {
  await NotificationService.emit("PRODUCT_CREATED_PENDING", {
    recipient: admin._id,   // ✅ REQUIRED
    recipientRole: "admin",
    entityType: "Product",
    entityId: product._id,
    category: "product",
    priority: "medium",
    meta: {
      productName: product.name,
      sellerId
    }
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

  async getSellerProducts(sellerId, query) {

  const {
    status,
    category,
    page = 1,
    limit = 10,
    sort = "newest"
  } = query;

  const filter = {
    seller: sellerId,
    isDeleted: false
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
    bestSelling: { sold: -1 }
  };

  const sortQuery = sortOptions[sort] || { createdAt: -1 };

  const total = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort(sortQuery)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select("name slug finalPrice stock approvalStatus isActive isArchived createdAt")
    .lean();

  return {
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    products
  };
  },

  async updateProduct(productId, sellerId, body, files) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
    isDeleted: false
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
    "variants"
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
      status: "approved"
    });

    if (!categoryDoc) {
      throw new ApiError(400, "Invalid or inactive category");
    }
  }

  /////////////////////////////////////////////////////////
  // DECIMAL SAFE PRICE
  /////////////////////////////////////////////////////////

  if (updates.price) {
    updates.price =
      mongoose.Types.Decimal128.fromString(updates.price.toString());
  }

  /////////////////////////////////////////////////////////
  // IMAGE HANDLING (SAFE + ROLLBACK READY)
  /////////////////////////////////////////////////////////

  if (files && files.length > 0) {

    // 1️⃣ Upload new images first (atomic via cloudinary util)
    const newImages = await uploadMultiple(files, {
      folder: "SmartCart/products"
    });

    // 2️⃣ Delete old images AFTER successful upload
    const oldPublicIds = product.images.map(img => img.public_id);

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
    isDeleted: false
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
        sellerId
      }
    });
  }

  return product;
  },

  async deleteProduct(productId, sellerId) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  /////////////////////////////////////////////////////////
  // CHECK ORDER DEPENDENCY
  /////////////////////////////////////////////////////////

  const hasOrders = await Order.exists({
    "items.product": productId
  });

  if (hasOrders) {

    product.isActive = false;
    product.isArchived = true;

    await product.save();

    return {
      message: "Product archived because it has existing orders"
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

  const publicIds = product.images.map(img => img.public_id);

  await deleteMultipleFromCloudinary(publicIds);

  return {
    message: "Product deleted successfully"
  };
  },

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
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // VARIANT SAFETY

  if (product.variants && product.variants.length > 0) {
    throw new ApiError(
      400,
      "Cannot update base stock when variants exist. Update variant stock instead."
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
    isDeleted: false
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
        `Variant "${variant.label}" must have at least one option`
      );
    }

    const seenValues = new Set();

    for (const option of variant.options) {

      if (!option.value) {
        throw new ApiError(
          400,
          `Option value missing in variant "${variant.label}"`
        );
      }

      if (seenValues.has(option.value)) {
        throw new ApiError(
          400,
          `Duplicate option "${option.value}" in variant "${variant.label}"`
        );
      }

      seenValues.add(option.value);

      const stock = Number(option.stock);

      if (isNaN(stock) || stock < 0) {
        throw new ApiError(
          400,
          `Invalid stock for option "${option.value}"`
        );
      }

      option.stock = stock;

      // Optional: price override validation
      if (option.price) {
        option.price =
          mongoose.Types.Decimal128.fromString(option.price.toString());
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
    isDeleted: false
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
        sellerId
      }
    });
  }

  return product;
  },

  async getProductOrders(productId, sellerId, query) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const { page = 1, limit = 10, status } = query;

  // VERIFY PRODUCT OWNERSHIP

  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // BUILD FILTER

  const filter = {
    "items.product": productId,
    "items.seller": sellerId
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
    orders
   };
  },

  async archiveProduct(productId, sellerId) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.isArchived) {
    return {
      alreadyArchived: true,
      product
    };
  }

  product.isActive = false;
  product.isArchived = true;

  await product.save();

  return {
    alreadyArchived: false,
    product
  };
  },

  async restoreArchiveProduct(productId, sellerId) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (!product.isArchived) {
    return {
      notArchived: true,
      product
    };
  }

  product.isArchived = false;

  if (product.approvalStatus === "approved") {
    product.isActive = true;
  }

  await product.save();

  return {
    notArchived: false,
    product
  };
  },

  async getProductFeedback(productId, sellerId, query) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const { page = 1, limit = 10 } = query;

  const product = await Product.findOne({
    _id: productId,
    seller: sellerId,
    isDeleted: false
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(50, Number(limit));

  // Only APPROVED reviews matter

  const filter = {
    product: productId,
    status: "approved"
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
    { $match: { product: new mongoose.Types.ObjectId(productId), status: "approved" } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" }
      }
    }
  ]);

  return {
    averageRating: stats[0]?.averageRating || 0,
    totalReviews: total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    reviews
  };
  },

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
    isDeleted: false
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
        "Only approved and active products can be featured"
      );
    }

    const featuredCount = await Product.countDocuments({
      seller: sellerId,
      featured: true,
      isActive: true,
      isDeleted: false
    });

    if (featuredCount >= 5) {
      throw new ApiError(
        400,
        "Feature limit reached (max 5 active featured products)"
      );
    }
  }

  product.featured = featured;

  await product.save();

  return product;
  },

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
    isDeleted: false
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
      "Only approved and active products can have flash sales"
    );
  }

  if (
    product.flashSale?.isActive &&
    product.flashSale.end > now
  ) {
    throw new ApiError(
      400,
      "An active flash sale already exists for this product"
    );
  }

  product.flashSale = {
    start: startDate,
    end: endDate,
    discount: discountNum,
    isActive: true
  };

  await product.save();

  return product;
  },

  async approveProduct(productId) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  }).populate("seller", "email fullname role");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.isArchived) {
    throw new ApiError(
      400,
      "Archived product cannot be approved"
    );
  }

  if (product.approvalStatus === "approved") {
    return {
      alreadyApproved: true,
      product
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
      productName: product.name
    },
    email: product.seller.email
  });

  return {
    alreadyApproved: false,
    product
  };
  },
  
  async rejectProduct(productId, reason) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (!reason || reason.trim().length < 5) {
    throw new ApiError(
      400,
      "Rejection reason must be at least 5 characters"
    );
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  }).populate("seller", "email fullname role");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.isArchived) {
    throw new ApiError(
      400,
      "Archived product cannot be rejected"
    );
  }

  if (product.approvalStatus === "rejected") {
    return {
      alreadyRejected: true,
      product
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
      reason: reason.trim()
    },
    email: product.seller.email
  });

  return {
    alreadyRejected: false,
    product
  };
  },

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
    sort = "newest"
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
    bestSelling: { sold: -1 }
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
      "name slug approvalStatus isActive isArchived isDeleted ratings sold createdAt"
    )
    .lean();

  return {
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum),
    products
  };
  },

  async moderateProductContent(productId, body) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
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
    "featured"
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
    updates.price =
      mongoose.Types.Decimal128.fromString(
        updates.price.toString()
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

  async toggleProductStatus(productId, isActive) {

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be true or false");
  }

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  }).populate("seller", "email fullname role");

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (isActive) {

    if (product.approvalStatus !== "approved") {
      throw new ApiError(
        400,
        "Only approved products can be activated"
      );
    }

    if (product.isArchived) {
      throw new ApiError(
        400,
        "Archived product cannot be activated"
      );
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
      status: isActive ? "active" : "inactive"
    },
    email: product.seller.email
  });

  return product;
  },

  async bulkModerateProducts(body) {

  const { ids, action, reason } = body;

  if (!Array.isArray(ids) || ids.length === 0) {
    throw new ApiError(400, "IDs array required");
  }

  if (!["approve", "reject"].includes(action)) {
    throw new ApiError(400, "Invalid action");
  }

  const validIds = ids.filter(id =>
    mongoose.Types.ObjectId.isValid(id)
  );

  if (validIds.length === 0) {
    throw new ApiError(400, "No valid product IDs");
  }

  const products = await Product.find({
    _id: { $in: validIds },
    isDeleted: false
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
        email: product.seller.email
      });

    } else {

      if (!reason || reason.trim().length < 5) {
        throw new ApiError(
          400,
          "Rejection reason required (min 5 characters)"
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
          reason: reason.trim()
        },
        email: product.seller.email
      });
    }

    await product.save();
    updated.push(product._id);
  }

  return {
    updatedCount: updated.length,
    skippedCount: skipped.length,
    updated,
    skipped
  };
  },


}