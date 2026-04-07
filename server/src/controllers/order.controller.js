import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import OrderService from "../services/order/order.service.js";

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

// Thsi controller is used to place a new order by the logged-in customer. It accepts order details in the request body and returns the created order information.
const placeOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const order = await OrderService.placeOrder(userId, req.body, req.user);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

// This controller fetches the order history for the logged-in customer with pagination and filtering options. It returns a paginated list of past orders along with summary information for each order.
const getOrderHistoryController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.getOrderHistory(userId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order history fetched successfully"));
});

// This controller fetches detailed information for a specific order of the logged-in customer, including items, shipping details, payment info, and current status.
const getOrderDetailsController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.getOrderDetails(userId, req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order details fetched successfully"));
});

// This controller fetches real-time tracking information for a specific order of the logged-in customer, including current status, location, and estimated delivery time. It integrates with the shipping carrier's API to provide up-to-date tracking details.
const trackOrderController = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await OrderService.trackOrder(userId, req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order tracking fetched successfully"));
});

// This controller is used for cancelling an order by the logged-in customer. It checks if the order is eligible for cancellation based on its current status and updates the order status to "Cancelled" if possible. It also handles any necessary refund processing if the order was already paid for.
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

// This controller allows a customer to request a return for an order. It checks if the order is eligible for return based on the return policy and updates the order status to "Return Requested". It also captures the reason for return and any additional details provided by the customer.
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

// This controller is used for requesting a refund by the logged-in customer. It checks if the order is eligible for refund based on the refund policy and updates the order status to "Refund Requested". It also captures the reason for refund and any additional details provided by the customer. If the order was paid, it initiates the refund process through the payment gateway.
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

// This controller allows a customer to download the invoice for a specific order. It generates a PDF invoice containing order details, itemized charges, and payment information, and sends it as a downloadable file in the response.
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

// This controller is used for applying a coupon code to the current order. It validates the coupon code, checks its applicability to the order, and returns the updated order summary with the applied discount if the coupon is valid.
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

// This controller fetches the list of orders for the logged-in seller with pagination and filtering options. It returns a paginated list of orders that include items sold by the seller, along with summary information for each order such as order ID, customer name, order status, and total amount.
const getSellerOrdersController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.getSellerOrders(sellerId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Seller orders fetched successfully"));
});

// This controller is used for fetching detailed information for a specific order from the perspective of the logged-in seller. It includes details about the items sold by the seller in that order, customer information, shipping details, and current status of the order. This allows the seller to view all relevant information needed to process and fulfill the order effectively.
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

// This controller allows seller to update the status of an order item (e.g., mark as shipped, delivered, etc.) based on the current stage of the order fulfillment process. It checks if the status update is valid based on the current order status and updates it accordingly. It also triggers any necessary notifications to the customer about the status change.
const updateOrderStatusController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.updateOrderStatus(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order status updated successfully"));
});

// This controller is used for updating the tracking information of an order item by the seller. It allows the seller to input tracking details such as carrier name, tracking number, and estimated delivery date. The controller validates the input and updates the order item with the new tracking information, which can then be viewed by the customer in their order details and tracking page.
const updateTrackingInfoController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.updateTrackingInfo(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tracking info updated successfully"));
});

// This controller is used for adding a tracking scan event to an order item by the seller. It allows the seller to input details about a tracking event such as location, status update, and timestamp. The controller validates the input and adds the new tracking event to the order item's tracking history, which can then be viewed by the customer in their order tracking page for real-time updates on their shipment's progress.
const addTrackingScanEventController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.addTrackingEvent(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Tracking event added successfully"));
});

// This controller allows seller to handle return requests initiated by customers. It checks the details of the return request, validates it against the return policy, and updates the order status accordingly (e.g., "Return Approved", "Return Rejected"). It also captures any additional information provided by the seller regarding the return decision and triggers notifications to the customer about the status of their return request.
const handleCustomerReturnRequestController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.handleReturnRequest(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Return request handled successfully"));
});

// This controller is used for handling refund requests initiated by customers. It checks the details of the refund request, validates it against the refund policy, and updates the order status accordingly (e.g., "Refund Approved", "Refund Rejected"). It also captures any additional information provided by the seller regarding the refund decision and triggers notifications to the customer about the status of their refund request. If the refund is approved, it initiates the refund process through the payment gateway.
const handleRefundRequestController = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await OrderService.handleRefundRequest(sellerId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Refund request handled successfully"));
});

// This controller is used for fetching sales analytics data for the logged-in seller. It provides insights into sales performance, revenue trends, and other key metrics based on the seller's order history. The controller accepts filtering options such as date range and product categories to generate customized analytics reports that can help the seller make informed business decisions.
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

// This controller fetches the list of all orders in the system for the admin panel with pagination and filtering options. It returns a paginated list of orders that include details such as order ID, customer name, seller name, order status, total amount, and order date. This allows the admin to have an overview of all orders in the system and manage them effectively.
const getAllOrdersController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAllOrders(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "All orders fetched successfully"));
});

// This controller is used for fetching detailed information for a specific order from the perspective of the admin panel. It includes comprehensive details about the order, such as customer information, seller information, items ordered, shipping details, payment information, and current status of the order. This allows the admin to view all relevant information needed to manage and resolve any issues related to the order effectively.
const getOrderAdminDetailsController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAdminOrderDetails(req.params.orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order details fetched successfully"));
});

// This controller allows admin to manually update the status of an order. It checks if the status update is valid based on the current order status and updates it accordingly. This can be used by the admin to correct any issues with order processing or to handle special cases that require manual intervention. It also triggers any necessary notifications to the customer and seller about the status change.
const manualOrderStatusUpdateController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const data = await OrderService.manualOrderStatusUpdate(adminId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Order status updated by admin"));
});

// This controller is used for approving refund requests by the admin. It checks the details of the refund request, validates it against the refund policy, and updates the order status accordingly (e.g., "Refund Approved", "Refund Rejected"). It also captures any additional information provided by the admin regarding the refund decision and triggers notifications to the customer about the status of their refund request. If the refund is approved, it initiates the refund process through the payment gateway.
const approveRefundController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const data = await OrderService.approveRefund(adminId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Refund processed successfully"));
});

// This controller is used for approving return requests by the admin. It checks the details of the return request, validates it against the return policy, and updates the order status accordingly (e.g., "Return Approved", "Return Rejected"). It also captures any additional information provided by the admin regarding the return decision and triggers notifications to the customer about the status of their return request. If the return is approved, it initiates any necessary processes for handling the return, such as generating return labels or coordinating with logistics partners.
const approveReturnController = asyncHandler(async (req, res) => {
  const adminId = req.user._id;

  const data = await OrderService.approveReturnAdmin(adminId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Return decision updated by admin"));
});

// This controller is used for exporting order reports in CSV format based on specified filters such as date range, order status, and seller. It generates a CSV file containing the relevant order data and sends it as a downloadable file in the response. This allows the admin to easily analyze and share order data for reporting and decision-making purposes.
const exportOrderReportController = asyncHandler(async (req, res) => {
  const { buffer, filename } = await OrderService.exportOrders(req.query);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

  return res.send(buffer);
});

// This controller is used for fetching audit logs related to order activities in the system. It provides a record of all significant actions taken on orders, such as status changes, cancellations, returns, and refunds, along with timestamps and user information. This allows the admin to track the history of order-related events for monitoring and troubleshooting purposes.
const getAuditLogsController = asyncHandler(async (req, res) => {
  const data = await OrderService.getAuditLogs(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Audit logs fetched successfully"));
});

// This controller is used for handling escalations related to orders. It allows the admin or seller to address escalated issues raised by customers regarding their orders. The controller accepts details about the escalation, such as the order ID, issue description, and any actions taken to resolve the issue. It updates the order status accordingly and triggers notifications to the customer about the resolution of their escalated issue.
const handleEscalationController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role; // admin / seller

  const data = await OrderService.handleEscalation(userId, role, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Escalation handled successfully"));
});

// Exporting the controllers as an object for easier import in routes
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
