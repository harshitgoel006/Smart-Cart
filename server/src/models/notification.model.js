import mongoose from "mongoose";

// This schema defines the structure of the "Notification" collection in MongoDB. It includes fields for recipient reference, recipient role, category, event, title, message, related entity reference, priority, read status, metadata, expiration time, and a soft delete flag. The schema also includes timestamps for tracking creation and update times. Additionally, a pre-find middleware is implemented to filter out documents marked as deleted.
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "order",
        "return",
        "refund",
        "payment",
        "review",
        "product",
        "escalation",
        "account",
        "system",
        "cart",
      ],
      required: true,
      index: true,
    },

    event: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      maxlength: 100,
    },

    message: {
      type: String,
      required: true,
      maxlength: 500,
    },

    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Order", "Product", "Escalation", "User", "Cart"],
        default: null,
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "relatedEntity.entityType",
      },
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: Date,

    meta: mongoose.Schema.Types.Mixed,

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// This pre-find middleware ensures that any query to the Notification collection will automatically exclude documents that have been marked as deleted (isDeleted: true). This allows for soft deletion of notifications without permanently removing them from the database.
notificationSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

// Compound index to optimize queries for fetching notifications for a user, filtering by read status, and sorting by creation time
notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

// TTL index to automatically delete notifications after their expiration time
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = mongoose.model("Notification", notificationSchema);
