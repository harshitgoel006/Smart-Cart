import mongoose from "mongoose";

//////////////////////////////////////////////////////////
// TRACKING EVENT
//////////////////////////////////////////////////////////

const trackingEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    scannedAt: { type: Date, default: Date.now },
    scannedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: String,
    remarks: String
  },
  { _id: true }
);

//////////////////////////////////////////////////////////
// ORDER ITEM
//////////////////////////////////////////////////////////

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    quantity: { type: Number, required: true, min: 1 },

    price: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    total: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    fulfillmentStatus: {
      type: String,
      enum: ["processing", "packed", "shipped", "delivered", "cancelled"],
      default: "processing"
    },

    returnStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected", "returned"],
      default: "none"
    },

    refundStatus: {
      type: String,
      enum: ["none", "pending", "processed"],
      default: "none"
    },

    shipment: {
      courierName: String,
      trackingNumber: String,
      estimatedDelivery: Date,
      shippedAt: Date,
      deliveredAt: Date,
      trackingEvents: [trackingEventSchema]
    }
  },
  { _id: true }
);

//////////////////////////////////////////////////////////
// ORDER
//////////////////////////////////////////////////////////

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      mobile: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Blockchain"],
      default: "COD"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true
    },

    transactionId: String,
    smartContractTxHash: String,

    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    discount: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0
    },

    finalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    couponUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon"
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "partially_shipped",
        "shipped",
        "partially_delivered",
        "delivered",
        "cancelled",
        "returned",
        "refunded"
      ],
      default: "pending",
      index: true
    },

    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["admin", "seller", "user"] },
        comment: String
      }
    ],

    invoiceUrl: String,
    notes: String
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// INDEXES
//////////////////////////////////////////////////////////

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.seller": 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);