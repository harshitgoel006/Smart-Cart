import { Notification } from "../../models/notification.model.js";
import ChannelManager from "./notification.channels.js";
import TemplateResolver from "./notification.templates.js";

class NotificationDispatcher {
  static async dispatch(event, payload) {
    const {
      recipient,
      recipientRole,
      relatedEntity = {},
      category = "system",
      priority = "medium",
      meta = {},
    } = payload;

    const { entityType = null, entityId = null } = relatedEntity;

    const { title, message, emailSubject, emailHTML } =
      TemplateResolver.resolve(event, meta);

    const notification = await Notification.create({
      recipient,
      recipientRole,
      category,
      event,
      title,
      message,
      relatedEntity: { entityType, entityId },
      priority,
      meta,
    });

    await ChannelManager.process({
      event,
      notification,
      email: payload.email || null,
      emailSubject,
      emailHTML,
    });

    return notification;
  }
}

export default NotificationDispatcher;
