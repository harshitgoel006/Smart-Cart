
import mongoose from "mongoose";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Cart } from "../models/cart.model.js";
import { Coupon } from "../models/coupon.model.js";
import NotificationService from "../services/notification/notification.service.js";
import { ApiError } from "../utils/ApiError.js";

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

}

export default OrderService;