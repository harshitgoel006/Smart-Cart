import mongoose from "mongoose";

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

    productSnapshot:{
      name:String,
      image:String,
      slug:String
    },
    variantSnapshot:{
      label:String,
      value:String
    },

    unitPrice: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },

    lineTotal: {
      type: mongoose.Schema.Types.Decimal128,
      required: true
    },

    discountSnapshot:{
      type:mongoose.Schema.Types.Decimal128,
      default:0
    },

    fulfillmentStatus: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true
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
      shippedAt: Date,
      deliveredAt: Date,
      trackingEvents: [
        {
          event: String,
          scannedAt: { 
            type: Date, 
            default: Date.now 
          },
          location: String,
          remarks: String
        }
      ]
    }
  },
  { _id: true }
);

//////////////////////////////////////////////////////////
// ORDER
//////////////////////////////////////////////////////////

const orderSchema = new mongoose.Schema({

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
    enum: ["COD", "ONLINE"],
    default: "COD"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
    index: true
  },

  transactionId: String,

  subtotal: {
    type: mongoose.Schema.Types.Decimal128,
    required: true
  },

  discount: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  },

  tax: {
    type: mongoose.Schema.Types.Decimal128,
    default: 0
  },

  deliveryCharge: {
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
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
    index: true
  },

  statusHistory: [
    {
      status: String,
      updatedAt: { type: Date, default: Date.now },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: String,
      comment: String
    }
  ],

  isDeleted: {
    type: Boolean,
    default: false,
    index: true
  }

}, { timestamps: true });

//////////////////////////////////////////////////////////
// INDEXES
//////////////////////////////////////////////////////////

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ "items.seller": 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });

export const Order = mongoose.model("Order", orderSchema);