// services/notification/notification.service.js

import NotificationDispatcher from "./notification.dispatcher.js";
import { Notification } from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";

class NotificationService {

  static async emit(event, payload) {
    return NotificationDispatcher.dispatch(event, payload);
  }

  static async getUserNotifications(userId, role, { page = 1, limit = 20, onlyUnread = false }) {

    const filter = { recipient: userId, recipientRole: role };

    if (onlyUnread) filter.isRead = false;

    const p = Number(page);
    const l = Number(limit);

    const [notifications, total] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip((p - 1) * l)
        .limit(l),
      Notification.countDocuments(filter)
    ]);

    return {
      notifications,
      pagination: {
        page: p,
        limit: l,
        total,
        totalPages: Math.ceil(total / l)
      }
    };
  }

  static async markAsRead(userId, notificationId) {
    const notif = await Notification.findOne({
      _id: notificationId,
      recipient: userId
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
      { $set: { isRead: true, readAt: new Date() } }
    );

    return result.modifiedCount;
  }

}

export default NotificationService;