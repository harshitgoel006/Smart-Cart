import mongoose from "mongoose";



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

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    type: {
      type: String,
      enum: ["helpful", "not_helpful"],
      required: true
    }
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    reportedAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

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

    orderItemId: {
      type: String, 
      required: true
    },

    variantSnapshot: {
      label: String,
      value: String
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true
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
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true
    },

    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    moderatedAt: Date,

    rejectionReason: {
      type: String,
      maxlength: 500
    },

    votes: [voteSchema],

    reports: [reportSchema],

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

reviewSchema.index(
  { user: 1, order: 1, orderItemId: 1 },
  { unique: true }
);

reviewSchema.index({
  product: 1,
  status: 1,
  isDeleted: 1,
  rating: 1,
  createdAt: -1
});

export const Review = mongoose.model("Review", reviewSchema);