import mongoose from "mongoose";

// This schema defines the structure for product reviews. It includes references to the product, user, and order, as well as fields for rating, title, comment, images, aspects, and verification status. The schema also supports moderation features such as status, moderatedBy, moderatedAt, and rejectionReason. Additionally, it includes subdocuments for votes and reports on the review. Indexes are created to optimize queries based on user, order, product, status, and rating.
const aspectSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  { _id: false },
);

// This schema defines the structure for votes on reviews, allowing users to mark a review as helpful or not helpful. Each vote includes a reference to the user and the type of vote. The schema is defined as a subdocument without its own _id field.
const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["helpful", "not_helpful"],
      required: true,
    },
  },
  { _id: false },
);

// This schema defines the structure for reports on reviews, allowing users to report a review for various reasons. Each report includes a reference to the user who made the report, the reason for reporting, and the date of the report. Like the voteSchema, it is defined as a subdocument without its own _id field.
const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

// This is the main schema for reviews, which incorporates the aspectSchema, voteSchema, and reportSchema as subdocuments. It captures all relevant information about a review, including references to the product, user, and order, as well as the content of the review and its moderation status. The schema also includes indexes to optimize queries based on user, order, product, status, and rating.
const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    orderItemId: {
      type: String,
      required: true,
    },

    variantSnapshot: {
      label: String,
      value: String,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },

    title: {
      type: String,
      maxlength: 150,
      trim: true,
    },

    comment: {
      type: String,
      maxlength: 4000,
      trim: true,
    },

    images: [
      {
        url: { type: String, required: true },
        altText: String,
      },
    ],

    aspects: [aspectSchema],

    isVerifiedPurchase: {
      type: Boolean,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    moderatedAt: Date,

    rejectionReason: {
      type: String,
      maxlength: 500,
    },

    votes: [voteSchema],

    reports: [reportSchema],

    sellerResponse: {
      message: String,
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      respondedAt: Date,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Creating a compound index to ensure that a user can only leave one review per order item, and to optimize queries based on user, order, product, status, and rating.
reviewSchema.index({ user: 1, order: 1, orderItemId: 1 }, { unique: true });

// Additional indexes to optimize queries based on product, status, rating, and creation date for sorting and filtering reviews efficiently.
reviewSchema.index({
  product: 1,
  status: 1,
  isDeleted: 1,
  rating: 1,
  createdAt: -1,
});

export const Review = mongoose.model("Review", reviewSchema);
