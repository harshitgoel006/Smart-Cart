import mongoose from "mongoose";

//////////////////////////////////////////////////////////
// ASPECT SCHEMA
//////////////////////////////////////////////////////////

const aspectSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  { _id: false }
);

//////////////////////////////////////////////////////////
// REVIEW SCHEMA
//////////////////////////////////////////////////////////

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    orderItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    title: {
      type: String,
      maxlength: 150,
      trim: true
    },

    comment: {
      type: String,
      maxlength: 4000,
      trim: true
    },

    images: [
      {
        url: { type: String, required: true },
        altText: String
      }
    ],

    aspects: [aspectSchema],

    isVerifiedPurchase: {
      type: Boolean,
      default: true,
      index: true
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },

    rejectionReason: String,

    helpfulCount: {
      type: Number,
      default: 0
    },

    notHelpfulCount: {
      type: Number,
      default: 0
    },

    reportedCount: {
      type: Number,
      default: 0
    },

    sellerResponse: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      respondedAt: Date
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// UNIQUE REVIEW PER ORDER ITEM
//////////////////////////////////////////////////////////

reviewSchema.index(
  { user: 1, orderItem: 1 },
  { unique: true }
);

//////////////////////////////////////////////////////////
// PRODUCT LISTING PERFORMANCE INDEX
//////////////////////////////////////////////////////////

reviewSchema.index({
  product: 1,
  status: 1,
  isDeleted: 1,
  createdAt: -1
});

//////////////////////////////////////////////////////////
// SOFT DELETE FILTER
//////////////////////////////////////////////////////////

reviewSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

//////////////////////////////////////////////////////////
// STATIC: RECALCULATE PRODUCT RATING
//////////////////////////////////////////////////////////

reviewSchema.statics.calculateProductRating = async function (productId) {
  const mongooseId = new mongoose.Types.ObjectId(productId);

  const result = await this.aggregate([
    {
      $match: {
        product: mongooseId,
        status: "approved",
        isDeleted: false
      }
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length
    ? {
        avgRating: Number(result[0].avgRating.toFixed(2)),
        totalReviews: result[0].totalReviews
      }
    : { avgRating: 0, totalReviews: 0 };
};

export const Review = mongoose.model("Review", reviewSchema);