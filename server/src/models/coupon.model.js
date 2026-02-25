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

  description: {
    type: String,
    default: ""
  },

  discountType: {
    type: String,
    enum: ["percent", "flat"],   
    required: true
  },

  discountValue: {
    type: Number,
    required: true,
    min: 1                       
  },

  maxDiscount: {
    type: Number,
    default: null                 
  },

  minOrderValue: {
    type: Number,
    default: 0
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
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
      },
      count: {
        type: Number,
        default: 1
      }
    }
  ],

  startDate: {
    type: Date,
    default: Date.now,
    index: true
  },

  expiryDate: {
    type: Date,
    index: true
  },

  isActive: {                    
    type: Boolean,
    default: true,
    index: true
  }

},
{ timestamps: true }
);

couponSchema.index({ code: 1, isActive: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ "usedBy.user": 1 });

export const Coupon = mongoose.model("Coupon", couponSchema);