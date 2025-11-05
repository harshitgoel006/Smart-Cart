import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import{User} from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import { generateQRCode, generateAndUploadQRCode } from "../utils/qrCodeGenerators.js";


/*
Customer Panel Controllers
placeOrderController — Cart se order confirm/send karna

getOrderHistoryController — User ke past orders (paginated, filtered)

getOrderDetailsController — Specific order ki full details dekhna

trackOrderController — Real-time status/QR tracking events fetch karna

cancelOrderController — Order cancel request (pre-dispatch)

requestReturnController — Return/replace request after delivery

requestRefundController — Refund request initiate karna

downloadInvoiceController — Invoice PDF ya link download

applyCouponController — Checkout pe coupon code validate/apply

getOrderNotificationsController — User ke order-related notifications fetch

*/


// Place a new order

const placeOrderController = asyncHandler(async (req, res) =>{
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, couponCode, notes , productId, quantity, formCart = false} = req.body;

    if(!shippingAddress || !paymentMethod) {
        throw new ApiError(400, "Shipping address and payment method are required to place an order.");
    }
    let orderItems = [];
    let totalAmount = 0;

    if(formCart){
        const cart = await Cart.findOne({user:userId})
        .populate('items.product');

        if(!cart || cart.items.length === 0){
            throw new ApiError(400, "Your cart is empty.");
        }

    }
    else{
        if(!productId || !quantity){
            throw new ApiError(400, "Product ID and quantity are required to place an order.");
        }

        const product = await Product.findById(productId);
        if(!product){
            throw new ApiError(404, "Product not found.");
        }

        if(product.stock < quantity){
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
    if(couponCode){
        const coupon = await Coupon.findOne({
            code: couponCode.toUpperCase(),
            active: true,
            expiryDate: { $gt: new Date() }
        });
        if(!coupon){
            throw new ApiError(400, "Invalid or expired coupon code.");
        }
        if(coupon.usageCount >= coupon.totalUsageLimit){
            throw new ApiError(400, "Coupon usage limit reached.");
        }

        if(coupon.discountType === "percentage"){
            discount = (totalAmount * coupon.discountValue) / 100;
        }
        else {
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
            { status: "Pending",
              updatedAt: new Date()  }
        ],
        trackingEvents: [{
            event: "Order Placed",
            scannedAt: new Date(),
            remarks: "Order successfully placed by customer"
        }]
    });
    newOrder.save();

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

// getOrderHistoryController

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

  const [orders, totalOrders] = await Promise.all([ordersPromise, countPromise]);

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

// getOrderDetailsController
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

// trackOrderController

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

// cancelOrderController

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
      recipientType: "seller",
      type: "ORDER_CANCELLED",
      title: "Order Cancelled",
      message: `Order #${order._id} including your items has been cancelled.`,
      relatedEntity: { entityType: "order", entityId: order._id },
      channels: ["in-app"]
    });
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

// requestReturnController

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
      recipientType: "seller",
      type: "RETURN_REQUESTED",
      title: "Return Request Submitted",
      message: `Return requested for order #${order._id}. Please review.`,
      relatedEntity: { entityType: "order", entityId: order._id },
      channels: ["in-app", "email"]
    });
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


// requestRefundController

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


// downloadInvoiceController

const downloadInvoiceController = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new ApiError(404, "Order not found.");
  }

  if (!order.invoiceUrl) {
    throw new ApiError(404, "Invoice is not available for this order.");
  }

  return res
  .status(302)
  .redirect(order.invoiceUrl);

});

// applyCouponController

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

};


