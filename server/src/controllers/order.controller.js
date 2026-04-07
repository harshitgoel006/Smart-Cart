import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { generateQRCode, generateAndUploadQRCode } from "../utils/qrCodeGenerators.js";
import { parse } from 'json2csv';
import mongoose from "mongoose";
import XLSX from 'xlsx';
import { Escalation } from "../models/escalation.model.js";
// import { invoiceEmailTemplate } from "../utils/notificationEmailTemplates.js";
// import  { sendEmailWithHTML } from "../utils/sendEmail.js";







// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================





// This controller allows a customer to place a new order
const placeOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const order = await OrderService.placeOrder(userId, req.body, req.user);

  return res.status(201).json(
    new ApiResponse(
      201,
      order,
      "Order placed successfully"
    )
  );
});


// This controller fetches order history for the logged-in customer

const getOrderHistoryController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.getOrderHistory(userId, req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Order history fetched successfully"
    )
  );
});

// This controller fetches detailed information for a specific order of the logged-in customer

const getOrderDetailsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.getOrderDetails(userId, req.params.orderId);

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Order details fetched successfully"
    )
  );
});

// This controller fetches tracking information for a specific order of the logged-in customer

const trackOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.trackOrder(userId, req.params.orderId);

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Order tracking fetched successfully"
    )
  );
});

// This controller allows a customer to cancel an order
const cancelOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const order = await OrderService.cancelOrder(
    userId,
    req.params.orderId,
    req.user
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      order,
      "Order cancelled successfully"
    )
  );
});

// This controller allows a customer to request a return for an order
const requestReturnController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.requestReturn(
    userId,
    req.params.orderId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Return request submitted successfully"
    )
  );
});

// This controller allows a customer to request a refund for an order
const requestRefundController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.requestRefund(
    userId,
    req.params.orderId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Refund request submitted successfully"
    )
  );
});

// This controller allows a customer to download the invoice for an order
const downloadInvoiceController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const { buffer, filename } = await OrderService.generateInvoice(
    userId,
    req.params.orderId
  );

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename}`
  );

  return res.send(buffer);
});

// This controller allows a customer to apply a coupon to an order
const applyCouponController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.applyCoupon(
    userId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Coupon applied successfully"
    )
  );
});



// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================



// This controller fetches orders assigned to the logged-in seller
const getSellerOrdersController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSellerOrders(
    sellerId,
    req.query
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Seller orders fetched successfully"
    )
  );
});

// This controller fetches detailed view of a particular order for the logged-in seller
const getSellerOrderDetailsController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSellerOrderDetails(
    sellerId,
    req.params.orderId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Seller order details fetched successfully"
    )
  );
});

// This controller allows seller to update order item status
const updateOrderStatusController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.updateOrderStatus(
    sellerId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Order status updated successfully"
    )
  );
});

// This controller allows seller to update tracking info for an order item
const updateTrackingInfoController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.updateTrackingInfo(
    sellerId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Tracking info updated successfully"
    )
  );
});

// This controller allows seller to add a tracking scan event for an order item
const addTrackingScanEventController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.addTrackingEvent(
    sellerId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Tracking event added successfully"
    )
  );
});

// This controller allows seller to handle customer return requests
const handleCustomerReturnRequestController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.handleReturnRequest(
    sellerId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Return request handled successfully"
    )
  );
});
 
//  This controller allows seller to handle refund requests
const handleRefundRequestController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.handleRefundRequest(
    sellerId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Refund request handled successfully"
    )
  );
});
// This controller fetches sales analytics for the logged-in seller
const getSalesAnalyticsController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSalesAnalytics(
    sellerId,
    req.query
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Sales analytics fetched successfully"
    )
  );
});



// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================




// This controller fetches all orders with advanced filtering and pagination for admin panel
const getAllOrdersController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAllOrders(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "All orders fetched successfully"
    )
  );
});

// This controller fetches detailed information for a specific order for admin panel
const getOrderAdminDetailsController = asyncHandler(async (req, res) => {

  const data = await OrderService.getAdminOrderDetails(
    req.params.orderId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Order details fetched successfully"
    )
  );
});

// This controller allows admin to manually update order or order item status
const manualOrderStatusUpdateController = asyncHandler(async (req, res) => {

  const adminId = req.user._id;

  const data = await OrderService.manualOrderStatusUpdate(
    adminId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Order status updated by admin"
    )
  );
});

// This controller allows admin to approve or reject refund requests
const approveRefundController = asyncHandler(async (req, res) => {

  const adminId = req.user._id;

  const data = await OrderService.approveRefund(
    adminId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Refund processed successfully"
    )
  );
});

// This controller allows admin to approve or reject return requests
const approveReturnController = asyncHandler(async (req, res) => {

  const adminId = req.user._id;

  const data = await OrderService.approveReturnAdmin(
    adminId,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Return decision updated by admin"
    )
  );
});

// This controller allows admin to export order reports in CSV or Excel format
const exportOrderReportController = asyncHandler(async (req, res) => {

  const { buffer, filename } = await OrderService.exportOrders(req.query);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${filename}`
  );

  return res.send(buffer);
});

// This controller fetches audit logs for a specific order with pagination
const getAuditLogsController = asyncHandler(async (req, res) => {

  const data = await OrderService.getAuditLogs(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Audit logs fetched successfully"
    )
  );
});

// This controller allows admin to handle escalations
const handleEscalationController = asyncHandler(async (req, res) => {

  const userId = req.user._id;
  const role = req.user.role; // admin / seller

  const data = await OrderService.handleEscalation(
    userId,
    role,
    req.body
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Escalation handled successfully"
    )
  );
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