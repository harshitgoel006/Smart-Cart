import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // For now: "dummy", future: "razorpay", "stripe", etc.
    provider: {
      type: String,
      enum: ["dummy", "razorpay", "stripe"],
      default: "dummy",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "pending", "success", "failed", "refunded"],
      default: "created",
    },

    // For real gateways, we can save their IDs here
    providerPaymentId: {
      type: String,
    },
    providerOrderId: {
      type: String,
    },

    method: {
      type: String, // "card", "upi", "netbanking", "wallet", "dummy"
      default: "dummy",
    },

    // Extra data (like gateway raw response, error codes, etc.)
    meta: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
