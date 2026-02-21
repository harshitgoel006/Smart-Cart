import mongoose from "mongoose";

/* ================================
   VARIANT OPTION SCHEMA
================================ */
const optionSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
    },
  },
  { _id: false }
);

/* ================================
   VARIANT SCHEMA
================================ */
const variantSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    options: [optionSchema],
  },
  { _id: false }
);

/* ================================
   PRODUCT SCHEMA
================================ */
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
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 90,
    },

    finalPrice: {
      type: Number,
      min: 0,
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: [
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    ],

    brand: {
      type: String,
      required: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },

    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    variants: [variantSchema],

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    flashSale: {
      start: Date,
      end: Date,
      discount: {
        type: Number,
        min: 0,
        max: 90,
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

/* ================================
   SLUG + FINAL PRICE GENERATION
================================ */
productSchema.pre("save", function (next) {
  // Generate slug if name changed
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  // Calculate final price
  this.finalPrice =
    this.price - (this.price * this.discount) / 100;

  next();
});

/* ================================
   TEXT SEARCH INDEX
================================ */
productSchema.index({
  name: "text",
  description: "text",
});

/* ================================
   FILTERING INDEXES
================================ */
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ finalPrice: 1 });
productSchema.index({ ratings: -1 });
productSchema.index({ discount: -1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });

/* ================================
   EXPORT MODEL
================================ */
export const Product = mongoose.model(
  "Product",
  productSchema
);