import mongoose from "mongoose";

const escalationSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    escalationType: {
      type: String,
      enum: ["return", "refund", "delivery_issue", "payment_issue", "other"],
      required: true
    },

    status: {
      type: String,
      enum: ["open", "in_progress", "resolved", "rejected"],
      default: "open",
      index: true
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium"
    },

    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    remarks: String,

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

escalationSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

export const Escalation = mongoose.model("Escalation", escalationSchema);