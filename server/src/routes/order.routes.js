// This module defines the routes for handling order-related operations in the e-commerce application. It includes routes for both customer and seller panels, as well as admin panel handlers for managing orders. The routes are protected with JWT authentication and role-based authorization to ensure that only authorized users can access certain endpoints. The route handlers are imported from the order.controller.js file, which contains the logic for processing the requests and interacting with the database to perform CRUD operations on orders, as well as other related functionalities such as tracking shipments, handling returns and refunds, generating invoices, applying coupons, and providing sales analytics for sellers.

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

// This routes is used for placing a new order. It requires the user to be authenticated and have the "customer" role. The controller function `placeOrderController` will handle the logic for processing the order, including validating the cart, calculating totals, creating the order in the database, and initiating any necessary payment processes.
router
  .route("/orders")
  .post(verifyJWT, authorizedRole("customer"), placeOrderController);

// This route is for fetching the order history of the logged-in customer. It requires the user to be authenticated and have the "customer" role. The controller function `getOrderHistoryController` will handle retrieving the customer's past orders from the database, applying pagination and filtering based on query parameters such as page, limit, and status.
router
  .route("/orders")
  .get(verifyJWT, authorizedRole("customer"), getOrderHistoryController);

// This route is for fetching the details of a specific order. It requires the user to be authenticated and have the "customer" role. The controller function `getOrderDetailsController` will handle retrieving the details of the specified order from the database, including items, shipping information, payment status, and other relevant data.
router
  .route("/orders/:orderId")
  .get(verifyJWT, authorizedRole("customer"), getOrderDetailsController);

// This route is for tracking the shipment of a specific order. It requires the user to be authenticated and have the "customer" role. The controller function `trackOrderController` will handle retrieving the current tracking information for the specified order from the database or an external shipping API, and returning it in the response.
router
  .route("/orders/:orderId/track")
  .get(verifyJWT, authorizedRole("customer"), trackOrderController);

// This route is for canceling a specific order. It requires the user to be authenticated and have the "customer" role. The controller function `cancelOrderController` will handle the logic for canceling the specified order in the database, including checking if the order is eligible for cancellation based on its current status and updating the order status accordingly.
router
  .route("/orders/:orderId/cancel")
  .post(verifyJWT, authorizedRole("customer"), cancelOrderController);

// This route is for requesting a return for a specific order. It requires the user to be authenticated and have the "customer" role. The controller function `requestReturnController` will handle the logic for creating a return request in the database, including validating the request, checking eligibility based on the order status and return policy, and notifying the seller of the return request.
router
  .route("/orders/:orderId/return")
  .post(verifyJWT, authorizedRole("customer"), requestReturnController);

// This route is for requesting a refund for a specific order. It requires the user to be authenticated and have the "customer" role. The controller function `requestRefundController` will handle the logic for creating a refund request in the database, including validating the request, checking eligibility based on the order status and refund policy, and notifying the seller and admin of the refund request.
router
  .route("/orders/:orderId/refund")
  .post(verifyJWT, authorizedRole("customer"), requestRefundController);

// This route is for downloading the invoice for a specific order. It requires the user to be authenticated and have the "customer" role. The controller function `downloadInvoiceController` will handle the logic for generating or retrieving the invoice for the specified order, and sending it as a downloadable file in the response.
router
  .route("/orders/:orderId/invoice")
  .get(verifyJWT, authorizedRole("customer"), downloadInvoiceController);

// This route is for applying a coupon to the order. It requires the user to be authenticated and have the "customer" role. The controller function `applyCouponController` will handle the logic for validating the coupon code, checking its applicability to the order, and applying any discounts to the order totals accordingly.
router
  .route("/orders/apply-coupon")
  .post(verifyJWT, authorizedRole("customer"), applyCouponController);

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

// This route is for fetching the orders for the logged-in seller. It requires the user to be authenticated and have the "seller" role. The controller function `getSellerOrdersController` will handle retrieving the seller's orders from the database, applying pagination and filtering based on query parameters such as page, limit, status, and date range.
router
  .route("/seller/orders")
  .get(verifyJWT, authorizedRole("seller"), getSellerOrdersController);

// This route is for fetching the details of a specific order for the seller. It requires the user to be authenticated and have the "seller" role. The controller function `getSellerOrderDetailsController` will handle retrieving the details of the specified order from the database, including items, customer information, shipping details, payment status, and other relevant data that the seller needs to manage the order effectively.
router
  .route("/seller/orders/:orderId")
  .get(verifyJWT, authorizedRole("seller"), getSellerOrderDetailsController);

// This route is for updating the status of a specific order. It requires the user to be authenticated and have the "seller" role. The controller function `updateOrderStatusController` will handle the logic for updating the status of the specified order in the database, including validating the new status, checking if the status transition is allowed based on the current status, and notifying the customer of the status update.
router
  .route("/seller/orders/update-status")
  .patch(verifyJWT, authorizedRole("seller"), updateOrderStatusController);

// This route is for updating the tracking information of a specific order. It requires the user to be authenticated and have the "seller" role. The controller function `updateTrackingInfoController` will handle the logic for updating the tracking information of the specified order in the database, including validating the input data, checking if the order is eligible for tracking updates based on its current status, and notifying the customer of the updated tracking information.
router
  .route("/seller/orders/update-tracking")
  .patch(verifyJWT, authorizedRole("seller"), updateTrackingInfoController);

// This route is for adding a tracking scan event for a specific order. It requires the user to be authenticated and have the "seller" role. The controller function `addTrackingScanEventController` will handle the logic for adding a new tracking scan event to the specified order in the database, including validating the input data, checking if the order is eligible for tracking updates based on its current status, and notifying the customer of the new tracking event.
router
  .route("/seller/orders/tracking-event")
  .post(verifyJWT, authorizedRole("seller"), addTrackingScanEventController);

// This route is for handling a customer's return request for a specific order. It requires the user to be authenticated and have the "seller" role. The controller function `handleCustomerReturnRequestController` will handle the logic for processing the customer's return request, including validating the request, checking eligibility based on the order status and return policy, updating the return request status in the database, and notifying the customer of the outcome of their return request.
router
  .route("/seller/orders/return-request")
  .post(
    verifyJWT,
    authorizedRole("seller"),
    handleCustomerReturnRequestController,
  );

// This route is for handling a customer's refund request for a specific order. It requires the user to be authenticated and have the "seller" role. The controller function `handleRefundRequestController` will handle the logic for processing the customer's refund request, including validating the request, checking eligibility based on the order status and refund policy, updating the refund request status in the database, and notifying the customer of the outcome of their refund request.
router
  .route("/seller/orders/refund-request")
  .post(verifyJWT, authorizedRole("seller"), handleRefundRequestController);

// This route is for fetching sales analytics data for the logged-in seller. It requires the user to be authenticated and have the "seller" role. The controller function `getSalesAnalyticsController` will handle the logic for aggregating and returning various analytics related to the seller's sales, such as total sales, revenue, average order value, popular products, and sales trends over time.
router
  .route("/seller/sales-analytics")
  .get(verifyJWT, authorizedRole("seller"), getSalesAnalyticsController);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

// This route is for fetching all orders in the system for admin users. It requires the user to be authenticated and have the "admin" role. The controller function `getAllOrdersController` will handle retrieving all orders from the database, applying pagination and filtering based on query parameters such as page, limit, status, date range, and seller ID. This allows admins to have an overview of all orders in the system for monitoring and management purposes.
router
  .route("/admin/orders")
  .get(verifyJWT, authorizedRole("admin"), getAllOrdersController);

// This route is for fetching the details of a specific order for admin users. It requires the user to be authenticated and have the "admin" role. The controller function `getOrderAdminDetailsController` will handle retrieving the details of the specified order from the database, including items, customer information, seller information, shipping details, payment status, return and refund requests, and other relevant data that admins need to manage and oversee orders effectively.
router
  .route("/admin/orders/:orderId")
  .get(verifyJWT, authorizedRole("admin"), getOrderAdminDetailsController);

// The following routes are for various admin operations related to orders, such as manually updating order status, approving refunds and returns, exporting order reports, viewing audit logs, and handling escalations. Each of these routes requires the user to be authenticated and have the "admin" role, and they call their respective controller functions to perform the necessary logic for each operation.
router
  .route("/admin/orders/manual-status-update")
  .patch(verifyJWT, authorizedRole("admin"), manualOrderStatusUpdateController);

// This route is for manually updating the status of a specific order by an admin user. It requires the user to be authenticated and have the "admin" role. The controller function `manualOrderStatusUpdateController` will handle the logic for updating the status of the specified order in the database, including validating the new status, checking if the status transition is allowed based on the current status, and notifying the customer and seller of the status update.
router
  .route("/admin/refunds/approve")
  .post(verifyJWT, authorizedRole("admin"), approveRefundController);

// This route is for approving a customer's return request for a specific order by an admin user. It requires the user to be authenticated and have the "admin" role. The controller function `approveReturnController` will handle the logic for approving the customer's return request, including validating the request, checking eligibility based on the order status and return policy, updating the return request status in the database, and notifying the customer and seller of the approval of the return request.
router
  .route("/admin/returns/approve")
  .post(verifyJWT, authorizedRole("admin"), approveReturnController);

// This route is for exporting order reports based on query parameters such as date range, status, and seller ID. It requires the user to be authenticated and have the "admin" role. The controller function `exportOrderReportController` will handle the logic for generating the order report based on the specified criteria, and sending it as a downloadable file (e.g., CSV or Excel) in the response for the admin to review and analyze.
router
  .route("/admin/orders/export")
  .get(verifyJWT, authorizedRole("admin"), exportOrderReportController);

// This route is for fetching audit logs related to orders for admin users. It requires the user to be authenticated and have the "admin" role. The controller function `getAuditLogsController` will handle retrieving audit logs from the database based on query parameters such as page, limit, date range, and action type. This allows admins to monitor and review actions taken on orders for security and compliance purposes.
router
  .route("/admin/audit-logs")
  .get(verifyJWT, authorizedRole("admin"), getAuditLogsController);

// This route is for handling escalations related to orders by admin users. It requires the user to be authenticated and have the "admin" role. The controller function `handleEscalationController` will handle the logic for processing escalations, including validating the escalation request, updating the escalation status in the database, and notifying the relevant parties (customer, seller, and other admins) of the outcome of the escalation.
router
  .route("/admin/escalations/handle")
  .patch(verifyJWT, authorizedRole("admin"), handleEscalationController);

export default router;
