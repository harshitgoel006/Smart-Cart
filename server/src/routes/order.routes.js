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

router
  .route("/orders")
  .post(verifyJWT, authorizedRole("customer"), placeOrderController);

router
  .route("/orders")
  .get(verifyJWT, authorizedRole("customer"), getOrderHistoryController);

router
  .route("/orders/:orderId")
  .get(verifyJWT, authorizedRole("customer"), getOrderDetailsController);

router
  .route("/orders/:orderId/track")
  .get(verifyJWT, authorizedRole("customer"), trackOrderController);

router
  .route("/orders/:orderId/cancel")
  .post(verifyJWT, authorizedRole("customer"), cancelOrderController);

router
  .route("/orders/:orderId/return")
  .post(verifyJWT, authorizedRole("customer"), requestReturnController);

router
  .route("/orders/:orderId/refund")
  .post(verifyJWT, authorizedRole("customer"), requestRefundController);

router
  .route("/orders/:orderId/invoice")
  .get(verifyJWT, authorizedRole("customer"), downloadInvoiceController);

router
  .route("/orders/apply-coupon")
  .post(verifyJWT, authorizedRole("customer"), applyCouponController);

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

router
  .route("/seller/orders")
  .get(verifyJWT, authorizedRole("seller"), getSellerOrdersController);

router
  .route("/seller/orders/:orderId")
  .get(verifyJWT, authorizedRole("seller"), getSellerOrderDetailsController);

router
  .route("/seller/orders/update-status")
  .patch(verifyJWT, authorizedRole("seller"), updateOrderStatusController);

router
  .route("/seller/orders/update-tracking")
  .patch(verifyJWT, authorizedRole("seller"), updateTrackingInfoController);

router
  .route("/seller/orders/tracking-event")
  .post(verifyJWT, authorizedRole("seller"), addTrackingScanEventController);

router
  .route("/seller/orders/return-request")
  .post(
    verifyJWT,
    authorizedRole("seller"),
    handleCustomerReturnRequestController,
  );

router
  .route("/seller/orders/refund-request")
  .post(verifyJWT, authorizedRole("seller"), handleRefundRequestController);

router
  .route("/seller/sales-analytics")
  .get(verifyJWT, authorizedRole("seller"), getSalesAnalyticsController);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

router
  .route("/admin/orders")
  .get(verifyJWT, authorizedRole("admin"), getAllOrdersController);

router
  .route("/admin/orders/:orderId")
  .get(verifyJWT, authorizedRole("admin"), getOrderAdminDetailsController);

router
  .route("/admin/orders/manual-status-update")
  .patch(verifyJWT, authorizedRole("admin"), manualOrderStatusUpdateController);

router
  .route("/admin/refunds/approve")
  .post(verifyJWT, authorizedRole("admin"), approveRefundController);

router
  .route("/admin/returns/approve")
  .post(verifyJWT, authorizedRole("admin"), approveReturnController);

router
  .route("/admin/orders/export")
  .get(verifyJWT, authorizedRole("admin"), exportOrderReportController);

router
  .route("/admin/audit-logs")
  .get(verifyJWT, authorizedRole("admin"), getAuditLogsController);

router
  .route("/admin/escalations/handle")
  .patch(verifyJWT, authorizedRole("admin"), handleEscalationController);

export default router;
