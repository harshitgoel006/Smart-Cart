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
import createAndSendNotification from "../utils/sendNotification.js";

import { invoiceEmailTemplate } from "../utils/notificationEmailTemplates.js";
import sendEmail, { sendEmailWithHTML } from "../utils/sendEmail.js";







// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================





// This controller allows a customer to place a new order
const placeOrderController = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, couponCode, notes, productId, quantity, formCart = false } = req.body;

    if (!shippingAddress || !paymentMethod) {
        throw new ApiError(400, "Shipping address and payment method are required to place an order.");
    }
    
    let orderItems = [];
    let totalAmount = 0;

    if (formCart) {
        const cart = await Cart.findOne({ user: userId })
            .populate('items.product');

        if (!cart || cart.items.length === 0) {
            throw new ApiError(400, "Your cart is empty.");
        }
        
        cart.items.forEach(cartItem => {
            totalAmount += cartItem.priceSnapshot * cartItem.quantity;
            orderItems.push({
                product: cartItem.product._id,
                quantity: cartItem.quantity,
                price: cartItem.priceSnapshot,
                seller: cartItem.product.seller,
                fulfillmentStatus: "Processing"
            });
        });
        console.log("🔍 Cart orderItems:", orderItems);  // DEBUG
    } else {
        if (!productId || !quantity) {
            throw new ApiError(400, "Product ID and quantity are required to place an order.");
        }
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found.");
        }

        if (product.stock < quantity) {
            throw new ApiError(400, `Only ${product.stock} items left in stock.`);
        }

        totalAmount = product.price * quantity;
        orderItems.push({
            product: product._id,
            quantity,
            price: product.price,
            seller: product.seller,
            fulfillmentStatus: "Processing"
        });
    }

    let discount = 0;
    let couponUsed = null;
    if (couponCode) {
        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            active: true,
            expiryDate: { $gt: new Date() }
        });
        if (!coupon) {
            throw new ApiError(400, "Invalid or expired coupon code.");
        }
        if (coupon.usageCount >= coupon.totalUsageLimit) {
            throw new ApiError(400, "Coupon usage limit reached.");
        }

        if (coupon.discountType === "percentage") {
            discount = (totalAmount * coupon.discountValue) / 100;
        } else {
            discount = coupon.discountValue;
        }
        couponUsed = coupon._id;

        await Coupon.findByIdAndUpdate(coupon._id, {
            $inc: { usageCount: 1 }
        });
    }
    
    const finalAmount = totalAmount - discount;
    const qrCode = await generateQRCode();
    const qrCodeImageUrl = await generateAndUploadQRCode(qrCode);
    
    const newOrder = new Order({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Pending",
        totalAmount,
        discount,
        finalAmount,
        couponUsed,
        orderStatus: "Pending",
        qrCode,
        qrCodeImage: qrCodeImageUrl,
        notes,
        statusHistory: [
            { 
                status: "Pending",
                updatedAt: new Date(),
                role: "user"
            }
        ],
        trackingEvents: [{
            event: "Order Placed",
            scannedAt: new Date(),
            remarks: "Order successfully placed by customer",
            location: "Warehouse"
        }]
    });

    
    await newOrder.save();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { 
                    $inc: { 
                        stock: -item.quantity,
                        sold: item.quantity 
                    }
                },
                { session }
            );
        }

        // Clear user's cart
        await Cart.findOneAndUpdate(
            { user: userId },
            { 
                $set: { 
                    items: [],
                    totalItems: 0,
                    totalPrice: 0 
                }
            },
            { session }
        );

        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
        throw new ApiError(500, "Failed to update inventory and cart");
    } finally {
        session.endSession();
    }

    const populatedOrder = await Order.findById(newOrder._id)
        .populate("items.product", "name images")
        .populate("items.seller", "shopName fullname");

    // Customer notification
    try {
        await createAndSendNotification({
            recipientId: userId,
            recipientRole: "customer",
            recipientEmail: req.user.email,
            type: "ORDER_PLACED",
            title: "Order placed successfully",
            message: `Your order #${populatedOrder._id} has been placed.`,
            relatedEntity: {
                entityType: "order",
                entityId: populatedOrder._id,
            },
            channels: ["in-app", "email"],
            meta: {
                orderId: populatedOrder._id,
                amount: populatedOrder.finalAmount,
            },
        });
    } catch (e) {
        console.error("ORDER_PLACED notification (customer) failed", e);
    }

    // Seller notifications
    try {
        const sellerIds = [
            ...new Set(
                populatedOrder.items.map((i) =>
                    i.seller._id.toString()
                )
            ),
        ];

        for (const sellerId of sellerIds) {
            const sellerItem = populatedOrder.items.find(
                (i) => i.seller._id.toString() === sellerId
            );
            await createAndSendNotification({
                recipientId: sellerId,
                recipientRole: "seller",
                recipientEmail: sellerItem.seller.email ,
                type: "NEW_ORDER_FOR_SELLER",
                title: "New order received",
                message: `You have received a new order #${populatedOrder._id}.`,
                relatedEntity: {
                    entityType: "order",
                    entityId: populatedOrder._id,
                },
                channels: ["in-app", "email"],
                meta: {
                    orderId: populatedOrder._id,
                    productName: sellerItem.product.name,
                },
            });
        }
    } catch (e) {
        console.error("NEW_ORDER_FOR_SELLER notifications failed", e);
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Order placed successfully",
                populatedOrder
            )
        );
});

// This controller fetches order history for the logged-in customer
const getOrderHistoryController = asyncHandler(async( req, res) =>{
  const userId = req.user._id;
  const {page =1, limit =10, status , startDate, endDate} = req.query;

  const filter = {user: userId};

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
  const skip = (parseInt(page)-1) * parseInt(limit);
  const ordersPromise = Order.find(filter)
  .sort({createdAt: -1})
  .skip(skip)
  .limit(parseInt(limit));

  const countPromise = Order.countDocuments(filter);

  const [orders, total] = await Promise.all([ordersPromise, countPromise]);

  const responseData = {
    orders: orders.map(order => ({
      _id: order._id,
      orderStatus: order.orderStatus,
      totalAmount: order.finalAmount,
      createdAt: order.createdAt,

    })),
    pagination:{
      total, 
      page: parseInt(page),
      pages: Math.ceil(total/limit)
    }
  };

  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      responseData,
      "Order history fetched successfully",
    )
  )

});

// This controller fetches detailed information for a specific order of the logged-in customer
const getOrderDetailsController = asyncHandler(async( req, res) =>{

  const userId = req.user._id;
  const {orderId} = req.params;

  const order = await Order.findOne({_id:orderId, user: userId})
  .populate("items.product", "name images price")
  .populate("items.seller", "shopName")
  .populate("couponUsed");

  if(!order){
    throw new ApiError(404, "Order not found.");
  }
  const responseData = {
    _id: order._id,
    orderStatus: order.orderStatus,
    items: order.items,
    shippingAddress: order.shippingAddress,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    totalAmount: order.totalAmount,
    finalAmount: order.finalAmount,
    discount: order.discount,
    couponUsed: order.couponUsed,
    shipmentDetails: order.shipmentDetails,
    deliveredAt: order.deliveredAt,
    qrCode: order.qrCode,
    trackingEvents: order.trackingEvents,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      responseData,
      "Order details fetched successfully"
    )
  );

});

// This controller fetches tracking information for a specific order of the logged-in customer
const trackOrderController = asyncHandler(async( req, res) =>{

  const userId = req.user._id;
  const {orderId} = req.params;

  const order = await Order.findOne({_id:orderId, user:userId})
  .select("trackingEvents orderStatus shipmentDetails estimatedDelivery deliveredAt");

  if(!order){
    throw new ApiError(404, "Order not found or access denied.");
  }

  order.trackingEvents.sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt));

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Order tracking information fetched successfully"
    )
  );
});

// This controller allows a customer to cancel an order
const cancelOrderController = asyncHandler(async(req, res) =>{

  const userId = req.user._id;
  const {orderId} = req.params;

  const order = await Order.findOne({_id: orderId, user: userId})

  if(!order){
    throw new ApiError(404, "Order not found.");
  }
  if(!["Pending", "Processing", "Cofirmed"].includes(order.orderStatus)){
    throw new ApiError(400, `Order cannot be cancelled at this stage: ${order.orderStatus}`);
  }

  order.orderStatus = "Cancelled";

  order.statusHistory.push({
    status: "Cancelled",
    updatedAt: new Date()
  });

  await order.save();

  for(const item of order.items){
    await Product.findByIdAndUpdate(
      item.product,
      {
        $inc: {stock: item.quantity}
      }
    );
  }

  if(order.paymentStatus === "Paid"){
    const refundResult = await processRefund(order);
    if(!refundResult.success){
      throw new ApiError(500, "Refund processing failed. Contact support.");
    }
    else{
      order.paymentStatus = "Refunded";
      order.refundRequestStatus = "Approved";
      order.statusHistory.push({
        status: "Refunded",
        updatedAt: new Date()
      })
    }
  }

  await order.save();

  await createAndSendNotification({
    recipientId: userId,
    recipientType: "customer",
    type: "ORDER_CANCELLED",
    title: "Order Cancelled",
    message: `Your order #${order._id} has been cancelled.`,
    relatedEntity: { entityType: "order", entityId: order._id },
    channels: ["in-app", "email"]
  });

  const sellerIds = [...new Set(order.items.map(item => item.seller.toString()))];
  for (const sellerId of sellerIds) {
    await createAndSendNotification({
      recipientId: sellerId,
      recipientEmail: anyItem?.seller?.email,
      recipientType: "seller",
      type: "ORDER_CANCELLED",
      title: "Order Cancelled",
      message: `Order #${order._id} including your items has been cancelled.`,
      relatedEntity: { entityType: "order", entityId: order._id },
      channels: ["in-app","email"]
    });
  }

  try {
      await createAndSendNotification({
        recipientId: userId,
        recipientRole: "customer",
        recipientEmail: req.user.email,
        type: "ORDER_CANCELLED",
        title: "Order cancelled",
        message: `Your order #${order._id} has been cancelled.`,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
        },
      });
    } catch (e) {
      console.error(
        "ORDER_CANCELLED notification (customer) failed",
        e
      );
    }

    // Sellers
    try {
      const sellerIds = [
        ...new Set(
          order.items.map((item) =>
            item.seller.toString()
          )
        ),
      ];
      for (const sellerId of sellerIds) {
        const anyItem = order.items.find(
          (i) => i.seller.toString() === sellerId
        );
        await createAndSendNotification({
          recipientId: sellerId,
          recipientRole: "seller",
          recipientEmail: null,
          type: "ORDER_ITEM_CANCELLED",
          title: "Order cancelled",
          message: `Order #${order._id} including your items has been cancelled.`,
          relatedEntity: {
            entityType: "order",
            entityId: order._id,
          },
          channels: ["in-app"],
          meta: {
            orderId: order._id,
            productName: anyItem?.product?.name,
          },
        });
      }
    } catch (e) {
      console.error(
        "ORDER_ITEM_CANCELLED notifications (sellers) failed",
        e
      );
    }

  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Order cancelled successfully"
    )
  );

});

// This controller allows a customer to request a return for an order
const requestReturnController = asyncHandler(async(req, res) =>{
  const userId = req.user._id;
  const {orderId} = req.params;
  const { reason, commets} = req.body;

  const order = await Order.findOne({_id:orderId, user:userId});
  if(!order){
    throw new ApiError(404, "Order not found.");
  }

  if(order.orderStatus !== "Delivered"){
    throw new ApiError(400, "Return can only be requested for delivered orders.");
  }

  const deliveryDate = order.deliveredAt;
  const now = new Date();
  const returnWindowDays = 7;
  
  if(!deliveryDate || ((now - deliveryDate) / (1000 * 60* 60 *24)) > returnWindowDays){
    throw new ApiError(400, "Return window has expired.");
  }

  order.returnStatus = "Requested";
  order.statusHistory.push({
    status:"Return Requested",
    updatedAt: new Date()
  });
  order.notes = order.notes?order.notes + `\nReturn Reason: ${reason}\nComments: ${commets || ""}`:
  `Return Reason: ${reason}\nComments: ${commets || ""}`;

  await order.save();

  const sellerIds = [...new Set(order.items.map(item => item.seller.toString()))];
  for (const sellerId of sellerIds) {
    await createAndSendNotification({
      recipientId: sellerId,
      recipientEmail: anyItem?.seller?.email,
      recipientType: "seller",
      type: "RETURN_REQUESTED",
      title: "Return Request Submitted",
      message: `Return requested for order #${order._id}. Please review.`,
      relatedEntity: { entityType: "order", entityId: order._id },
      channels: ["in-app", "email"]
    });
  }

  try {
      await createAndSendNotification({
        recipientId: userId,
        recipientRole: "customer",
        recipientEmail: req.user.email,
        type: "RETURN_REQUESTED_CUSTOMER",
        title: "Return request submitted",
        message: `Your return request for order #${order._id} has been submitted.`,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
          reason,
        },
      });
    } catch (e) {
      console.error(
        "RETURN_REQUESTED_CUSTOMER notification failed",
        e
      );
    }

    // 🔔 Sellers
    try {
      const sellerIds = [
        ...new Set(
          order.items.map((item) =>
            item.seller.toString()
          )
        ),
      ];
      for (const sellerId of sellerIds) {
        const anyItem = order.items.find(
          (i) => i.seller.toString() === sellerId
        );
        await createAndSendNotification({
          recipientId: sellerId,
          recipientRole: "seller",
          recipientEmail: null,
          type: "RETURN_REQUESTED_FOR_ITEM",
          title: "Return requested",
          message: `Return requested for order #${order._id}. Please review.`,
          relatedEntity: {
            entityType: "order",
            entityId: order._id,
          },
          channels: ["in-app", "email"],
          meta: {
            orderId: order._id,
            productName: anyItem?.product?.name,
            reason,
          },
        });
      }
    } catch (e) {
      console.error(
        "RETURN_REQUESTED_FOR_ITEM notifications failed",
        e
      );
    }


  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Return request submitted successfully"
    )
  );

});

// This controller allows a customer to request a refund for an order
const requestRefundController = asyncHandler(async(req, res) =>{

  const userId = req.user._id;
  const {orderId} = req.params;
  const {reason, comments} = req.body;

  const order = await Order.findOne({_id:orderId, user:userId});

  if(!order){
    throw new ApiError(404, "Order not found.");
  }

  if (
    !["Cancelled", "Returned"].includes(order.orderStatus) &&
    !(order.orderStatus === "Delivered" && order.returnStatus === "Requested")
  ) {
    throw new ApiError(400, "Refund request not allowed for this order status.");
  }

  order.refundRequestStatus = "Requested";
  order.statusHistory.push({
    status: "Refund Requested",
    updatedAt: new Date()
  });
  order.notes = order.notes
    ? order.notes + `\nRefund Reason: ${reason}\nComments: ${comments || ""}`
    : `Refund Reason: ${reason}\nComments: ${comments || ""}`;

  await order.save();

  await createAndSendNotification({
    recipientId: process.env.ADMIN_USER_ID, // Set proper admin recipient
    recipientType: "admin",
    type: "REFUND_REQUESTED",
    title: "Refund Request Submitted",
    message: `Refund requested for order #${order._id}. Please review.`,
    relatedEntity: { entityType: "order", entityId: order._id },
    channels: ["in-app", "email"]
  });

  try {
      await createAndSendNotification({
        recipientId: userId,
        recipientRole: "customer",
        recipientEmail: req.user.email,
        type: "REFUND_REQUESTED_CUSTOMER",
        title: "Refund request submitted",
        message: `Your refund request for order #${order._id} has been submitted.`,
        relatedEntity: {
          entityType: "order",
          entityId: order._id,
        },
        channels: ["in-app", "email"],
        meta: {
          orderId: order._id,
          reason,
        },
      });
    } catch (e) {
      console.error(
        "REFUND_REQUESTED_CUSTOMER notification failed",
        e
      );
    }

    // 🔔 Admin notification for high-value refunds
    try {
      const threshold = 1000; // adjust
      if (order.finalAmount >= threshold) {
        // const admin = await User.findOne({ role: "admin" });
        // if (admin)
        await createAndSendNotification({
          recipientId: "6946fbc63074456aa4c2906c",
          recipientRole: "admin",
          recipientEmail: "harshitgoel885@gmail.com",
          type: "HIGH_VALUE_REFUND_REQUESTED",
          title: "High value refund request",
          message: `Refund requested for order #${order._id} (amount ₹${order.finalAmount}).`,
          relatedEntity: {
            entityType: "order",
            entityId: order._id,
          },
          channels: ["in-app"],
          meta: {
            orderId: order._id,
            amount: order.finalAmount,
          },
        });
      }
    } catch (e) {
      console.error(
        "HIGH_VALUE_REFUND_REQUESTED notification failed",
        e
      );
    }

  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      order,
      "Refund request submitted successfully"
    )
  );
});

// This controller allows a customer to download the invoice for an order
const downloadInvoiceController = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user._id;

  // Populate needed fields
  const order = await Order.findOne({
    _id: orderId,
    user: userId,
  })
    .populate("items.product", "name price")
    .populate("user", "email fullname");

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  try {
    console.log("📧 Preparing invoice email for order:", orderId);

    // ✅ Generate HTML invoice using template
    const invoiceHTML = invoiceEmailTemplate(order);

    // ✅ Send email with invoice
    await sendEmailWithHTML({
      to: order.user.email,
      subject: `SmartCart Invoice - Order #${order._id}`,
      html: invoiceHTML,
    });

    console.log("✅ Invoice email sent to:", order.user.email);

    return res.status(200).json(
      new ApiResponse(
        200,
        { orderId: order._id, email: order.user.email },
        "Invoice has been sent to your email successfully!"
      )
    );
  } catch (error) {
    console.error("❌ Invoice email failed:", error.message);
    throw new ApiError(
      500,
      `Failed to send invoice: ${error.message}`
    );
  }
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