import mongoose from "mongoose";

// Defining the schema for coupons in the e-commerce application. This schema includes fields for coupon code, description, discount type and value, usage limits, applicable products and categories, and validity dates. It also includes indexes for efficient querying based on code, active status, expiry date, and users who have used the coupon.
const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    discountType: {
      type: String,
      enum: ["percent", "flat"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 1,
    },

    maxDiscount: {
      type: Number,
      default: null,
    },

    minOrderValue: {
      type: Number,
      default: 0,
    },

    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],

    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    ],

    usageLimitPerUser: {
      type: Number,
      default: 1,
    },

    totalUsageLimit: {
      type: Number,
      default: 1000,
    },

    usageCount: {
      type: Number,
      default: 0,
      index: true,
    },

    usedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          index: true,
        },
        count: {
          type: Number,
          default: 1,
        },
      },
    ],

    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expiryDate: {
      type: Date,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Creating indexes for efficient querying based on code, active status, expiry date, and users who have used the coupon.
couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ "usedBy.user": 1 });

export const Coupon = mongoose.model("Coupon", couponSchema);
