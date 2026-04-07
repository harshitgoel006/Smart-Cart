// This module defines the NotificationService class, which provides methods for emitting notifications, retrieving user notifications with pagination and filtering options, and marking notifications as read. It interacts with the Notification model to perform database operations and uses the NotificationDispatcher to emit events to the appropriate channels.

import NotificationDispatcher from "./notification.dispatcher.js";
import { Notification } from "../../models/notification.model.js";
import { ApiError } from "../../utils/ApiError.js";

// The NotificationService class provides static methods for managing notifications. The 'emit' method is used to create and dispatch a new notification based on an event and payload. The 'getUserNotifications' method retrieves notifications for a specific user with support for pagination and filtering by read status. The 'markAsRead' method allows marking a single notification as read, while the 'markAllAsRead' method marks all notifications for a user as read. These methods interact with the Notification model to perform the necessary database operations and ensure that notifications are handled efficiently throughout the application.
class NotificationService {
  static async emit(event, payload) {
    return NotificationDispatcher.dispatch(event, payload);
  }

  // This method retrieves notifications for a specific user based on their ID and role. It supports pagination through 'page' and 'limit' parameters, and can filter notifications to return only unread ones if the 'onlyUnread' flag is set to true. The method constructs a query filter based on the provided parameters, executes the query to fetch the notifications from the database, and returns the results along with pagination metadata.
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

  // This method marks a single notification as read for a specific user. It takes the user's ID and the notification ID as parameters, finds the corresponding notification in the database, and updates its 'isRead' status to true along with setting the 'readAt' timestamp. If the notification is not found, it throws a 404 error. Finally, it returns the updated notification document.
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

  // This method marks all notifications as read for a specific user. It takes the user's ID and role as parameters, updates all notifications that match the recipient and role criteria to set 'isRead' to true and updates the 'readAt' timestamp. It returns the count of modified notifications, indicating how many notifications were marked as read.
  static async markAllAsRead(userId, role) {
    const result = await Notification.updateMany(
      { recipient: userId, recipientRole: role, isRead: false },
      { $set: { isRead: true, readAt: new Date() } },
    );

    return result.modifiedCount;
  }
}

export default NotificationService;
