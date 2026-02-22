import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
  {
    amount: {
      type: Number, // stored in paise
      required: true
    },
    status: {
      type: String,
      enum: ["initiated", "processed", "failed"],
      default: "initiated"
    },
    providerRefundId: String,
    reason: String,
    processedAt: Date
  },
  { _id: true }
);

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    provider: {
      type: String,
      enum: ["dummy", "razorpay", "stripe"],
      default: "dummy",
      index: true
    },

    amountInPaise: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: [
        "created",
        "pending",
        "authorized",
        "success",
        "failed",
        "partially_refunded",
        "refunded"
      ],
      default: "created",
      index: true
    },

    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true
    },

    providerPaymentId: {
      type: String,
      unique: true,
      sparse: true
    },

    providerOrderId: String,

    method: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "dummy"],
      default: "dummy"
    },

    failureReason: String,
    errorCode: String,

    refunds: [refundSchema],

    meta: mongoose.Schema.Types.Mixed,

    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// PERFORMANCE INDEXES
//////////////////////////////////////////////////////////

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });

//////////////////////////////////////////////////////////
// SOFT DELETE FILTER
//////////////////////////////////////////////////////////

paymentSchema.pre(/^find/, function (next) {
  this.where({ isDeleted: false });
  next();
});

export const Payment = mongoose.model("Payment", paymentSchema);