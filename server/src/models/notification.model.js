import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    recipientRole: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
      index: true
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
        "cart"
      ],
      required: true,
      index: true
    },

    event: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true,
      maxlength: 100
    },

    message: {
      type: String,
      required: true,
      maxlength: 500
    },

    relatedEntity: {
      entityType: {
        type: String,
        enum: ["Order", "Product", "Escalation", "User", "Cart"],
        default: null
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "relatedEntity.entityType"
      }
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },

    readAt: Date,

    meta: mongoose.Schema.Types.Mixed,

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    },

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// AUTO FILTER SOFT DELETE
//////////////////////////////////////////////////////////

notificationSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

//////////////////////////////////////////////////////////
// PERFORMANCE INDEX
//////////////////////////////////////////////////////////

notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1
});

//////////////////////////////////////////////////////////
// TTL AUTO CLEANUP (30 DAYS)
//////////////////////////////////////////////////////////

notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = mongoose.model(
  "Notification",
  notificationSchema
);