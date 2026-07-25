import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as OrderService from "../services/order.service.js";

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

const placeOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const order = await OrderService.placeOrder(userId, req.body, req.user);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

const getOrderHistoryController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.getOrderHistory(userId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order history fetched successfully"));
});

const getOrderDetailsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.getOrderDetails(userId, req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order details fetched successfully"));
});

const trackOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.trackOrder(userId, req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order tracking fetched successfully"));
});

const cancelOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const order = await OrderService.cancelOrder(
    userId,
    req.params.orderId,
    req.user,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order cancelled successfully"));
});

const requestReturnController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.requestReturn(
    userId,
    req.params.orderId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Return request submitted successfully"));
});

const requestRefundController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.requestRefund(
    userId,
    req.params.orderId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Refund request submitted successfully"));
});

const downloadInvoiceController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { buffer, filename } = await OrderService.generateInvoice(
    userId,
    req.params.orderId,
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  return res.send(buffer);
});

const applyCouponController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.applyCoupon(userId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Coupon applied successfully"));
});

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

const getSellerOrdersController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSellerOrders(sellerId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Seller orders fetched successfully"));
});

const getSellerOrderDetailsController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSellerOrderDetails(
    sellerId,
    req.params.orderId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "Seller order details fetched successfully"),
    );
});

const updateOrderStatusController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.updateOrderStatus(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order status updated successfully"));
});

const updateTrackingInfoController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.updateTrackingInfo(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tracking info updated successfully"));
});

const addTrackingScanEventController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.addTrackingEvent(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tracking event added successfully"));
});

const handleCustomerReturnRequestController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.handleReturnRequest(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Return request handled successfully"));
});

const handleRefundRequestController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.handleRefundRequest(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Refund request handled successfully"));
});

const getSalesAnalyticsController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSalesAnalytics(sellerId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Sales analytics fetched successfully"));
});

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

const getAllOrdersController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAllOrders(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "All orders fetched successfully"));
});

const getOrderAdminDetailsController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAdminOrderDetails(req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order details fetched successfully"));
});

const manualOrderStatusUpdateController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const data = await OrderService.manualOrderStatusUpdate(adminId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order status updated by admin"));
});

const approveRefundController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const data = await OrderService.approveRefund(adminId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Refund processed successfully"));
});

const approveReturnController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const data = await OrderService.approveReturnAdmin(adminId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Return decision updated by admin"));
});

const exportOrderReportController = asyncHandler(async (req, res) => {
  const { buffer, filename } = await OrderService.exportOrders(req.query);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  return res.send(buffer);
});

const getAuditLogsController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAuditLogs(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Audit logs fetched successfully"));
});

const handleEscalationController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role; // admin / seller

  const data = await OrderService.handleEscalation(userId, role, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Escalation handled successfully"));
});

export {
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
};
