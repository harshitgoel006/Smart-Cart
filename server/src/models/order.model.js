import mongoose from "mongoose";

// This schema defines the structure of the "Order" collection in MongoDB. It includes fields for user reference, an array of order items (with product and seller references, snapshots of product details, pricing, quantity, and fulfillment status), shipping address, payment details, order status, and a history of status changes. The schema also includes a soft delete flag and timestamps for tracking creation and update times. Indexes are created on user and creation date for efficient querying of a user's orders, as well as on seller within order items, order status, and payment status for optimized queries related to those fields.
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    productSnapshot: {
      name: String,
      image: String,
      slug: String,
    },
    variantSnapshot: {
      label: String,
      value: String,
    },

    unitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    lineTotal: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    discountSnapshot: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },

    fulfillmentStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    returnStatus: {
      type: String,
      enum: ["none", "requested", "approved", "rejected", "returned"],
      default: "none",
    },

    refundStatus: {
      type: String,
      enum: ["none", "pending", "processed"],
      default: "none",
    },

    shipment: {
      courierName: String,
      trackingNumber: String,
      shippedAt: Date,
      deliveredAt: Date,
      trackingEvents: [
        {
          event: String,
          scannedAt: {
            type: Date,
            default: Date.now,
          },
          location: String,
          remarks: String,
        },
      ],
    },
  },
  { _id: true },
);

// Main order schema that includes user reference, array of order items, shipping address, payment details, order status, and history of status changes. It also has a soft delete flag and timestamps for creation and updates.
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: String,
      mobile: String,
      addressLine: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true,
    },

    transactionId: String,

    subtotal: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    discount: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },

    tax: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },

    deliveryCharge: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },

    finalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },

    couponUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    statusHistory: [
      {
        status: String,
        updatedAt: { type: Date, default: Date.now },
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: String,
        comment: String,
      },
    ],

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Indexes for optimizing queries related to user orders, seller within order items, order status, and payment status.
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.seller": 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);
