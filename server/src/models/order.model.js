import mongoose from "mongoose";

const trackingEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
  },
  scannedAt:{
    type: Date,
    required: true,
    default: Date.now
  },
  scannedBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  location:{
    type: String,
    required: true,
  },
  remarks:{
    type: String,
  },

},
{  _id: false
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        seller:{
          type:  mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        fulfillmentStatus: {
          type: String,
          enum: ["Processing", "Packed", "Shipped","Delivered", "Cancelled"],
          default: "Processing",
        },
        shipment: {                                
          courierName: { type: String },
          shipmentStatus: { type: String, default: "Pending" },
          estimatedDelivery: { type: Date },
          shippedAt: { type: Date },
        },
      },
    ],
    shippingAddress: {
      fullName: { 
        type: String, 
        required: true 
      },
      mobile: { 
        type: String, 
        required: true 
      },
      addressLine: { 
        type: String, 
        required: true 
      },
      city: { 
        type: String, 
        required: true 
      },
      state: { 
        type: String, 
        required: true 
      },
      pincode: { 
        type: String, 
        required: true 
      },
      country: { 
        type: String, 
        required: true 
      },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Blockchain"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
    },
    transactionId: {
      type: String,
      default: null,
    },
    smartContractTxHash: { 
      type: String, 
      default: null 
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discount:{
      type: Number,
      default: 0
    },
    finalAmount: {
       type: Number, 
       required: true 
    },
    couponUsed: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon" 
    },
    isPaid: { 
      type: Boolean, 
      default: false 
    },
    paidAt: { 
      type: Date 
    },
    orderStatus: {
      type: String,
      enum: [
        "Pending", "Confirmed", "Processing", "Packed", "Shipped",
        "OutForDelivery", "Delivered", "Cancelled", "Returned", "Refunded"
      ],
      default: "Pending",
      index: true
    },
    shipmentDetails: {
      trackingNumber: String,
      courierName: String,
      shipmentStatus: String,
      estimatedDeliveryDate: Date,
    },
    deliveredAt: { 
      type: Date ,
      default:null
    },
    returnStatus: {
      type: String,
      enum: ["None", "Requested", "Returned", "ReplacementInProgress"],
      default: "None",
    },
    refundRequestStatus:{
      type: String,
      enum: ["None", "Requested", "Approved", "Rejected"],
      default: "None",
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        updatedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
        role: { type: String, enum: ["admin", "seller", "user"], default: "user" }, 
        comment: { type: String }  
      }
    ],

    trackingEvents: [ trackingEventSchema ],
    qrCode: { 
      type: String, 
      unique: true 
    }, 
    qrCodeImage: { 
      type: String 
    },
    invoiceUrl: { 
      type: String 
    }, 
    notes: { 
      type: String 
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model("Order", orderSchema);


