import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
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

    type: {
      type: String,
      enum: [

        // Customer notifications

        "ORDER_OUT_FOR_DELIVERY",
        "ORDER_DELIVERED",
        "ORDER_CANCELLED",
        "RETURN_REQUESTED_CUSTOMER",
        "RETURN_APPROVED_CUSTOMER",
        "RETURN_REJECTED_CUSTOMER",
        "REFUND_REQUESTED_CUSTOMER",
        "REFUND_APPROVED_CUSTOMER",
        "REFUND_REJECTED_CUSTOMER",
        "REFUND_PROCESSED_CUSTOMER",
        "PAYMENT_SUCCESS",
        "PAYMENT_FAILED",
        "COUPON_APPLIED",
        "COUPON_FAILED",
        "SYSTEM_ANNOUNCEMENT_CUSTOMER",
        "PROMO_CUSTOMER",

        // Seller notifications  

        "NEW_ORDER_FOR_SELLER",
        "ORDER_ITEM_CANCELLED",
        "ORDER_ITEM_STATUS_OVERRIDDEN",
        "RETURN_REQUESTED_FOR_ITEM",
        "RETURN_APPROVED_FOR_ITEM",
        "RETURN_REJECTED_FOR_ITEM",
        "REFUND_REQUESTED_FOR_ITEM",
        "REFUND_APPROVED_FOR_ITEM",
        "REFUND_REJECTED_FOR_ITEM",
        "REFUND_PROCESSED_FOR_ITEM",
        "ESCALATION_CREATED_AGAINST_SELLER",
        "ESCALATION_UPDATED_FOR_SELLER",
        "PRODUCT_APPROVED",
        "PRODUCT_REJECTED",
        "PRODUCT_STATUS_TOGGLED",
        "SYSTEM_ANNOUNCEMENT_SELLER",

        // Admin notifications

        "ESCALATION_CREATED",
        "ESCALATION_UPDATED",
        "HIGH_VALUE_REFUND_REQUESTED",
        "BULK_REFUND_PROCESSED",
        "RETURN_REQUEST_ESCALATED_TO_ADMIN",
        "SYSTEM_ALERT",
        "PAYMENT_GATEWAY_ISSUE",
        "NEW_SELLER_REGISTRATION_PENDING",
        "KYC_VERIFICATION_REQUIRED",
        "BULK_EXPORT_COMPLETED",
        "SYSTEM_ANNOUNCEMENT_ADMIN",
        "NEW_USER_REGISTERED",
    "PASSWORD_CHANGED", 
    "PASSWORD_RESET",
    "PROFILE_UPDATED",
    "SELLER_PROFILE_UPDATED",
    "SELLER_APPROVED",
    "SELLER_SUSPENDED",
    "SELLER_UNSUSPENDED",
    "ACCOUNT_DEACTIVATED",
    "ACCOUNT_REACTIVATED",



    // ORDER (18)
  "ORDER_PLACED", "NEWORDERFORSELLER", "ORDERCONFIRMED", "ORDERPACKED", 
  "ORDERSHIPPED", "ORDERDELIVERED", "ORDERCANCELLED", "ORDERITEMCANCELLED",
  "RETURNREQUESTEDCUSTOMER", "RETURNREQUESTEDFORITEM", "REFUNDREQUESTEDCUSTOMER",
  "HIGHVALUEREFUNDREQUESTED", "RETURNAPPROVEDCUSTOMER", "RETURNREJECTEDCUSTOMER",
  "REFUNDAPPROVEDCUSTOMER", "REFUNDREJECTEDCUSTOMER", "SYSTEMANNOUNCEMENTCUSTOMER",
  
  // USER (10)  
  "NEW_USER_REGISTERED", "PASSWORD_CHANGED", "PASSWORD_RESET", "PROFILE_UPDATED",
  "SELLERPROFILEUPDATED", "SELLERAPPROVED", "SELLERSUSPENDED", "SELLERUNSUSPENDED",
  "ACCOUNTDEACTIVATED", "ACCOUNTREACTIVATED",
  
  // REVIEW (8)
  "REVIEWSUBMITTEDCUSTOMER", "REVIEWAPPROVEDCUSTOMER", "REVIEWREJECTEDCUSTOMER",
  "NEWREVIEWFORPRODUCT", "LOWRATINGREVIEWALERT", "REVIEWREPORTEDADMIN",
  
  // PRODUCT (6)
  "PRODUCTAPPROVED", "PRODUCTREJECTED", "PRODUCTSTATUSTOGGLED", "QNA_ANSWERED",
  "PRODUCTUPDATEDPENDING",
  
  // CART (3)
  "COUPON_APPLIED", "CART_ABANDONED", "CART_UPDATED",
  
  // OTHERS (2)
  "INVOICE_GENERATED", "PAYMENT_SUCCESS",
  
  // ESCALATION
  "ESCALATIONUPDATED"
      ],
      required: true,
      index: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    relatedEntity: {
      entityType: {
        type: String,
        enum: ["order", "product", "escalation", "user", "none","cart"],
        default: "none"
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "relatedEntity.entityType"
      }
    },

    channels: [{
      type: {
        type: String,
        enum: ["in-app", "email", "sms", "push"]
      },
      sent: {
        type: Boolean,
        default: false
      },
      sentAt: Date
    }],

    isRead: {
      type: Boolean,
      default: false,
      index: true
    },
    readAt: Date,

    meta: {
      type: mongoose.Schema.Types.Mixed 
    }
  },
  {
    timestamps: true
  }
);

// Compound index for faster queries
notificationSchema.index({ recipientId: 1, recipientRole: 1, isRead: 1, createdAt: -1 });

// TTL index for auto cleanup (30 days)
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Notification = mongoose.model("Notification", notificationSchema);
