import mongoose from "mongoose";
import crypto from "crypto";

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

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    options: [optionSchema],
  },
  { _id: false },
);

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
      min: [0, "Price cannot be negative"],
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

productSchema.query.active = function () {
  return this.where({
    isDeleted: false,
    isActive: true,
  });
};

productSchema.query.approved = function () {
  return this.where({
    approvalStatus: "approved",
  });
};

productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
});

productSchema.index({
  category: 1,
  approvalStatus: 1,
  isDeleted: 1,
  isActive: 1,
});

productSchema.index({
  seller: 1,
  approvalStatus: 1,
  isDeleted: 1,
});

productSchema.index({ slug: 1 });

productSchema.index({
  "flashSale.isActive": 1,
  "flashSale.start": 1,
  "flashSale.end": 1,
});

productSchema.index({ finalPrice: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);
