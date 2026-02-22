import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },

    description: String,

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0
    },

    applicableProducts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    ],

    applicableCategories: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
    ],

    usageLimitPerUser: {
      type: Number,
      default: 1
    },

    totalUsageLimit: {
      type: Number,
      default: 1000
    },

    usageCount: {
      type: Number,
      default: 0,
      index: true
    },

    usedBy: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        count: { type: Number, default: 1 }
      }
    ],

    startDate: {
      type: Date,
      default: Date.now
    },

    expiryDate: Date,

    active: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// PERFORMANCE INDEX
//////////////////////////////////////////////////////////

couponSchema.index({ code: 1, active: 1 });
couponSchema.index({ expiryDate: 1 });

export const Coupon = mongoose.model("Coupon", couponSchema);