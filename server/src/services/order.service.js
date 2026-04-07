
import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import NotificationService from "../services/notification/notification.service.js";
import { ApiError } from "../utils/ApiError.js";
import { Parser } from "json2csv";
const toNumber = (val) => parseFloat(val.toString());


class OrderService {

  static async placeOrder(userId, payload, user) {

    const {
      shippingAddress,
      paymentMethod = "COD",
      couponCode,
      fromCart = true,
      productId,
      quantity
    } = payload;

    if (!shippingAddress) {
      throw new ApiError(400, "Shipping address is required");
    }

    let orderItems = [];

    if (fromCart) {
      const cart = await Cart.findOne({ user: userId })
        .populate("items.product");

      if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty");
      }

      orderItems = cart.items.map(item => {
        if (!item.product) {
          throw new ApiError(400, "Product not found in cart");
        }

        const unitPrice = toNumber(item.priceSnapshot);
        const qty = item.quantity;

        return {
          product: item.product._id,
          seller: item.product.seller,

          productSnapshot: {
            name: item.product.name,
            image: item.product.images?.[0],
            slug: item.product.slug
          },

          unitPrice,
          quantity: qty,
          lineTotal: unitPrice * qty,

          fulfillmentStatus: "pending"
        };
      });

    } else {
      if (!productId || !quantity) {
        throw new ApiError(400, "Product and quantity required");
      }

      const product = await Product.findById(productId);

      if (!product) throw new ApiError(404, "Product not found");
      if (product.stock < quantity) {
        throw new ApiError(400, "Insufficient stock");
      }

      const unitPrice = toNumber(product.price);

      orderItems.push({
        product: product._id,
        seller: product.seller,

        productSnapshot: {
          name: product.name,
          image: product.images?.[0],
          slug: product.slug
        },

        unitPrice,
        quantity,
        lineTotal: unitPrice * quantity,

        fulfillmentStatus: "pending"
      });
    }

    const subtotal = orderItems.reduce((acc, i) => acc + i.lineTotal, 0);

    let discount = 0;
    let couponUsed = null;

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        active: true,
        expiryDate: { $gt: new Date() }
      });

      if (!coupon) throw new ApiError(400, "Invalid coupon");

      if (coupon.discountType === "percentage") {
        discount = (subtotal * coupon.discountValue) / 100;
      } else {
        discount = coupon.discountValue;
      }

      couponUsed = coupon._id;
    }

    const finalAmount = subtotal - discount;

    const session = await mongoose.startSession();
    session.startTransaction();

    let newOrder;

    try {

      newOrder = await Order.create([{
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,

        paymentStatus: "pending",

        subtotal,
        discount,
        tax: 0,
        deliveryCharge: 0,
        finalAmount,

        couponUsed,

        orderStatus: "pending",

        statusHistory: [{
          status: "pending",
          changedBy: userId,
          role: "user"
        }]
      }], { session });

      newOrder = newOrder[0];

      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          {
            _id: item.product,
            stock: { $gte: item.quantity }
          },
          {
            $inc: {
              stock: -item.quantity,
              sold: item.quantity
            }
          },
          { session }
        );

        if (!updated) {
          throw new ApiError(400, "Stock conflict, try again");
        }
      }

      if (fromCart) {
        await Cart.findOneAndUpdate(
          { user: userId },
          { items: [] },
          { session }
        );
      }

      await session.commitTransaction();

    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    try {
      await NotificationService.emit("ORDER_PLACED", {
        recipient: userId,
        recipientRole: "customer",
        entityType: "Order",
        entityId: newOrder._id,
        category: "order",
        email: user.email,
        meta: {
          orderId: newOrder._id,
          amount: finalAmount
        }
      });
    } catch (e) {
      console.error("Notification failed:", e.message);
    }

    return newOrder;
  }
  
  static async getOrderHistory(userId, query) {

  let {
    page = 1,
    limit = 10,
    status,
    startDate,
    endDate
  } = query;

  page = Math.max(1, parseInt(page));
  limit = Math.min(50, Math.max(1, parseInt(limit))); // max 50

  const filter = { user: userId };

  if (status) {
    filter.orderStatus = status.toLowerCase();
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([

    Order.find(filter)
      .select("_id orderStatus finalAmount createdAt")
      .sort({ createdAt: -1, _id: -1 }) // stable sort
      .skip(skip)
      .limit(limit),

    Order.countDocuments(filter)
  ]);

  const formattedOrders = orders.map(order => ({
    _id: order._id,
    orderStatus: order.orderStatus,
    finalAmount: parseFloat(order.finalAmount.toString()),
    createdAt: order.createdAt
  }));

  return {
    orders: formattedOrders,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
  }

  static async getOrderDetails(userId, orderId) {

  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  })
    .populate("items.product", "name images slug")
    .populate("items.seller", "shopName");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const items = order.items.map(item => {

    const tracking = (item.shipment?.trackingEvents || [])
      .sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt));

    return {
      _id: item._id,
      product: {
        _id: item.product?._id,
        name: item.productSnapshot?.name || item.product?.name,
        image: item.productSnapshot?.image || item.product?.images?.[0],
        slug: item.productSnapshot?.slug || item.product?.slug
      },
      seller: {
        _id: item.seller?._id,
        shopName: item.seller?.shopName
      },

      unitPrice: parseFloat(item.price?.toString() || item.unitPrice?.toString()),
      quantity: item.quantity,
      lineTotal: parseFloat(item.total?.toString() || item.lineTotal?.toString()),

      fulfillmentStatus: item.fulfillmentStatus,
      returnStatus: item.returnStatus,
      refundStatus: item.refundStatus,

      shipment: {
        courierName: item.shipment?.courierName,
        trackingNumber: item.shipment?.trackingNumber,
        shippedAt: item.shipment?.shippedAt,
        deliveredAt: item.shipment?.deliveredAt,
        trackingEvents: tracking
      }
    };
  });

  return {
    _id: order._id,
    orderStatus: order.orderStatus,

    items,

    shippingAddress: order.shippingAddress,

    payment: {
      method: order.paymentMethod,
      status: order.paymentStatus,
      transactionId: order.transactionId
    },

    pricing: {
      subtotal: parseFloat(order.totalAmount?.toString() || order.subtotal?.toString()),
      discount: parseFloat(order.discount?.toString()),
      finalAmount: parseFloat(order.finalAmount?.toString())
    },

    statusHistory: order.statusHistory,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
  }

  // services/order.service.js

  static async trackOrder(userId, orderId) {

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  })
    .select("items orderStatus createdAt");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  ////////////////////////////////////////////////////////
  // 🔄 BUILD TRACKING RESPONSE
  ////////////////////////////////////////////////////////

  const itemsTracking = order.items.map(item => {

    const trackingEvents = (item.shipment?.trackingEvents || [])
      .sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt))
      .map(event => ({
        event: event.event,
        location: event.location,
        remarks: event.remarks,
        scannedAt: event.scannedAt
      }));

    return {
      itemId: item._id,
      productId: item.product,

      fulfillmentStatus: item.fulfillmentStatus,

      shipment: {
        courierName: item.shipment?.courierName,
        trackingNumber: item.shipment?.trackingNumber,
        shippedAt: item.shipment?.shippedAt,
        deliveredAt: item.shipment?.deliveredAt
      },

      trackingTimeline: trackingEvents
    };
  });

  ////////////////////////////////////////////////////////
  // 📤 FINAL RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    orderStatus: order.orderStatus,
    createdAt: order.createdAt,
    items: itemsTracking
  };
  }

  // services/order.service.js

  static async cancelOrder(userId, orderId, user) {

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  ////////////////////////////////////////////////////////
  // ❌ CHECK ELIGIBILITY
  ////////////////////////////////////////////////////////

  if (!["pending", "processing", "confirmed"].includes(order.orderStatus)) {
    throw new ApiError(
      400,
      `Order cannot be cancelled at status: ${order.orderStatus}`
    );
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE ORDER STATUS
    ////////////////////////////////////////////////////

    order.orderStatus = "cancelled";

    order.statusHistory.push({
      status: "cancelled",
      changedBy: userId,
      role: "user",
      comment: "Cancelled by customer"
    });

    ////////////////////////////////////////////////////
    // RESTORE STOCK
    ////////////////////////////////////////////////////

    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { stock: item.quantity }
        },
        { session }
      );
    }

    ////////////////////////////////////////////////////
    // HANDLE REFUND
    ////////////////////////////////////////////////////

    if (order.paymentStatus === "paid") {
      // TODO: integrate payment gateway refund
      order.paymentStatus = "refunded";

      order.statusHistory.push({
        status: "refunded",
        changedBy: userId,
        role: "system",
        comment: "Auto refund after cancellation"
      });
    }

    await order.save({ session });

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATIONS (OUTSIDE TRANSACTION)
  ////////////////////////////////////////////////////////

  try {
    await NotificationService.emit("ORDER_CANCELLED", {
      recipient: userId,
      recipientRole: "customer",
      entityType: "Order",
      entityId: order._id,
      category: "order",
      email: user.email,
      meta: {
        orderId: order._id
      }
    });
  } catch (e) {
    console.error("Customer notification failed");
  }

  ////////////////////////////////////////////////////////
  // 🔔 SELLER NOTIFICATIONS
  ////////////////////////////////////////////////////////

  try {
    const sellerIds = [...new Set(order.items.map(i => i.seller.toString()))];

    for (const sellerId of sellerIds) {
      const anyItem = order.items.find(
        i => i.seller.toString() === sellerId
      );

      await NotificationService.emit("ORDER_ITEM_CANCELLED", {
        recipient: sellerId,
        recipientRole: "seller",
        entityType: "Order",
        entityId: order._id,
        category: "order",
        meta: {
          orderId: order._id,
          productName: anyItem?.productSnapshot?.name
        }
      });
    }

  } catch (e) {
    console.error("Seller notification failed");
  }

  return order;
  }


  static async requestReturn(userId, orderId, payload) {

  const { itemId, reason } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  if (!reason) {
    throw new ApiError(400, "Return reason is required");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  ////////////////////////////////////////////////////////
  // 🎯 FIND ITEM
  ////////////////////////////////////////////////////////

  const item = order.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found in order");
  }

  ////////////////////////////////////////////////////////
  // 🚫 CHECK ELIGIBILITY
  ////////////////////////////////////////////////////////

  if (item.fulfillmentStatus !== "delivered") {
    throw new ApiError(400, "Item not delivered yet");
  }

  if (item.returnStatus !== "none") {
    throw new ApiError(400, "Return already requested");
  }

  ////////////////////////////////////////////////////////
  // ⏳ RETURN WINDOW (7 DAYS)
  ////////////////////////////////////////////////////////

  const deliveredAt = item.shipment?.deliveredAt;

  if (!deliveredAt) {
    throw new ApiError(400, "Delivery date not found");
  }

  const daysPassed =
    (Date.now() - new Date(deliveredAt).getTime()) /
    (1000 * 60 * 60 * 24);

  if (daysPassed > 7) {
    throw new ApiError(400, "Return window expired");
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE ITEM
    ////////////////////////////////////////////////////

    item.returnStatus = "requested";

    ////////////////////////////////////////////////////
    // CREATE ESCALATION
    ////////////////////////////////////////////////////

    const escalation = await Escalation.create([{
      order: order._id,
      escalationType: "return",
      raisedBy: userId,
      remarks: reason
    }], { session });

    ////////////////////////////////////////////////////
    // SAVE ORDER
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

    ////////////////////////////////////////////////////
    // 🔔 NOTIFICATIONS
    ////////////////////////////////////////////////////

    try {
      await NotificationService.emit("RETURN_REQUESTED", {
        recipient: userId,
        recipientRole: "customer",
        entityType: "Order",
        entityId: order._id,
        category: "return",
        meta: {
          orderId: order._id,
          itemId: item._id
        }
      });
    } catch {}

    try {
      await NotificationService.emit("RETURN_REQUESTED_SELLER", {
        recipient: item.seller,
        recipientRole: "seller",
        entityType: "Order",
        entityId: order._id,
        category: "return",
        meta: {
          orderId: order._id,
          productName: item.productSnapshot?.name
        }
      });
    } catch {}

    return {
      itemId: item._id,
      returnStatus: item.returnStatus,
      escalationId: escalation[0]._id
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}


static async requestRefund(userId, orderId, payload) {

  const { itemId, reason } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  if (!reason) {
    throw new ApiError(400, "Refund reason is required");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  ////////////////////////////////////////////////////////
  // 🎯 FIND ITEM
  ////////////////////////////////////////////////////////

  const item = order.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  ////////////////////////////////////////////////////////
  // 🚫 CHECK ELIGIBILITY
  ////////////////////////////////////////////////////////

  if (item.returnStatus !== "approved") {
    throw new ApiError(400, "Return must be approved before refund");
  }

  if (item.refundStatus !== "none") {
    throw new ApiError(400, "Refund already requested");
  }

  if (order.paymentStatus !== "paid") {
    throw new ApiError(400, "Refund only applicable for paid orders");
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE REFUND STATUS
    ////////////////////////////////////////////////////

    item.refundStatus = "pending";

    ////////////////////////////////////////////////////
    // CREATE ESCALATION (OPTIONAL BUT GOOD)
    ////////////////////////////////////////////////////

    const escalation = await Escalation.create([{
      order: order._id,
      escalationType: "refund",
      raisedBy: userId,
      remarks: reason
    }], { session });

    ////////////////////////////////////////////////////
    // SAVE ORDER
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

    ////////////////////////////////////////////////////
    // 🔔 NOTIFICATIONS
    ////////////////////////////////////////////////////

    try {
      await NotificationService.emit("REFUND_REQUESTED", {
        recipient: userId,
        recipientRole: "customer",
        entityType: "Order",
        entityId: order._id,
        category: "refund",
        meta: {
          orderId: order._id,
          itemId: item._id
        }
      });
    } catch {}

    try {
      await NotificationService.emit("REFUND_REQUESTED_ADMIN", {
        recipientRole: "admin",
        entityType: "Order",
        entityId: order._id,
        category: "refund",
        meta: {
          orderId: order._id,
          productName: item.productSnapshot?.name
        }
      });
    } catch {}

    return {
      itemId: item._id,
      refundStatus: item.refundStatus,
      escalationId: escalation[0]._id
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

static async generateInvoice(userId, orderId) {

    ////////////////////////////////////////////////////////
    // 🛡️ VALIDATION
    ////////////////////////////////////////////////////////

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(400, "Invalid order ID");
    }

    ////////////////////////////////////////////////////////
    // 🔍 FETCH ORDER
    ////////////////////////////////////////////////////////

    const order = await Order.findOne({
      _id: orderId,
      user: userId
    }).populate("items.product", "name");

    if (!order) {
      throw new ApiError(404, "Order not found");
    }

    ////////////////////////////////////////////////////////
    // 🔄 TRANSFORM DATA
    ////////////////////////////////////////////////////////

    const transformedOrder = {
      ...order.toObject(),

      items: order.items.map(item => ({
        product: {
          name: item.productSnapshot?.name || item.product?.name
        },
        quantity: item.quantity,
        price: toNumber(item.price || item.unitPrice)
      })),

      subtotal: toNumber(order.subtotal || order.totalAmount),
      finalAmount: toNumber(order.finalAmount),
      discountAmount: toNumber(order.discount || 0),
      shippingCost: toNumber(order.deliveryCharge || 0)
    };

    ////////////////////////////////////////////////////////
    // 🧾 GENERATE HTML
    ////////////////////////////////////////////////////////

    const html = invoiceEmailTemplate(transformedOrder);

    ////////////////////////////////////////////////////////
    // 📄 CONVERT TO PDF
    ////////////////////////////////////////////////////////

    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    ////////////////////////////////////////////////////////
    // 📤 RETURN
    ////////////////////////////////////////////////////////

    return {
      buffer: pdfBuffer,
      filename: `invoice-${order._id}.pdf`
    };
  }



static async applyCoupon(userId, payload) {

  const { orderId, couponCode } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!couponCode) {
    throw new ApiError(400, "Coupon code required");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER + COUPON
  ////////////////////////////////////////////////////////

  const [order, coupon] = await Promise.all([
    Order.findOne({ _id: orderId, user: userId }),
    Coupon.findOne({ code: couponCode.toUpperCase() })
  ]);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (!coupon || !coupon.isActive) {
    throw new ApiError(400, "Invalid coupon");
  }

  ////////////////////////////////////////////////////////
  // ⏳ EXPIRY CHECK
  ////////////////////////////////////////////////////////

  const now = new Date();

  if (coupon.expiryDate && coupon.expiryDate < now) {
    throw new ApiError(400, "Coupon expired");
  }

  if (coupon.startDate && coupon.startDate > now) {
    throw new ApiError(400, "Coupon not started yet");
  }

  ////////////////////////////////////////////////////////
  // 📊 USAGE CHECK
  ////////////////////////////////////////////////////////

  if (coupon.usageCount >= coupon.totalUsageLimit) {
    throw new ApiError(400, "Coupon usage limit exceeded");
  }

  const userUsage = coupon.usedBy.find(
    u => u.user.toString() === userId.toString()
  );

  if (userUsage && userUsage.count >= coupon.usageLimitPerUser) {
    throw new ApiError(400, "Coupon usage limit reached for user");
  }

  ////////////////////////////////////////////////////////
  // 💰 ORDER VALUE CHECK
  ////////////////////////////////////////////////////////

  const subtotal = parseFloat(order.totalAmount.toString());

  if (subtotal < coupon.minOrderValue) {
    throw new ApiError(
      400,
      `Minimum order value ₹${coupon.minOrderValue} required`
    );
  }

  ////////////////////////////////////////////////////////
  // 🧮 CALCULATE DISCOUNT
  ////////////////////////////////////////////////////////

  let discount = 0;

  if (coupon.discountType === "percent") {
    discount = (subtotal * coupon.discountValue) / 100;

    if (coupon.maxDiscount) {
      discount = Math.min(discount, coupon.maxDiscount);
    }
  } else {
    discount = coupon.discountValue;
  }

  ////////////////////////////////////////////////////////
  // 🧾 UPDATE ORDER
  ////////////////////////////////////////////////////////

  order.discount = discount;
  order.finalAmount = subtotal - discount;
  order.couponUsed = coupon._id;

  await order.save();

  ////////////////////////////////////////////////////////
  // 📊 UPDATE COUPON USAGE
  ////////////////////////////////////////////////////////

  coupon.usageCount += 1;

  if (userUsage) {
    userUsage.count += 1;
  } else {
    coupon.usedBy.push({ user: userId, count: 1 });
  }

  await coupon.save();

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATION
  ////////////////////////////////////////////////////////

  try {
    await NotificationService.emit("COUPON_APPLIED", {
      recipient: userId,
      recipientRole: "customer",
      category: "order",
      entityType: "Order",
      entityId: order._id,
      meta: {
        couponCode: coupon.code,
        discount
      }
    });
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    couponCode: coupon.code,
    discount,
    finalAmount: order.finalAmount
  };
}


static async getSellerOrders(sellerId, query) {

  let {
    page = 1,
    limit = 10,
    status
  } = query;

  page = Math.max(1, parseInt(page));
  limit = Math.min(50, Math.max(1, parseInt(limit)));


  const matchStage = {
    "items.seller": new mongoose.Types.ObjectId(sellerId)
  };


  const pipeline = [

    { $match: matchStage },
    { $unwind: "$items" },
    {
      $match: {
        "items.seller": new mongoose.Types.ObjectId(sellerId),
        ...(status && {
          "items.fulfillmentStatus": status.toLowerCase()
        })
      }
    },
    { $sort: { createdAt: -1, _id: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },

    {
      $project: {
        orderId: "$_id",
        createdAt: 1,
        orderStatus: 1,

        itemId: "$items._id",
        product: "$items.product",
        quantity: "$items.quantity",
        price: "$items.price",
        total: "$items.total",
        fulfillmentStatus: "$items.fulfillmentStatus",

        shipment: "$items.shipment"
      }
    }
  ];

  const orders = await Order.aggregate(pipeline);

  const total = await Order.countDocuments({
    "items.seller": sellerId
  });

  const formatted = orders.map(o => ({
    ...o,
    price: parseFloat(o.price?.toString()),
    total: parseFloat(o.total?.toString())
  }));

  return {
    orders: formatted,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
}

static async getSellerOrderDetails(sellerId, orderId) {

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    "items.seller": sellerId
  })
    .populate("user", "fullname email")
    .populate("items.product", "name images");

  if (!order) {
    throw new ApiError(404, "Order not found or not accessible");
  }

  ////////////////////////////////////////////////////////
  // 🎯 FILTER SELLER ITEMS
  ////////////////////////////////////////////////////////

  const sellerItems = order.items.filter(
    item => item.seller.toString() === sellerId.toString()
  );

  ////////////////////////////////////////////////////////
  // 🔄 TRANSFORM ITEMS
  ////////////////////////////////////////////////////////

  const items = sellerItems.map(item => {

    const tracking = (item.shipment?.trackingEvents || [])
      .sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt));

    return {
      itemId: item._id,

      product: {
        id: item.product?._id,
        name: item.productSnapshot?.name || item.product?.name,
        image: item.productSnapshot?.image || item.product?.images?.[0]
      },

      quantity: item.quantity,
      price: parseFloat(item.price?.toString() || item.unitPrice?.toString()),
      total: parseFloat(item.total?.toString() || item.lineTotal?.toString()),

      fulfillmentStatus: item.fulfillmentStatus,
      returnStatus: item.returnStatus,
      refundStatus: item.refundStatus,

      shipment: {
        courierName: item.shipment?.courierName,
        trackingNumber: item.shipment?.trackingNumber,
        shippedAt: item.shipment?.shippedAt,
        deliveredAt: item.shipment?.deliveredAt
      },

      trackingTimeline: tracking
    };
  });

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,

    customer: {
      name: order.user?.fullname,
      email: order.user?.email
    },

    shippingAddress: order.shippingAddress,

    orderStatus: order.orderStatus,

    items,

    createdAt: order.createdAt
  };
}

static async updateOrderStatus(sellerId, payload) {

  const { orderId, itemId, status, tracking } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  const allowedTransitions = {
    pending: ["processing"],
    processing: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: []
  };

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    "items._id": itemId,
    "items.seller": sellerId
  });

  if (!order) {
    throw new ApiError(404, "Order item not found");
  }

  const item = order.items.id(itemId);

  ////////////////////////////////////////////////////////
  // 🚫 TRANSITION CHECK
  ////////////////////////////////////////////////////////

  if (!allowedTransitions[item.fulfillmentStatus]?.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status transition from ${item.fulfillmentStatus} → ${status}`
    );
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE ITEM STATUS
    ////////////////////////////////////////////////////

    item.fulfillmentStatus = status;

    ////////////////////////////////////////////////////
    // HANDLE SHIPMENT
    ////////////////////////////////////////////////////

    if (status === "shipped") {
      if (!tracking?.courierName || !tracking?.trackingNumber) {
        throw new ApiError(400, "Tracking info required");
      }

      item.shipment = {
        ...item.shipment,
        courierName: tracking.courierName,
        trackingNumber: tracking.trackingNumber,
        shippedAt: new Date()
      };
    }

    if (status === "delivered") {
      item.shipment.deliveredAt = new Date();
    }

    ////////////////////////////////////////////////////
    // DERIVE ORDER STATUS
    ////////////////////////////////////////////////////

    const statuses = order.items.map(i => i.fulfillmentStatus);

    if (statuses.every(s => s === "delivered")) {
      order.orderStatus = "delivered";
    } else if (statuses.some(s => s === "shipped")) {
      order.orderStatus = "partially_shipped";
    } else if (statuses.every(s => s === "processing")) {
      order.orderStatus = "processing";
    }

    ////////////////////////////////////////////////////
    // STATUS HISTORY
    ////////////////////////////////////////////////////

    order.statusHistory.push({
      status,
      changedBy: sellerId,
      role: "seller",
      comment: `Updated item ${itemId}`
    });

    ////////////////////////////////////////////////////
    // SAVE
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATIONS
  ////////////////////////////////////////////////////////

  try {
    if (status === "shipped") {
      await NotificationService.emit("ORDER_SHIPPED", {
        recipient: order.user,
        recipientRole: "customer",
        category: "order",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id,
          courier: tracking?.courierName,
          trackingNumber: tracking?.trackingNumber
        }
      });
    }

    if (status === "delivered") {
      await NotificationService.emit("ORDER_DELIVERED", {
        recipient: order.user,
        recipientRole: "customer",
        category: "order",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id
        }
      });
    }
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    itemId,
    status
  };
}

static async updateTrackingInfo(sellerId, payload) {

  const { orderId, itemId, tracking } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    "items._id": itemId,
    "items.seller": sellerId
  });

  if (!order) {
    throw new ApiError(404, "Order item not found");
  }

  const item = order.items.id(itemId);

  ////////////////////////////////////////////////////////
  // 🚫 STATUS CHECK
  ////////////////////////////////////////////////////////

  if (["delivered", "cancelled"].includes(item.fulfillmentStatus)) {
    throw new ApiError(
      400,
      "Tracking cannot be updated after delivery/cancellation"
    );
  }

  ////////////////////////////////////////////////////////
  // 🔄 PARTIAL UPDATE
  ////////////////////////////////////////////////////////

  if (!item.shipment) item.shipment = {};

  // Prevent tracking number overwrite
  if (
    item.shipment.trackingNumber &&
    tracking.trackingNumber &&
    item.shipment.trackingNumber !== tracking.trackingNumber
  ) {
    throw new ApiError(400, "Tracking number cannot be changed once set");
  }

  item.shipment.courierName =
    tracking.courierName || item.shipment.courierName;

  item.shipment.trackingNumber =
    tracking.trackingNumber || item.shipment.trackingNumber;

  if (tracking.estimatedDelivery) {
    item.shipment.estimatedDelivery = new Date(tracking.estimatedDelivery);
  }

  ////////////////////////////////////////////////////////
  // SAVE
  ////////////////////////////////////////////////////////

  await order.save();

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATION
  ////////////////////////////////////////////////////////

  try {
    await NotificationService.emit("ORDER_SHIPPED", {
      recipient: order.user,
      recipientRole: "customer",
      category: "order",
      entityType: "Order",
      entityId: order._id,
      meta: {
        orderId: order._id,
        courier: item.shipment.courierName,
        trackingNumber: item.shipment.trackingNumber
      }
    });
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    itemId,
    shipment: item.shipment
  };
}


static async addTrackingEvent(sellerId, payload) {

  const { orderId, itemId, event, location, remarks } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  if (!event) {
    throw new ApiError(400, "Event is required");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    "items._id": itemId,
    "items.seller": sellerId
  });

  if (!order) {
    throw new ApiError(404, "Order item not found");
  }

  const item = order.items.id(itemId);

  ////////////////////////////////////////////////////////
  // 🚫 STATUS CHECK
  ////////////////////////////////////////////////////////

  if (["delivered", "cancelled"].includes(item.fulfillmentStatus)) {
    throw new ApiError(
      400,
      "Cannot add tracking events after delivery/cancellation"
    );
  }

  ////////////////////////////////////////////////////////
  // 📍 CREATE EVENT
  ////////////////////////////////////////////////////////

  const trackingEvent = {
    event,
    location,
    remarks,
    scannedAt: new Date(),
    scannedBy: sellerId
  };

  if (!item.shipment) item.shipment = {};
  if (!item.shipment.trackingEvents) {
    item.shipment.trackingEvents = [];
  }

  ////////////////////////////////////////////////////////
  // PUSH EVENT
  ////////////////////////////////////////////////////////

  item.shipment.trackingEvents.push(trackingEvent);

  ////////////////////////////////////////////////////////
  // 🔄 AUTO STATUS UPDATE (SMART LOGIC 🔥)
  ////////////////////////////////////////////////////////

  const eventLower = event.toLowerCase();

  if (eventLower.includes("out for delivery")) {
    item.fulfillmentStatus = "shipped";
  }

  if (eventLower.includes("delivered")) {
    item.fulfillmentStatus = "delivered";
    item.shipment.deliveredAt = new Date();
  }

  ////////////////////////////////////////////////////////
  // SAVE
  ////////////////////////////////////////////////////////

  await order.save();

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATION
  ////////////////////////////////////////////////////////

  try {
    await NotificationService.emit("ORDER_SHIPPED", {
      recipient: order.user,
      recipientRole: "customer",
      category: "order",
      entityType: "Order",
      entityId: order._id,
      meta: {
        orderId: order._id,
        status: event,
        location
      }
    });
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    itemId,
    event: trackingEvent
  };
}


static async handleReturnRequest(sellerId, payload) {

  const { orderId, itemId, decision, reason } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  if (!["approved", "rejected"].includes(decision)) {
    throw new ApiError(400, "Invalid decision");
  }

  if (decision === "rejected" && !reason) {
    throw new ApiError(400, "Reason required for rejection");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    "items._id": itemId,
    "items.seller": sellerId
  });

  if (!order) {
    throw new ApiError(404, "Order item not found");
  }

  const item = order.items.id(itemId);

  ////////////////////////////////////////////////////////
  // 🚫 STATE CHECK
  ////////////////////////////////////////////////////////

  if (item.returnStatus !== "requested") {
    throw new ApiError(400, "No pending return request");
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE RETURN STATUS
    ////////////////////////////////////////////////////

    item.returnStatus = decision;

    ////////////////////////////////////////////////////
    // UPDATE ESCALATION
    ////////////////////////////////////////////////////

    await Escalation.findOneAndUpdate(
      {
        order: order._id,
        escalationType: "return",
        status: "open"
      },
      {
        status: decision === "approved" ? "resolved" : "rejected",
        remarks: reason
      },
      { session }
    );

    ////////////////////////////////////////////////////
    // SAVE ORDER
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATIONS
  ////////////////////////////////////////////////////////

  try {
    if (decision === "approved") {
      await NotificationService.emit("RETURN_APPROVED_CUSTOMER", {
        recipient: order.user,
        recipientRole: "customer",
        category: "return",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id
        }
      });
    } else {
      await NotificationService.emit("RETURN_REJECTED_CUSTOMER", {
        recipient: order.user,
        recipientRole: "customer",
        category: "return",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id,
          reason
        }
      });
    }
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    itemId,
    returnStatus: item.returnStatus
  };
}


static async handleRefundRequest(sellerId, payload) {

  const { orderId, itemId, decision, reason } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  if (!["approved", "rejected"].includes(decision)) {
    throw new ApiError(400, "Invalid decision");
  }

  if (decision === "rejected" && !reason) {
    throw new ApiError(400, "Reason required for rejection");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findOne({
    _id: orderId,
    "items._id": itemId,
    "items.seller": sellerId
  });

  if (!order) {
    throw new ApiError(404, "Order item not found");
  }

  const item = order.items.id(itemId);

  ////////////////////////////////////////////////////////
  // 🚫 STATE CHECK
  ////////////////////////////////////////////////////////

  if (item.refundStatus !== "pending") {
    throw new ApiError(400, "No pending refund request");
  }

  if (item.returnStatus !== "approved") {
    throw new ApiError(400, "Return must be approved first");
  }

  if (order.paymentStatus !== "paid") {
    throw new ApiError(400, "Refund not applicable for unpaid orders");
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE REFUND STATUS
    ////////////////////////////////////////////////////

    item.refundStatus = decision;

    ////////////////////////////////////////////////////
    // UPDATE ESCALATION
    ////////////////////////////////////////////////////

    await Escalation.findOneAndUpdate(
      {
        order: order._id,
        escalationType: "refund",
        status: "open"
      },
      {
        status: decision === "approved" ? "resolved" : "rejected",
        remarks: reason
      },
      { session }
    );

    ////////////////////////////////////////////////////
    // SAVE ORDER
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATIONS
  ////////////////////////////////////////////////////////

  try {
    if (decision === "approved") {
      await NotificationService.emit("REFUND_APPROVED_CUSTOMER", {
        recipient: order.user,
        recipientRole: "customer",
        category: "refund",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id,
          amount: parseFloat(item.total?.toString())
        }
      });
    } else {
      await NotificationService.emit("REFUND_REJECTED_CUSTOMER", {
        recipient: order.user,
        recipientRole: "customer",
        category: "refund",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id,
          reason
        }
      });
    }
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    itemId,
    refundStatus: item.refundStatus
  };
}


static async getSalesAnalytics(sellerId, query) {

  let { startDate, endDate } = query;

  ////////////////////////////////////////////////////////
  // 🛡️ DATE RANGE
  ////////////////////////////////////////////////////////

  const match = {
    "items.seller": new mongoose.Types.ObjectId(sellerId)
  };

  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  ////////////////////////////////////////////////////////
  // 🔥 MAIN AGGREGATION
  ////////////////////////////////////////////////////////

  const pipeline = [

    { $match: match },

    { $unwind: "$items" },

    {
      $match: {
        "items.seller": new mongoose.Types.ObjectId(sellerId)
      }
    },

    ////////////////////////////////////////////////////
    // 📊 GROUP METRICS
    ////////////////////////////////////////////////////

    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $toDouble: "$items.total" } },
        totalItemsSold: { $sum: "$items.quantity" },
        totalOrders: { $addToSet: "$_id" }
      }
    },

    {
      $project: {
        totalRevenue: 1,
        totalItemsSold: 1,
        totalOrders: { $size: "$totalOrders" }
      }
    }
  ];

  const summary = await Order.aggregate(pipeline);

  ////////////////////////////////////////////////////////
  // 📈 DAILY TREND
  ////////////////////////////////////////////////////////

  const trend = await Order.aggregate([
    { $match: match },
    { $unwind: "$items" },
    {
      $match: {
        "items.seller": new mongoose.Types.ObjectId(sellerId)
      }
    },
    {
      $group: {
        _id: {
          day: { $dayOfMonth: "$createdAt" },
          month: { $month: "$createdAt" },
          year: { $year: "$createdAt" }
        },
        revenue: { $sum: { $toDouble: "$items.total" } }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
  ]);

  ////////////////////////////////////////////////////////
  // 🏆 TOP PRODUCTS
  ////////////////////////////////////////////////////////

  const topProducts = await Order.aggregate([
    { $match: match },
    { $unwind: "$items" },
    {
      $match: {
        "items.seller": new mongoose.Types.ObjectId(sellerId)
      }
    },
    {
      $group: {
        _id: "$items.product",
        totalSold: { $sum: "$items.quantity" },
        revenue: { $sum: { $toDouble: "$items.total" } }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 }
  ]);

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    summary: summary[0] || {
      totalRevenue: 0,
      totalItemsSold: 0,
      totalOrders: 0
    },
    trend,
    topProducts
  };
}


static async getAllOrders(query){
  let{
    page = 1,
    limit = 10,
    orderStatus,
    paymentStatus,
    startDate,
    endDate,
    search
  } = query;

  page = Math.max(1,parseInt(page));
  limit = Math.min(50,Math.max(1,parseInt(limit)));

  const filter = {};

  if(orderStatus){
    filter.orderStatus = orderStatus.toLowerCase();
  }

  if(paymentStatus){
    filter.paymentStatus = paymentStatus.toLowerCase();
  }

  if(startDate || endDate){
    filter.createdAt = {};
    if(startDate) filter.createdAt.$gte = new Date(startDate);
    if(endDate) filter.createdAt.$lte = new Date(endDate);
  }

  if(search){
    if(mongoose.Types.ObjectId.isValid(search)){
      filter._id = search;
    }
  }

  const orders = await Order.find(filter)
  .select(
    "_id user orderStatus paymentStatus finalAmount createdAt"
  )
  .populate("user","fullname email")
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit);

  const total = await Order.countDocuments(filter);

  const formatted = orders.map(o => ({
    orderId: o>_id,
    customer: {
      name: o.user?.fullname,
      email: o.user?.email
    },
    orderStatus: o.orderStatus,
    paymentStatus: o.paymentStatus,
    finalAmount: parseFloat(o.finalAmount?.toString()),
    createdAt: o.createdAt
  }));

  return {
    orders: formatted,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
}

static async getAdminOrderDetails(orderId) {

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findById(orderId)
    .populate("user", "fullname email")
    .populate("items.product", "name images")
    .populate("items.seller", "shopName fullname email");

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  ////////////////////////////////////////////////////////
  // 🔄 TRANSFORM ITEMS
  ////////////////////////////////////////////////////////

  const items = order.items.map(item => {

    const trackingTimeline = (item.shipment?.trackingEvents || [])
      .sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt));

    return {
      itemId: item._id,

      product: {
        name: item.productSnapshot?.name || item.product?.name,
        image: item.productSnapshot?.image || item.product?.images?.[0]
      },

      seller: {
        name: item.seller?.shopName || item.seller?.fullname,
        email: item.seller?.email
      },

      quantity: item.quantity,
      unitPrice: parseFloat(item.unitPrice?.toString()),
      total: parseFloat(item.lineTotal?.toString()),

      fulfillmentStatus: item.fulfillmentStatus,
      returnStatus: item.returnStatus,
      refundStatus: item.refundStatus,

      shipment: item.shipment,

      trackingTimeline
    };
  });

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,

    customer: {
      name: order.user?.fullname,
      email: order.user?.email
    },

    shippingAddress: order.shippingAddress,

    payment: {
      method: order.paymentMethod,
      status: order.paymentStatus,
      transactionId: order.transactionId
    },

    pricing: {
      subtotal: parseFloat(order.subtotal?.toString()),
      discount: parseFloat(order.discount?.toString()),
      tax: parseFloat(order.tax?.toString()),
      deliveryCharge: parseFloat(order.deliveryCharge?.toString()),
      finalAmount: parseFloat(order.finalAmount?.toString())
    },

    orderStatus: order.orderStatus,

    items,

    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

static async manualOrderStatusUpdate(adminId, payload) {

  const { orderId, itemId, status, reason } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  if (!reason) {
    throw new ApiError(400, "Reason is required for manual update");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // 🎯 ITEM LEVEL UPDATE
    ////////////////////////////////////////////////////

    if (itemId) {

      if (!mongoose.Types.ObjectId.isValid(itemId)) {
        throw new ApiError(400, "Invalid item ID");
      }

      const item = order.items.id(itemId);

      if (!item) {
        throw new ApiError(404, "Item not found");
      }

      item.fulfillmentStatus = status;

    } else {

      ////////////////////////////////////////////////////
      // 📦 FULL ORDER UPDATE
      ////////////////////////////////////////////////////

      order.items.forEach(item => {
        item.fulfillmentStatus = status;
      });

      order.orderStatus = status;
    }

    ////////////////////////////////////////////////////
    // 🔄 DERIVE ORDER STATUS
    ////////////////////////////////////////////////////

    const statuses = order.items.map(i => i.fulfillmentStatus);

    if (statuses.every(s => s === "delivered")) {
      order.orderStatus = "delivered";
    } else if (statuses.some(s => s === "shipped")) {
      order.orderStatus = "shipped";
    } else if (statuses.every(s => s === "processing")) {
      order.orderStatus = "processing";
    }

    ////////////////////////////////////////////////////
    // 🧾 STATUS HISTORY (CRITICAL)
    ////////////////////////////////////////////////////

    order.statusHistory.push({
      status,
      changedBy: adminId,
      role: "admin",
      comment: reason
    });

    ////////////////////////////////////////////////////
    // SAVE
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  ////////////////////////////////////////////////////////
  // 🔔 NOTIFICATION
  ////////////////////////////////////////////////////////

  try {
    await NotificationService.emit("ORDER_STATUS_UPDATED", {
      recipient: order.user,
      recipientRole: "customer",
      category: "order",
      entityType: "Order",
      entityId: order._id,
      meta: {
        orderId: order._id,
        status,
        reason
      }
    });
  } catch {}

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    orderId: order._id,
    itemId: itemId || null,
    status
  };
}

static async approveRefund(adminId, payload) {

  const { orderId, itemId } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const item = order.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  ////////////////////////////////////////////////////////
  // 🚫 STATE CHECK
  ////////////////////////////////////////////////////////

  if (item.refundStatus !== "approved") {
    throw new ApiError(400, "Refund not approved yet");
  }

  if (order.paymentStatus !== "paid") {
    throw new ApiError(400, "Refund not applicable");
  }

  ////////////////////////////////////////////////////////
  // 🚫 IDEMPOTENCY CHECK
  ////////////////////////////////////////////////////////

  if (item.refundStatus === "processed") {
    throw new ApiError(400, "Refund already processed");
  }

  ////////////////////////////////////////////////////////
  // 💰 REFUND AMOUNT
  ////////////////////////////////////////////////////////

  const refundAmount = parseFloat(item.lineTotal?.toString());

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // 💳 DUMMY PAYMENT REFUND
    ////////////////////////////////////////////////////

    const refundResult = {
      success: true,
      refundId: "dummy_refund_" + Date.now()
    };

    if (!refundResult.success) {
      throw new ApiError(500, "Refund failed");
    }

    ////////////////////////////////////////////////////
    // UPDATE STATUS
    ////////////////////////////////////////////////////

    item.refundStatus = "processed";

    ////////////////////////////////////////////////////
    // OPTIONAL: UPDATE ORDER PAYMENT STATUS
    ////////////////////////////////////////////////////

    const allRefunded = order.items.every(
      i => i.refundStatus === "processed"
    );

    if (allRefunded) {
      order.paymentStatus = "refunded";
    }

    ////////////////////////////////////////////////////
    // UPDATE ESCALATION
    ////////////////////////////////////////////////////

    await Escalation.findOneAndUpdate(
      {
        order: order._id,
        escalationType: "refund",
        status: "open"
      },
      {
        status: "resolved",
        remarks: "Refund processed by admin"
      },
      { session }
    );

    ////////////////////////////////////////////////////
    // AUDIT HISTORY
    ////////////////////////////////////////////////////

    order.statusHistory.push({
      status: "refund_processed",
      changedBy: adminId,
      role: "admin",
      comment: `Refund of ₹${refundAmount} processed`
    });

    ////////////////////////////////////////////////////
    // SAVE
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

    ////////////////////////////////////////////////////
    // 🔔 NOTIFICATION
    ////////////////////////////////////////////////////

    try {
      await NotificationService.emit("REFUND_PROCESSED", {
        recipient: order.user,
        recipientRole: "customer",
        category: "refund",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id,
          amount: refundAmount
        }
      });
    } catch {}

    ////////////////////////////////////////////////////
    // 📤 RESPONSE
    ////////////////////////////////////////////////////

    return {
      orderId: order._id,
      itemId,
      refundAmount,
      refundId: refundResult.refundId,
      status: "processed"
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}


static async approveReturnAdmin(adminId, payload) {

  const { orderId, itemId, decision, reason } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(400, "Invalid order ID");
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    throw new ApiError(400, "Invalid item ID");
  }

  if (!["approved", "rejected"].includes(decision)) {
    throw new ApiError(400, "Invalid decision");
  }

  if (!reason) {
    throw new ApiError(400, "Reason required for admin override");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ORDER
  ////////////////////////////////////////////////////////

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const item = order.items.id(itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  ////////////////////////////////////////////////////////
  // 🚫 STATE CHECK
  ////////////////////////////////////////////////////////

  if (!["requested", "approved", "rejected"].includes(item.returnStatus)) {
    throw new ApiError(400, "Invalid return state");
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // FORCE UPDATE
    ////////////////////////////////////////////////////

    item.returnStatus = decision;

    ////////////////////////////////////////////////////
    // ESCALATION UPDATE
    ////////////////////////////////////////////////////

    await Escalation.findOneAndUpdate(
      {
        order: order._id,
        escalationType: "return"
      },
      {
        status: decision === "approved" ? "resolved" : "rejected",
        remarks: reason
      },
      { session }
    );

    ////////////////////////////////////////////////////
    // AUDIT LOG
    ////////////////////////////////////////////////////

    order.statusHistory.push({
      status: `return_${decision}`,
      changedBy: adminId,
      role: "admin",
      comment: reason
    });

    ////////////////////////////////////////////////////
    // SAVE
    ////////////////////////////////////////////////////

    await order.save({ session });

    await session.commitTransaction();

    ////////////////////////////////////////////////////
    // 🔔 NOTIFICATIONS
    ////////////////////////////////////////////////////

    try {
      await NotificationService.emit("RETURN_UPDATED_ADMIN", {
        recipient: order.user,
        recipientRole: "customer",
        category: "return",
        entityType: "Order",
        entityId: order._id,
        meta: {
          orderId: order._id,
          decision,
          reason
        }
      });
    } catch {}

    ////////////////////////////////////////////////////
    // 📤 RESPONSE
    ////////////////////////////////////////////////////

    return {
      orderId: order._id,
      itemId,
      returnStatus: item.returnStatus,
      overridden: true
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}



static async exportOrders(query) {

  let { startDate, endDate, status } = query;

  ////////////////////////////////////////////////////////
  // 🔍 FILTER
  ////////////////////////////////////////////////////////

  const filter = {};

  if (status) {
    filter.orderStatus = status.toLowerCase();
  }

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  ////////////////////////////////////////////////////////
  // 📦 FETCH DATA
  ////////////////////////////////////////////////////////

  const orders = await Order.find(filter)
    .populate("user", "fullname email")
    .populate("items.product", "name")
    .populate("items.seller", "shopName fullname")
    .lean();

  ////////////////////////////////////////////////////////
  // 🔄 FLATTEN DATA
  ////////////////////////////////////////////////////////

  const rows = [];

  orders.forEach(order => {
    order.items.forEach(item => {

      rows.push({
        orderId: order._id,
        date: order.createdAt,

        customerName: order.user?.fullname,
        customerEmail: order.user?.email,

        productName:
          item.productSnapshot?.name ||
          item.product?.name,

        sellerName:
          item.seller?.shopName ||
          item.seller?.fullname,

        quantity: item.quantity,

        unitPrice: parseFloat(item.unitPrice?.toString()),
        total: parseFloat(item.lineTotal?.toString()),

        fulfillmentStatus: item.fulfillmentStatus,
        returnStatus: item.returnStatus,
        refundStatus: item.refundStatus,

        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
      });

    });
  });

  ////////////////////////////////////////////////////////
  // 📄 CSV GENERATION
  ////////////////////////////////////////////////////////

  const parser = new Parser();
  const csv = parser.parse(rows);

  ////////////////////////////////////////////////////////
  // 📤 RETURN
  ////////////////////////////////////////////////////////

  return {
    buffer: Buffer.from(csv),
    filename: `orders-report-${Date.now()}.csv`
  };
}

static async getAuditLogs(query) {

  let {
    page = 1,
    limit = 20,
    startDate,
    endDate,
    role,
    search
  } = query;

  ////////////////////////////////////////////////////////
  // 🛡️ SANITIZE
  ////////////////////////////////////////////////////////

  page = Math.max(1, parseInt(page));
  limit = Math.min(100, Math.max(1, parseInt(limit)));

  ////////////////////////////////////////////////////////
  // 🔍 FILTER
  ////////////////////////////////////////////////////////

  const filter = {};

  if (startDate || endDate) {
    filter["statusHistory.updatedAt"] = {};
    if (startDate)
      filter["statusHistory.updatedAt"].$gte = new Date(startDate);
    if (endDate)
      filter["statusHistory.updatedAt"].$lte = new Date(endDate);
  }

  ////////////////////////////////////////////////////////
  // 📦 FETCH ORDERS
  ////////////////////////////////////////////////////////

  const orders = await Order.find(filter)
    .select("_id statusHistory user")
    .populate("user", "fullname email")
    .populate("statusHistory.changedBy", "fullname email")
    .lean();

  ////////////////////////////////////////////////////////
  // 🔄 FLATTEN LOGS
  ////////////////////////////////////////////////////////

  let logs = [];

  orders.forEach(order => {
    order.statusHistory.forEach(entry => {

      if (role && entry.role !== role) return;

      if (search && !order._id.toString().includes(search)) return;

      logs.push({
        orderId: order._id,

        action: entry.status,
        role: entry.role,
        comment: entry.comment,

        performedBy: entry.changedBy
          ? {
              name: entry.changedBy.fullname,
              email: entry.changedBy.email
            }
          : null,

        timestamp: entry.updatedAt
      });

    });
  });

  ////////////////////////////////////////////////////////
  // 📊 SORT
  ////////////////////////////////////////////////////////

  logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  ////////////////////////////////////////////////////////
  // 📄 PAGINATION
  ////////////////////////////////////////////////////////

  const total = logs.length;

  const paginated = logs.slice(
    (page - 1) * limit,
    page * limit
  );

  ////////////////////////////////////////////////////////
  // 📤 RESPONSE
  ////////////////////////////////////////////////////////

  return {
    logs: paginated,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    }
  };
}


static async handleEscalation(userId, role, payload) {

  const { escalationId, status, comment } = payload;

  ////////////////////////////////////////////////////////
  // 🛡️ VALIDATION
  ////////////////////////////////////////////////////////

  if (!mongoose.Types.ObjectId.isValid(escalationId)) {
    throw new ApiError(400, "Invalid escalation ID");
  }

  if (!["in_progress", "resolved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  if (!comment) {
    throw new ApiError(400, "Comment is required");
  }

  ////////////////////////////////////////////////////////
  // 🔍 FETCH ESCALATION
  ////////////////////////////////////////////////////////

  const escalation = await Escalation.findById(escalationId);

  if (!escalation) {
    throw new ApiError(404, "Escalation not found");
  }

  ////////////////////////////////////////////////////////
  // 🚫 ROLE CHECK
  ////////////////////////////////////////////////////////

  if (!["admin", "seller"].includes(role)) {
    throw new ApiError(403, "Unauthorized");
  }

  ////////////////////////////////////////////////////////
  // 🚫 STATE FLOW CHECK
  ////////////////////////////////////////////////////////

  const allowedTransitions = {
    open: ["in_progress", "resolved", "rejected"],
    in_progress: ["resolved", "rejected"],
    resolved: [],
    rejected: []
  };

  if (!allowedTransitions[escalation.status]?.includes(status)) {
    throw new ApiError(
      400,
      `Invalid transition from ${escalation.status} → ${status}`
    );
  }

  ////////////////////////////////////////////////////////
  // 🔒 TRANSACTION
  ////////////////////////////////////////////////////////

  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    ////////////////////////////////////////////////////
    // UPDATE ESCALATION
    ////////////////////////////////////////////////////

    escalation.status = status;
    escalation.remarks = comment;
    escalation.handledBy = userId;

    ////////////////////////////////////////////////////
    // OPTIONAL: LINKED ACTION
    ////////////////////////////////////////////////////

    if (status === "resolved") {

      if (escalation.escalationType === "return") {
        await Order.updateOne(
          {
            _id: escalation.order,
            "items._id": escalation.item
          },
          {
            $set: { "items.$.returnStatus": "approved" }
          },
          { session }
        );
      }

      if (escalation.escalationType === "refund") {
        await Order.updateOne(
          {
            _id: escalation.order,
            "items._id": escalation.item
          },
          {
            $set: { "items.$.refundStatus": "approved" }
          },
          { session }
        );
      }
    }

    ////////////////////////////////////////////////////
    // SAVE
    ////////////////////////////////////////////////////

    await escalation.save({ session });

    await session.commitTransaction();

    ////////////////////////////////////////////////////
    // 🔔 NOTIFICATION
    ////////////////////////////////////////////////////

    try {
      await NotificationService.emit("ESCALATION_UPDATED", {
        recipient: escalation.raisedBy,
        recipientRole: "customer",
        category: "support",
        entityType: "Order",
        entityId: escalation.order,
        meta: {
          escalationId,
          status,
          comment
        }
      });
    } catch {}

    ////////////////////////////////////////////////////
    // 📤 RESPONSE
    ////////////////////////////////////////////////////

    return {
      escalationId,
      status
    };

  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
}

}







export default OrderService;