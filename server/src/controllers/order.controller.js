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
// controllers/order.controller.js

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
  const { orderId, couponCode } = req.body;

  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

  if (!coupon) {
    throw new ApiError(404, "Invalid coupon code.");
  }

  const now = new Date();
  if (coupon.expiryDate < now) {
    throw new ApiError(400, "Coupon has expired.");
  }

  if (coupon.usageLimit <= coupon.timesUsed) {
    throw new ApiError(400, "Coupon usage limit reached.");
  }

  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (coupon.minimumPurchaseAmount && order.totalAmount < coupon.minimumPurchaseAmount) {
    throw new ApiError(400, `Order total must be at least ₹${coupon.minimumPurchaseAmount} to apply this coupon.`);
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = (order.totalAmount * coupon.discountValue) / 100;
  } else if (coupon.discountType === "flat") {
    discount = coupon.discountValue;
  }

  if (coupon.maxDiscountAmount && discount > coupon.maxDiscountAmount) {
    discount = coupon.maxDiscountAmount;
  }

  order.discount = discount;
  order.finalAmount = order.totalAmount - discount;
  order.couponUsed = coupon._id;

  await order.save();

  coupon.timesUsed += 1;
  await coupon.save();

  return res.status(200).json(
    new ApiResponse(200, {
      discount,
      finalAmount: order.finalAmount,
      message: "Coupon applied successfully."
    })
  );
});



// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================



// This controller fetches orders assigned to the logged-in seller
const getSellerOrdersController = asyncHandler(async(req, res) =>{

  const sellerId = req.user._id;

  const {page =1, limit = 10, status} = req.query;

  const query = {'items.seller':sellerId};

  if(status){
    query.orderStatus = status;
  }

  const pageInt = Number(page);
  const limitInt = Number(limit);

  const order = await Order.find(query)
  .populate('user', 'fullname email')
  .populate('items.product', 'name images')
  .skip((pageInt - 1) * limitInt)
  .limit(limitInt)
  .sort({createdAt: -1});

  const totalOrders = await Order.countDocuments(query);

  const responseData = {
    orders: order,
    pagination:{
      total: totalOrders,
      page: parseInt(page),
      pages: Math.ceil(totalOrders/limit)
    }
  };

  return res.
  status(200)
  .json(
    new ApiResponse(
      200,
      responseData,
      "Seller orders fetched successfully"
    )
  )


});

// This controller fetches detailed view of a particular order for the logged-in seller
const getSellerOrderDetailsController = asyncHandler(async(req,res) =>{

  const sellerId = req.user._id;

  const {orderId} = req.params;
  const order = await Order.findOne({
    _id: orderId,
    'items.seller': sellerId
  })
  .populate('user', 'fullname email address')
  .populate('items.product', 'name images price')
  .populate('shippingInfo')
  .populate('trackingInfo');

  if(!order){
    throw new ApiError(404, "Order not found or access denied.");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Seller order details fetched successfully"
    )
  )

});

// This controller allows seller to update order item status
const updateOrderStatusController = asyncHandler(async(req, res) =>{

    const sellerId = req.user._id;
    const { orderId, itemId, newStatus } = req.body;

    const order = await Order.findOne({_id: orderId, 'items._id':itemId, 'items.seller': sellerId});

    if(!order){
      throw new ApiError(404, "Order or item not found or access denied.");
    }

    const item = order.items.find(i => i._id.toString() === itemId && i.seller.toString() === sellerId.toString());

    if(!item){
      throw new ApiError(404, "Item not found in the order for this seller.");
    }

    item.fulfillmentStatus = newStatus  
    item.statusUpdatedAt = new Date()
    const allItemsDelivered = order.items.every(i => i.fulfillmentStatus === 'Delivered');
  const allItemsShipped = order.items.every(i => i.fulfillmentStatus === 'Shipped');
  const allItemsPacked = order.items.every(i => i.fulfillmentStatus === 'Packed');
  const allItemsConfirmed = order.items.every(i => i.fulfillmentStatus === 'Confirmed');

  if (allItemsDelivered) {
    order.orderStatus = 'Delivered';
    order.deliveredAt = new Date();
  } else if (allItemsShipped) {
    order.orderStatus = 'Shipped';
  } else if (allItemsPacked) {
    order.orderStatus = 'Packed';
  } else if (allItemsConfirmed) {
    order.orderStatus = 'Confirmed';
  }
    await order.save();


    try {
      let type = null;
      let title = "";
      let msg = "";

      if (newStatus === "Shipped") {
        type = "ORDER_SHIPPED";
        title = "Order shipped";
        msg = `Your order #${order._id} has been shipped.`;
      } else if (newStatus === "Delivered") {
        type = "ORDER_DELIVERED";
        title = "Order delivered";
        msg = `Your order #${order._id} has been delivered.`;
      } else if (newStatus === "Packed") {
        type = "ORDER_PACKED";
        title = "Order packed";
        msg = `Your order #${order._id} has been packed.`;
      } else if (newStatus === "Confirmed") {
        type = "ORDER_CONFIRMED";
        title = "Order confirmed";
        msg = `Your order #${order._id} has been confirmed by the seller.`;
      }

      if (type) {
        await createAndSendNotification({
          recipientId: order.user._id,
          recipientRole: "customer",
          recipientEmail: order.user.email,
          type,
          title,
          message: msg,
          relatedEntity: {
            entityType: "order",
            entityId: order._id,
          },
          channels: ["in-app", "email"],
          meta: {
            orderId: order._id,
          },
        });
      }
    } catch (e) {
      console.error(
        "Customer order status notification failed",
        e
      );
    }


    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        item,
        "Order item status updated successfully"
      )
    );

});

// This controller allows seller to update tracking info for an order item
const updateTrackingInfoController = asyncHandler(async(req,res) =>{

    const sellerId = req.user._id;
    const {orderId, trackingNumber, itemId, courierName} = req.body;

    const order = await Order.findOne({_id: orderId, 'items.seller':sellerId, 'items._id': itemId});

    if(!order){
      throw new ApiError(404, "Order or item not found or access denied.");
    }
    const item = order.items.find(i => i._id.toString() === itemId && i.seller.toString() === sellerId.toString());
    if(!item){
      throw new ApiError(404, "Item not found in the order for this seller.");
    }
    item.shipment.courierName = courierName;
    item.shipment.trackingNumber = trackingNumber;
    item.shipment.updatedAt = new Date();
    await order.save();

    try {
      await createAndSendNotification({
        recipientId: order.user._id,
        recipientRole: "customer",
        recipientEmail: order.user.email,
        type: "ORDER_SHIPPED",
        title: "Order shipped",
        message: `Your order #${order._id} has been shipped.`,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
          courier: courierName,
          trackingNumber,
        },
      });
    } catch (e) {
      console.error(
        "ORDER_SHIPPED notification (tracking) failed",
        e
      );
    }

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        item,
        "Order item tracking info updated successfully"
      )
    );
});

// This controller allows seller to add a tracking scan event for an order item
const addTrackingScanEventController = asyncHandler(async(req, res) =>{
    const sellerId = req.user._id;
    const {orderId, itemId, event, location, remarks} = req.body;

    const order = await Order.findOne({_id: orderId, 'items.seller': sellerId, 'items._id': itemId});

    if(!order){
      throw new ApiError(404, "Order or item not found or access denied.");
    }
    const item = order.items.find(i => i._id.toString() === itemId && i.seller.toString() === sellerId.toString());
    if(!item){
      throw new ApiError(404, "Item not found in the order for this seller.");
    }
    if (!order.trackingEvents) {
      order.trackingEvents = [];
    }
    order.trackingEvents.push({
      event,
      scannedAt: new Date(),
      scannedBy: sellerId,
      location,
      remarks
    });
    await order.save();

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        item,
        "Tracking scan event added successfully"
      )
    );
});

// This controller allows seller to handle customer return requests
const handleCustomerReturnRequestController = asyncHandler(async(req, res) =>{

    const sellerId = req.user._id;
    const {orderId, itemId, action, comments} = req.body;
    const order = await Order.findOne({_id: orderId, 'items.seller': sellerId, 'items._id': itemId});
    if(!order){
      throw new ApiError(404, "Order or item not found or access denied.");
    } 
    const item = order.items.find(i => i._id.toString() === itemId && i.seller.toString() === sellerId.toString());
    if(!item){
      throw new ApiError(404, "Item not found in the order for this seller.");
    }
    const validActions = ["approve", "reject", "pending"];
    if (!validActions.includes(action)) {
      throw new ApiError(400, "Invalid action for return request.");
    }

    item.returnStatus = action.charAt(0).toUpperCase() + action.slice(1); // Capitalize first letter
    if (comments) {
      item.returnNotes = comments;
    }

    item.statusHistory.push({
      status: `Return ${item.returnStatus}`,
      updatedAt: new Date(),
      comment: comments || ""
    });

    await order.save();

    try {
      let type;
      let title;
      let msg;
      if (action === "approve") {
        type = "RETURN_APPROVED_CUSTOMER";
        title = "Return approved";
        msg = `Your return request for order #${order._id} was approved.`;
      } else if (action === "reject") {
        type = "RETURN_REJECTED_CUSTOMER";
        title = "Return request rejected";
        msg = `Your return request for order #${order._id} was rejected.`;
      } else {
        type = null;
      }

      if (type) {
        await createAndSendNotification({
          recipientId: order.user._id,
          recipientRole: "customer",
          recipientEmail: order.user.email,
          type,
          title,
          message: msg,
          relatedEntity: {
            entityType: "order",
            entityId: order._id,
          },
          channels: ["in-app", "email"],
          meta: {
            orderId: order._id,
            reason: comments,
          },
        });
      }
    } catch (e) {
      console.error(
        "Customer return decision notification failed",
        e
      );
    }

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        item,
        "Customer return request handled successfully"
      )
    );
});
 
//  This controller allows seller to handle refund requests
const handleRefundRequestController = asyncHandler(async(req, res) =>{
    const sellerId = req.user._id;
    const {orderId, itemId, action, comments} = req.body;

    const order = await Order.findOne({_id: orderId, 'items.seller': sellerId, 'items._id': itemId});

    if(!order){
      throw new ApiError(404, "Order or item not found or access denied.");
    }
    const item = order.items.find(i => i._id.toString() === itemId && i.seller.toString() === sellerId.toString());
    if(!item){
      throw new ApiError(404, "Item not found in the order for this seller.");
    }
    const validActions = ["approve", "reject", "pending"];
    if (!validActions.includes(action)) {
      throw new ApiError(400, "Invalid action for refund request.");
    }
    item.refundRequestStatus = action.charAt(0).toUpperCase() + action.slice(1); // Capitalize first letter
    if (comments) {
      item.refundNotes = comments;
    }
    item.statusHistory.push({
      status: `Refund ${item.refundRequestStatus}`,
      updatedAt: new Date(),
      comment: comments || ""
    });
    await order.save();

    try {
      let type;
      let title;
      let msg;
      if (action === "approve") {
        type = "REFUND_APPROVED_CUSTOMER";
        title = "Refund approved";
        msg = `Your refund request for order #${order._id} was approved.`;
      } else if (action === "reject") {
        type = "REFUND_REJECTED_CUSTOMER";
        title = "Refund request rejected";
        msg = `Your refund request for order #${order._id} was rejected.`;
      } else {
        type = null;
      }

      if (type) {
        await createAndSendNotification({
          recipientId: order.user._id,
          recipientRole: "customer",
          recipientEmail: order.user.email,
          type,
          title,
          message: msg,
          relatedEntity: {
            entityType: "order",
            entityId: order._id,
          },
          channels: ["in-app", "email"],
          meta: {
            orderId: order._id,
            amount: order.finalAmount,
            reason: comments,
          },
        });
      }
    } catch (e) {
      console.error(
        "Customer refund decision notification failed",
        e
      );
    }

    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        item,
        "Refund request handled successfully"
      )
    );
});

// This controller fetches sales analytics for the logged-in seller
const getSalesAnalyticsController = asyncHandler(async(req, res) =>{
    const sellerId = req.user._id;
    const { startDate, endDate } = req.query; 
    const matchConditions = {
      'items.seller': sellerId
    };
    if (startDate || endDate) {
      matchConditions.createdAt = {};
      if (startDate) {
        matchConditions.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchConditions.createdAt.$lte = new Date(endDate);
      }
    }

    const analytics = await Order.aggregate([
      { $match: matchConditions },
      { $unwind: "$items" },
      { $match: { "items.seller": sellerId } },
      { $group: {
          _id: null,
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          distinctOrders: { $addToSet: "$_id" },
          totalOrders: { $sum: 1 },
          totalProductsSold: { $sum: "$items.quantity" }
        }
      },
      {
        $project: { 
          totalSales: 1,
          totalOrders: { $size: "$distinctOrders" },  
          totalProductsSold: 1
        }
      }
    ]);
    
    const result = analytics[0] || {
      totalSales: 0,
      totalOrders: 0,
      totalProductsSold: 0
    };
    return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        "Sales analytics retrieved successfully"
      )
    );
});




// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================




// This controller fetches all orders with advanced filtering and pagination for admin panel
const getAllOrdersController = asyncHandler(async(req,res) =>{

  const {page=1, limit=20, status, startDate, endDate, sellerId, userId} = req.query;

  const filter = {};
  if(status){
    filter.orderStatus = status;
  }
  if(startDate || endDate){
    filter.createdAt = {};
    if(startDate){
      filter.createdAt.$gte = new Date(startDate);
    }
    if(endDate){
      filter.createdAt.$lte = new Date(endDate);
    }
  }
  if(sellerId){
    filter['items.seller'] = sellerId;
  }
  if(userId){
    filter.user = userId;
  }
  const skip = (parseInt(page)-1) * parseInt(limit);
  const ordersPromise = Order.find(filter)
  .sort({createdAt: -1})
  .skip(skip)
  .limit(parseInt(limit))
  .populate('user', 'fullname email')
  .populate('items.product', 'name')
  .populate('items.seller', 'name email');
  const countPromise = Order.countDocuments(filter);

  const [orders, totalOrders] = await Promise.all([ordersPromise, countPromise]);
  const responseData = {
    orders: orders,
    pagination:{
      page: parseInt(page),
      limit: parseInt(limit),
      totalOrders: totalOrders,
      totalPages: Math.ceil(totalOrders / parseInt(limit))
    }
  };

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      responseData,
      "Orders retrieved successfully"
    )
  );
});

// This controller fetches detailed information for a specific order for admin panel
const getOrderAdminDetailsController = asyncHandler(async(req,res) =>{

  const {orderId} = req.params;

  const order = await Order.findById(orderId)
  .populate('user', 'fullname email address')
  .populate('items.product', 'name images price description')
  .populate('items.seller', 'shopName fullname email')
  .populate('shipmentDetails')
  .populate('paymentInfo')
  .populate('trackingInfo');

  if(!order){
    throw new ApiError(404, "Order not found.");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Order details fetched successfully"
    )
  );
});

// This controller allows admin to manually update order or order item status
const manualOrderStatusUpdateController = asyncHandler(async(req,res) =>{
  const adminId = req.user._id;
  const {orderId,itemId, newStatus, reason} = req.body;

  const order = await Order.findById(orderId);
  if(!order){
    throw new ApiError(404, "Order not found.");
  }
 let subject;
 if(itemId){
  subject = order.items.find(i => i._id.toString() === itemId);
  if(!subject){
    throw new ApiError(404, "Order item not found.");
  }
  subject.status = newStatus;
  if(!subject.statusHistory){
    subject.statusHistory = [];
  }
  subject.statusHistory.push({
    status: newStatus,
    updatedAt: new Date(),
    updatedBy: adminId,
    role :"admin",
    reason: reason || "Manual update by admin"
  });
 }
  else{
    subject = order;
    subject.orderStatus = newStatus;
    if(!subject.statusHistory){
      subject.statusHistory = [];
    }
    subject.statusHistory.push({
      status: newStatus,
      updatedAt: new Date(),
      updatedBy: adminId,
      role: "admin",
      reason: reason || "Manual update by admin"
    });
  }
  await order.save();

  try {
      await createAndSendNotification({
        recipientId: order.user._id,
        recipientRole: "customer",
        recipientEmail: order.user.email,
        type: "SYSTEM_ANNOUNCEMENT_CUSTOMER",
        title: "Order status updated by admin",
        message: `Order #${order._id} status was updated to "${newStatus}".`,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
          status: newStatus,
        },
      });
    } catch (e) {
      console.error(
        "Admin manual order status notification failed",
        e
      );
    }
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Order status updated successfully"
    )
  );
});

// This controller allows admin to approve or reject refund requests
const approveRefundController = asyncHandler(async(req,res) =>{

  const adminId = req.user._id;
  const {orderId, itemId, action, comments} = req.body;
  if(!["approve", "reject"].includes(action)){
    throw new ApiError(400, "Invalid action. Must be 'approve' or 'reject'.");
  }
  const order = await Order.findById(orderId);
  if(!order){
    throw new ApiError(404, "Order not found.");
  }
  const item = order.items.find(i => i._id.toString() === itemId);
  if(!item){
    throw new ApiError(404, "Order item not found.");
  }
   item.refundStatus = action.charAt(0).toUpperCase() + action.slice(1);
  if (adminNotes) {
    item.refundAdminNotes = adminNotes;
  }
  if(!item.statusHistory){
    item.statusHistory = [];
  }
  item.statusHistory.push({
    status: `Refund ${item.refundStatus}`,
    updatedAt: new Date(),
    updatedBy: adminId,
    role: "admin",
    comment: comments || ""
  });
  await order.save();

  try {
      const type =
        action === "approve"
          ? "REFUND_APPROVED_CUSTOMER"
          : "REFUND_REJECTED_CUSTOMER";
      const title =
        action === "approve"
          ? "Refund approved"
          : "Refund request rejected";
      const msg =
        action === "approve"
          ? `Your refund request for order #${order._id} was approved by admin.`
          : `Your refund request for order #${order._id} was rejected by admin.`;

      await createAndSendNotification({
        recipientId: order.user._id,
        recipientRole: "customer",
        recipientEmail: order.user.email,
        type,
        title,
        message: msg,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
          reason: comments,
        },
      });
    } catch (e) {
      console.error(
        "Admin refund decision notification failed",
        e
      );
    }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      item,
      "Refund request processed successfully"
    )
  );

});

// This controller allows admin to approve or reject return requests
const approveReturnController = asyncHandler(async(req,res) =>{
  const adminId = req.user._id;
  const {orderId, itemId, action, comments} = req.body;
  if(!["approve", "reject"].includes(action)){
    throw new ApiError(400, "Invalid action. Must be 'approve' or 'reject'.");
  }
  const order = await Order.findById(orderId);
  if(!order){
    throw new ApiError(404, "Order not found.");
  }
  const item = order.items.find(i => i._id.toString() === itemId);
  if(!item){
    throw new ApiError(404, "Order item not found.");
  }
    item.returnStatus = action.charAt(0).toUpperCase() + action.slice(1);
  if(!item.statusHistory){
    item.statusHistory = [];
  }
  item.statusHistory.push({
    status: `Return ${item.returnStatus}`,
    updatedAt: new Date(),
    updatedBy: adminId,
    role: "admin",
    comment: comments || ""
  });
  await order.save();

  try {
      const type =
        action === "approve"
          ? "RETURN_APPROVED_CUSTOMER"
          : "RETURN_REJECTED_CUSTOMER";
      const title =
        action === "approve"
          ? "Return approved"
          : "Return request rejected";
      const msg =
        action === "approve"
          ? `Your return request for order #${order._id} was approved by admin.`
          : `Your return request for order #${order._id} was rejected by admin.`;

      await createAndSendNotification({
        recipientId: order.user._id,
        recipientRole: "customer",
        recipientEmail: order.user.email,
        type,
        title,
        message: msg,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
          reason: comments,
        },
      });
    } catch (e) {
      console.error(
        "Admin return decision notification failed",
        e
      );
    }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      item,
      "Return request processed successfully"
    )
  );
});

// This controller allows admin to export order reports in CSV or Excel format
const exportOrderReportController = asyncHandler(async(req,res) =>{
  const adminId = req.user._id;

  const {format = "csv", startDate, endDate, status} = req.query;
  const filter = {};
  if(status){
    filter.orderStatus = status;
  }
  if(startDate || endDate){
    filter.createdAt = {};
    if(startDate){
      filter.createdAt.$gte = new Date(startDate);
    }
    if(endDate){
      filter.createdAt.$lte = new Date(endDate);
    }
  }
  const orders = await Order.find(filter)
  .populate('user', 'fullname email')
  .populate('items.product', 'name')
  .populate('items.seller', 'name email');

  let data =[];
  orders.forEach(order => {
    order.items.forEach(item => {
      data.push({
        OrderID: order._id,
        CustomerName: order.user.fullname,
        CustomerEmail: order.user.email,
        ProductName: item.product.name,
        SellerName: item.seller.name,
        SellerEmail: item.seller.email,
        Quantity: item.quantity,
        Price: item.price,
        OrderStatus: order.orderStatus,
        CreatedAt: order.createdAt,
      });
    });
  }
  );

  if(format === "csv"){
    const csv = parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('order_report.csv');
    return res.send(csv);
  }
  else if(format === "xlsx"){
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment('order_report.xlsx');
    return res.send(buffer);
  }
  else{
    throw new ApiError(400, "Invalid format. Supported formats are 'csv' and 'xlsx'.");
  }
});

// This controller fetches audit logs for a specific order with pagination
const getAuditLogsController  = asyncHandler(async(req,res) =>{
  const { orderId, page = 1, limit = 20 } = req.query;

  if (!orderId) {
    throw new ApiError(400, "orderId parameter is required.");
  }

  const order = await Order.findById(orderId).select("statusHistory");
  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  const sortedLogs = order.statusHistory.sort((a, b) => b.updatedAt - a.updatedAt);

  const pageInt = Number(page);
  const limitInt = Number(limit);
  const startIndex = (pageInt - 1) * limitInt;
  const pagedLogs = sortedLogs.slice(startIndex, startIndex + limitInt);

  const responseData = {
    logs: pagedLogs,
    pagination: {
      page: pageInt,
      limit: limitInt,
      totalLogs: sortedLogs.length,
      totalPages: Math.ceil(sortedLogs.length / limitInt)
    }
  };

  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      responseData, 
      "Audit logs retrieved successfully"
    )
  );
});

// This controller allows admin to handle escalations
const handleEscalationController = asyncHandler(async(req,res) =>{

  const adminId = req.user._id;
  const {escalationId, action,comments} = req.body;
  if(!escalationId || !action){
    throw new ApiError(400, "escalationId and action are required.");
  }

  const validActions = ["Open", "InProgress", "Resolved", "Closed"];
  const normalizedAction = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();

  if (!validActions.includes(normalizedAction)) {
    throw new ApiError(400, `Invalid action. Allowed actions: ${validActions.join(", ")}`);
  }
  const escalation = await Escalation.findById(escalationId);
  if(!escalation){
    throw new ApiError(404, "Escalation not found.");
  }
  if(action ){
    escalation.status = action.charAt(0).toUpperCase() + action.slice(1);
  }
  if(comments){
    escalation.remarks = comments;
  }
  escalation.assignedTo = adminId;
  escalation.updatedAt = new Date();

  await escalation.save();

  try {
      await createAndSendNotification({
        recipientId: "6946fbc63074456aa4c2906c",
        recipientRole: "admin",
        recipientEmail: "harshitgoel885@gmail.com",
        type: "ESCALATION_UPDATED",
        title: "Escalation updated",
        message: `Escalation #${escalation._id} updated to ${escalation.status}.`,
        relatedEntity: {
          entityType: "escalation",
          entityId: escalation._id,
        },
        channels: ["in-app","email"],
        meta: {
          escalationId: escalation._id,
          status: escalation.status,
        },
      });
    } catch (e) {
      console.error(
        "ESCALATION_UPDATED admin notification failed",
        e
      );
    }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      escalation,
      "Escalation updated successfully"
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