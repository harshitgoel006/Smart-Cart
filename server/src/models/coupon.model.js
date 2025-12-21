import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],  // Controller uses discountPercent/discountAmount
      required: true,
    },
    discountValue: {  // ✅ Used for both percentage & fixed
      type: Number,
      required: true,
      min: 0,
    },
    discountPercent: {  // ✅ MISSING - Controller expects this!
      type: Number,
      min: 0,
      max: 100,
    },
    discountAmount: {  // ✅ MISSING - Controller expects this!
      type: Number,
      min: 0,
    },
    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    usageLimitPerUser: {
      type: Number,
      default: 1,
      min: 1,
    },
    totalUsageLimit: {
      type: Number,
      default: 1000,
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export { Coupon };
