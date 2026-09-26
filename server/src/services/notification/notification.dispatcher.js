import { Notification } from "../../models/notification.model.js";
import { User } from "../../models/user.model.js";
import ChannelManager from "./notification.channels.js";
import TemplateResolver from "./notification.templates.js";

class NotificationDispatcher {
  static async dispatch(event, payload) {
    const {
      recipient: payloadRecipient,
      recipientId,
      recipientRole,
      email,
      relatedEntity: suppliedRelatedEntity = {},
      category = "system",
      priority = "medium",
      meta = {},
    } = payload;

    const recipient = payloadRecipient || recipientId || null;
    const entityType = suppliedRelatedEntity.entityType || payload.entityType || null;
    const normalizedEntityType = entityType
      ? entityType.charAt(0).toUpperCase() + entityType.slice(1)
      : null;
    const relatedEntity = {
      entityType: normalizedEntityType,
      entityId: suppliedRelatedEntity.entityId || payload.entityId || null,
    };

    const { entityId = null } = relatedEntity;

    const { title, message, emailSubject, emailHTML } =
      TemplateResolver.resolve(event, meta);

    const recipients = recipient
      ? [{ _id: recipient, email }]
      : await User.find({ role: recipientRole, isActive: true }).select("email").lean();

    if (!recipients.length) {
      throw new Error(`No active recipient found for notification event ${event}`);
    }

    const notifications = [];
    for (const target of recipients) {
      const notification = await Notification.create({
        recipient: target._id,
        recipientRole,
        category,
        event,
        title,
        message,
        relatedEntity: { entityType, entityId },
        priority,
        meta,
      });

      const recipientUser = !target.email
        ? await User.findById(target._id).select("email").lean()
        : null;
      await ChannelManager.process({
        event,
        notification,
        email: target.email || recipientUser?.email || null,
        emailSubject,
        emailHTML,
      });
      notifications.push(notification);
    }

    return notifications.length === 1 ? notifications[0] : notifications;
  }
}

export default NotificationDispatcher;
