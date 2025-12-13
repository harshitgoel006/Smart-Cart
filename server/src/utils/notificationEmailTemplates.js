// utils/notificationEmailTemplates.js

export const emailTemplates = {
  // ======================
  // CUSTOMER NOTIFICATIONS
  // ======================

  ORDER_PLACED: {
    subject: "Your order has been placed",
    html: (d) => `
      <h2>Order placed successfully</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Total amount: ₹${d.amount}</p>
    `,
  },

  ORDER_CONFIRMED: {
    subject: "Your order is confirmed",
    html: (d) => `
      <h2>Order confirmed</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
    `,
  },

  ORDER_PACKED: {
    subject: "Your order is packed",
    html: (d) => `
      <h2>Order packed</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
    `,
  },

  ORDER_SHIPPED: {
    subject: "Your order has been shipped",
    html: (d) => `
      <h2>Order shipped</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Courier: ${d.courier || "-"} | Tracking: ${d.trackingNumber || "-"}</p>
    `,
  },

  ORDER_OUT_FOR_DELIVERY: {
    subject: "Your order is out for delivery",
    html: (d) => `
      <h2>Out for delivery</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
    `,
  },

  ORDER_DELIVERED: {
    subject: "Your order has been delivered",
    html: (d) => `
      <h2>Order delivered</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>We hope you enjoy your purchase.</p>
    `,
  },

  ORDER_CANCELLED: {
    subject: "Your order has been cancelled",
    html: (d) => `
      <h2>Order cancelled</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "Not specified"}</p>
    `,
  },

  RETURN_REQUESTED_CUSTOMER: {
    subject: "Return request submitted",
    html: (d) => `
      <h2>Return request received</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "-"}</p>
    `,
  },

  RETURN_APPROVED_CUSTOMER: {
    subject: "Return request approved",
    html: (d) => `
      <h2>Return approved</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
    `,
  },

  RETURN_REJECTED_CUSTOMER: {
    subject: "Return request rejected",
    html: (d) => `
      <h2>Return rejected</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "Not specified"}</p>
    `,
  },

  REFUND_REQUESTED_CUSTOMER: {
    subject: "Refund request submitted",
    html: (d) => `
      <h2>Refund request received</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "-"}</p>
    `,
  },

  REFUND_APPROVED_CUSTOMER: {
    subject: "Refund approved",
    html: (d) => `
      <h2>Refund approved</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Amount: ₹${d.amount}</p>
    `,
  },

  REFUND_REJECTED_CUSTOMER: {
    subject: "Refund request rejected",
    html: (d) => `
      <h2>Refund rejected</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "Not specified"}</p>
    `,
  },

  REFUND_PROCESSED_CUSTOMER: {
    subject: "Refund processed",
    html: (d) => `
      <h2>Refund processed</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Amount: ₹${d.amount}</p>
      <p>Refund mode: ${d.mode || "-"}</p>
    `,
  },

  PAYMENT_SUCCESS: {
    subject: "Payment successful",
    html: (d) => `
      <h2>Payment successful</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Amount: ₹${d.amount}</p>
    `,
  },

  PAYMENT_FAILED: {
    subject: "Payment failed",
    html: (d) => `
      <h2>Payment failed</h2>
      <p>Order ID: <strong>${d.orderId || "-"}</strong></p>
      <p>Reason: ${d.reason || "Payment could not be completed."}</p>
    `,
  },

  COUPON_APPLIED: {
    subject: "Coupon applied successfully",
    html: (d) => `
      <h2>Coupon applied</h2>
      <p>Code: <strong>${d.couponCode}</strong></p>
      <p>Discount: ₹${d.discount}</p>
    `,
  },

  COUPON_FAILED: {
    subject: "Coupon could not be applied",
    html: (d) => `
      <h2>Coupon failed</h2>
      <p>Code: <strong>${d.couponCode}</strong></p>
      <p>Reason: ${d.reason || "Invalid or expired coupon."}</p>
    `,
  },

  SYSTEM_ANNOUNCEMENT_CUSTOMER: {
    subject: "Important update from SmartCart",
    html: (d) => `
      <h2>${d.title || "Important update"}</h2>
      <p>${d.message || ""}</p>
    `,
  },

  PROMO_CUSTOMER: {
    subject: (d) => d.subject || "New offer just for you",
    html: (d) => `
      <h2>${d.title || "Exclusive offer"}</h2>
      <p>${d.message || ""}</p>
    `,
  },

  // ======================
  // SELLER NOTIFICATIONS
  // ======================

  NEW_ORDER_FOR_SELLER: {
    subject: "New order received",
    html: (d) => `
      <h2>New order for your product</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Product: ${d.productName || "-"}</p>
    `,
  },

  ORDER_ITEM_CANCELLED: {
    subject: "Order item cancelled",
    html: (d) => `
      <h2>Item cancelled</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Product: ${d.productName || "-"}</p>
    `,
  },

  ORDER_ITEM_STATUS_OVERRIDDEN: {
    subject: "Order item status updated by admin",
    html: (d) => `
      <h2>Status overridden by admin</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>New status: ${d.status}</p>
    `,
  },

  RETURN_REQUESTED_FOR_ITEM: {
    subject: "Return requested for your item",
    html: (d) => `
      <h2>Return requested</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Product: ${d.productName || "-"}</p>
    `,
  },

  RETURN_APPROVED_FOR_ITEM: {
    subject: "Return approved for your item",
    html: (d) => `
      <h2>Return approved</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Product: ${d.productName || "-"}</p>
    `,
  },

  RETURN_REJECTED_FOR_ITEM: {
    subject: "Return rejected for your item",
    html: (d) => `
      <h2>Return rejected</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "-"}</p>
    `,
  },

  REFUND_REQUESTED_FOR_ITEM: {
    subject: "Refund requested for your item",
    html: (d) => `
      <h2>Refund requested</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Amount: ₹${d.amount}</p>
    `,
  },

  REFUND_APPROVED_FOR_ITEM: {
    subject: "Refund approved for your item",
    html: (d) => `
      <h2>Refund approved</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Amount: ₹${d.amount}</p>
    `,
  },

  REFUND_REJECTED_FOR_ITEM: {
    subject: "Refund rejected for your item",
    html: (d) => `
      <h2>Refund rejected</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "-"}</p>
    `,
  },

  REFUND_PROCESSED_FOR_ITEM: {
    subject: "Refund processed for your item",
    html: (d) => `
      <h2>Refund processed</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Amount: ₹${d.amount}</p>
    `,
  },

  ESCALATION_CREATED_AGAINST_SELLER: {
    subject: "New escalation raised",
    html: (d) => `
      <h2>Escalation created</h2>
      <p>Order ID: <strong>${d.orderId}</strong></p>
      <p>Reason: ${d.reason || "-"}</p>
    `,
  },

  ESCALATION_UPDATED_FOR_SELLER: {
    subject: "Escalation updated",
    html: (d) => `
      <h2>Escalation status updated</h2>
      <p>Status: ${d.status}</p>
    `,
  },

  PRODUCT_APPROVED: {
    subject: "Product approved",
    html: (d) => `
      <h2>Your product has been approved</h2>
      <p>Product: ${d.productName || "-"}</p>
    `,
  },

  PRODUCT_REJECTED: {
    subject: "Product rejected",
    html: (d) => `
      <h2>Your product has been rejected</h2>
      <p>Product: ${d.productName || "-"}</p>
      <p>Reason: ${d.reason || "-"}</p>
    `,
  },

  PRODUCT_STATUS_TOGGLED: {
    subject: "Product status updated",
    html: (d) => `
      <h2>Product status updated</h2>
      <p>Product: ${d.productName || "-"}</p>
      <p>New status: ${d.status}</p>
    `,
  },

  SYSTEM_ANNOUNCEMENT_SELLER: {
    subject: "Important update for sellers",
    html: (d) => `
      <h2>${d.title || "Important update"}</h2>
      <p>${d.message || ""}</p>
    `,
  },

  // ======================
  // ADMIN NOTIFICATIONS
  // ======================

  ESCALATION_CREATED: {
    subject: "New escalation created",
    html: (d) => `
      <h2>New escalation</h2>
      <p>Escalation ID: ${d.escalationId}</p>
      <p>Order ID: ${d.orderId || "-"}</p>
    `,
  },

  ESCALATION_UPDATED: {
    subject: "Escalation updated",
    html: (d) => `
      <h2>Escalation updated</h2>
      <p>Escalation ID: ${d.escalationId}</p>
      <p>Status: ${d.status}</p>
    `,
  },

  HIGH_VALUE_REFUND_REQUESTED: {
    subject: "High value refund requested",
    html: (d) => `
      <h2>High value refund</h2>
      <p>Order ID: ${d.orderId}</p>
      <p>Amount: ₹${d.amount}</p>
    `,
  },

  BULK_REFUND_PROCESSED: {
    subject: "Bulk refund job completed",
    html: (d) => `
      <h2>Bulk refund processed</h2>
      <p>Count: ${d.count}</p>
    `,
  },

  RETURN_REQUEST_ESCALATED_TO_ADMIN: {
    subject: "Return request escalated",
    html: (d) => `
      <h2>Return escalated</h2>
      <p>Order ID: ${d.orderId}</p>
    `,
  },

  SYSTEM_ALERT: {
    subject: "System alert",
    html: (d) => `
      <h2>System alert</h2>
      <p>${d.message || ""}</p>
    `,
  },

  PAYMENT_GATEWAY_ISSUE: {
    subject: "Payment gateway issue detected",
    html: (d) => `
      <h2>Payment gateway issue</h2>
      <p>${d.message || ""}</p>
    `,
  },

  NEW_SELLER_REGISTRATION_PENDING: {
    subject: "New seller registration pending",
    html: (d) => `
      <h2>New seller pending approval</h2>
      <p>Seller: ${d.sellerName || "-"}</p>
    `,
  },

  KYC_VERIFICATION_REQUIRED: {
    subject: "KYC verification required",
    html: (d) => `
      <h2>KYC verification required</h2>
      <p>Seller: ${d.sellerName || "-"}</p>
    `,
  },

  BULK_EXPORT_COMPLETED: {
    subject: "Export job completed",
    html: (d) => `
      <h2>Export complete</h2>
      <p>Type: ${d.exportType || "-"}</p>
      <p>Download link: ${d.downloadUrl || "-"}</p>
    `,
  },

  SYSTEM_ANNOUNCEMENT_ADMIN: {
    subject: "Admin announcement",
    html: (d) => `
      <h2>${d.title || "Admin announcement"}</h2>
      <p>${d.message || ""}</p>
    `,
  },

  // Fallback
  DEFAULT: {
    subject: (d) => d.subject || "SmartCart Notification",
    html: (d) => `
      <h2>${d.title || "Notification"}</h2>
      <p>${d.message || ""}</p>
    `,
  },
};
