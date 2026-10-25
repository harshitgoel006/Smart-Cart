import NotificationDispatcher from "./notification.dispatcher.js";
import { Notification } from "../../models/notification.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { Product } from "../../models/product.model.js";
import { Order } from "../../models/order.model.js";

class NotificationService {
  static async emit(event, payload) {
    return NotificationDispatcher.dispatch(event, payload);
  }

  static async getUserNotifications(
    userId,
    role,
    { page = 1, limit = 20, onlyUnread = false },
  ) {
    const filter = { recipient: userId, recipientRole: role };

    if (onlyUnread) filter.isRead = false;

    const p = Number(page);
    const l = Number(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l),
      Notification.countDocuments(filter),
    ]);

    return {
      notifications,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages: Math.ceil(total / l),
      },
    };
  }

  static async markAsRead(userId, notificationId) {
    const notif = await Notification.findOne({
      _id: notificationId,
      recipient: userId,
    });

    if (!notif) throw new ApiError(404, "Notification not found");

    notif.isRead = true;
    notif.readAt = new Date();
    await notif.save();

    return notif;
  }

  static async markAllAsRead(userId, role) {
    const result = await Notification.updateMany(
      { recipient: userId, recipientRole: role, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return result.modifiedCount;
  }

  static async getSellerAlerts(sellerId) {
    const [lowStock, pendingProducts, orderItems] = await Promise.all([
      Product.find({ seller: sellerId, isDeleted: false, isActive: true, stock: { $lte: 5 } })
        .select("name stock")
        .sort({ stock: 1 })
        .limit(10)
        .lean(),
      Product.find({ seller: sellerId, isDeleted: false, approvalStatus: "pending" })
        .select("name createdAt")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
      Order.find({ "items.seller": sellerId, isDeleted: false })
        .select("_id items createdAt")
        .sort({ createdAt: -1 })
        .limit(30)
        .lean(),
    ]);

    const pendingOrders = orderItems.flatMap((order) => order.items
      .filter((item) => String(item.seller) === String(sellerId) && ["pending", "processing"].includes(item.fulfillmentStatus))
      .map((item) => ({ orderId: order._id, itemId: item._id, status: item.fulfillmentStatus, quantity: item.quantity, createdAt: order.createdAt }))
    ).slice(0, 10);

    return {
      lowStock,
      pendingProducts,
      pendingOrders,
      counts: { lowStock: lowStock.length, pendingProducts: pendingProducts.length, pendingOrders: pendingOrders.length },
    };
  }
}

export default NotificationService;
