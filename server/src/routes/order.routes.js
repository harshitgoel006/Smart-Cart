import { Router } from "express";
import {
  placeOrderController,
  getOrderHistoryController,
  getOrderDetailsController,
  trackOrderController,
  cancelOrderController,
  requestReturnController,
  requestRefundController,
  downloadInvoiceController,
  applyCouponController,

  getSellerOrdersController,
  getSellerOrderDetailsController,
  updateOrderStatusController,
  updateTrackingInfoController,
  addTrackingScanEventController,
  handleCustomerReturnRequestController,
  handleRefundRequestController,
  getSalesAnalyticsController,

  getAllOrdersController,
  getOrderAdminDetailsController,
  manualOrderStatusUpdateController,
  approveRefundController,
  approveReturnController,
  exportOrderReportController,
  getAuditLogsController,
  handleEscalationController,
} from "../controllers/order.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();




// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================


// Place a new order
router.route("/orders").post(
  verifyJWT,
  authorizedRole("customer"),
  placeOrderController
);

// Fetch order history
router.route("/orders").get(
  verifyJWT,
  authorizedRole("customer"),
  getOrderHistoryController
);

// Get order details
router.route("/orders/:orderId").get(
  verifyJWT,
  authorizedRole("customer"),
  getOrderDetailsController
);

// Track order shipment
router.route("/orders/:orderId/track").get(
  verifyJWT,
  authorizedRole("customer"),
  trackOrderController
);

// Cancel order
router.route("/orders/:orderId/cancel").post(
  verifyJWT,
  authorizedRole("customer"),
  cancelOrderController
);

// Request return
router.route("/orders/:orderId/return").post(
  verifyJWT,
  authorizedRole("customer"),
  requestReturnController
);

// Request refund
router.route("/orders/:orderId/refund").post(
  verifyJWT,
  authorizedRole("customer"),
  requestRefundController
);

// Download invoice
router.route("/orders/:orderId/invoice").get(
  verifyJWT,
  authorizedRole("customer"),
  downloadInvoiceController
);

// Apply coupon to order
router.route("/orders/apply-coupon").post(
  verifyJWT,
  authorizedRole("customer"),
  applyCouponController
);




// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================




// Get seller's orders
router.route("/seller/orders").get(
  verifyJWT,
  authorizedRole("seller"),
  getSellerOrdersController
);

// Get seller order details
router.route("/seller/orders/:orderId").get(
  verifyJWT,
  authorizedRole("seller"),
  getSellerOrderDetailsController
);

// Update order item status
router.route("/seller/orders/update-status").patch(
  verifyJWT,
  authorizedRole("seller"),
  updateOrderStatusController
);

// Update tracking info
router.route("/seller/orders/update-tracking").patch(
  verifyJWT,
  authorizedRole("seller"),
  updateTrackingInfoController
);

// Add tracking scan event
router.route("/seller/orders/tracking-event").post(
  verifyJWT,
  authorizedRole("seller"),
  addTrackingScanEventController
);

// Handle customer return request
router.route("/seller/orders/return-request").post(
  verifyJWT,
  authorizedRole("seller"),
  handleCustomerReturnRequestController
);

// Handle refund request
router.route("/seller/orders/refund-request").post(
  verifyJWT,
  authorizedRole("seller"),
  handleRefundRequestController
);

// Sales analytics
router.route("/seller/sales-analytics").get(
  verifyJWT,
  authorizedRole("seller"),
  getSalesAnalyticsController
);




// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================




// Get all orders with filters
router.route("/admin/orders").get(
  verifyJWT,
  authorizedRole("admin"),
  getAllOrdersController
);

// Get order details
router.route("/admin/orders/:orderId").get(
  verifyJWT,
  authorizedRole("admin"),
  getOrderAdminDetailsController
);

// Manual order/item status update
router.route("/admin/orders/manual-status-update").patch(
  verifyJWT,
  authorizedRole("admin"),
  manualOrderStatusUpdateController
);

// Approve or reject refunds
router.route("/admin/refunds/approve").post(
  verifyJWT,
  authorizedRole("admin"),
  approveRefundController
);

// Approve or reject returns
router.route("/admin/returns/approve").post(
  verifyJWT,
  authorizedRole("admin"),
  approveReturnController
);

// Export order reports
router.route("/admin/orders/export").get(
  verifyJWT,
  authorizedRole("admin"),
  exportOrderReportController
);

// Get audit logs
router.route("/admin/audit-logs").get(
  verifyJWT,
  authorizedRole("admin"),
  getAuditLogsController
);

// Handle escalations
router.route("/admin/escalations/handle").patch(
  verifyJWT,
  authorizedRole("admin"),
  handleEscalationController
);


export default router;
