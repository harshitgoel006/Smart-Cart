import mongoose from "mongoose";
import crypto from "crypto";

// This schema defines the structure for product options, which are specific variations of a product (e.g., size, color) that have their own SKU, stock, price, and sales data. Each option is associated with a variant (e.g., "Size" or "Color") and includes fields for tracking inventory and pricing.
const optionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false },
);

// This schema defines the structure for product variants, which group together related options (e.g., all size options or all color options). Each variant has a label (e.g., "Size") and an array of options that belong to that variant.
const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    options: [optionSchema],
  },
  { _id: false },
);

// This schema defines the structure of the "Product" collection in MongoDB. It includes fields for product details such as name, description, price, stock, images, brand, category, ratings, reviews, seller reference, and various status flags. The schema also includes a pre-save middleware to generate a unique slug based on the product name and to calculate the final price after applying any discount. Additionally, query helpers are defined for filtering active and approved products. Indexes are created for efficient searching and querying based on various fields.
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },

    finalPrice: {
      type: mongoose.Schema.Types.Decimal128,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    coverImage: {
      public_id: { type: String },
      url: { type: String },
    },

    brand: { type: String, required: true, index: true },
    badges: [String],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },

    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },

    tags: [{ type: String, trim: true }],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: { type: Boolean, default: true },
    isArchived: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: null,
      trim: true,
    },

    variants: [variantSchema],

    featured: { type: Boolean, default: false },

    flashSale: {
      start: Date,
      end: Date,
      discountPercentage: { type: Number, min: 0, max: 90 },
      isActive: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

// This pre-save middleware ensures that whenever a product is saved, a unique slug is generated based on the product name. It also calculates the final price of the product by applying any discount to the original price. This allows for easy URL generation and accurate pricing information to be stored in the database.
productSchema.pre("save", async function (next) {
  if (this.isModified("name")) {
    const baseSlug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    const existing = await mongoose.model("Product").findOne({
      slug: baseSlug,
      _id: { $ne: this._id },
    });

    if (existing) {
      const uniqueSuffix = crypto.randomUUID().slice(0, 8);
      this.slug = `${baseSlug}-${uniqueSuffix}`;
    } else {
      this.slug = baseSlug;
    }
  }

  const price = parseFloat(this.price.toString());

  let activeDiscount = this.discountPercentage || 0;

  const now = new Date();

  if (
    this.flashSale?.isActive &&
    this.flashSale?.start <= now &&
    this.flashSale?.end >= now
  ) {
    activeDiscount = this.flashSale.discountPercentage;
  }

  const final = price - (price * activeDiscount) / 100;

  this.finalPrice = mongoose.Types.Decimal128.fromString(final.toFixed(2));

  next();
});

// These query helpers allow for filtering products based on their active status and approval status. The active() helper filters products that are not deleted and are marked as active, while the approved() helper filters products that have an approval status of "approved". These helpers can be used in queries to easily retrieve specific subsets of products.
productSchema.query.active = function () {
  return this.where({
    isDeleted: false,
    isActive: true,
  });
};

// This query helper filters products that have an approval status of "approved". It can be used in queries to easily retrieve products that have been approved for listing on the platform.
productSchema.query.approved = function () {
  return this.where({
    approvalStatus: "approved",
  });
};

// Indexes are created on various fields to optimize search and query performance. A text index is created on the name and description fields to allow for efficient text searching. Additional indexes are created on category, approval status, deletion status, active status, seller reference, flash sale status and timing, final price, ratings, and creation date to further enhance query performance for common filtering and sorting operations.
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

// Compound index to optimize queries filtering by category, approval status, deletion status, and active status
productSchema.index({
  category: 1,
  approvalStatus: 1,
  isDeleted: 1,
  isActive: 1,
});

// Index to optimize queries filtering by seller and approval status for active products
productSchema.index({
  seller: 1,
  approvalStatus: 1,
  isDeleted: 1,
});

// Index to optimize queries filtering by slug for product detail retrieval
productSchema.index({ slug: 1 });

// Compound index to optimize queries filtering by flash sale status and timing
productSchema.index({
  "flashSale.isActive": 1,
  "flashSale.start": 1,
  "flashSale.end": 1,
});

// Indexes to optimize queries filtering and sorting by final price, ratings, and creation date
productSchema.index({ finalPrice: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);
