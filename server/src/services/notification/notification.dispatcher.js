// services/notification/notification.dispatcher.js

import { Notification } from "../../models/notification.model.js";
import ChannelManager from "./notification.channels.js";
import TemplateResolver from "./notification.templates.js";

class NotificationDispatcher {

  static async dispatch(event, payload) {

    const {
      recipient,
      recipientRole,
      entityType = null,
      entityId = null,
      category = "system",
      priority = "medium",
      meta = {}
    } = payload;

    // 1️⃣ Resolve template
    const { title, message, emailSubject, emailHTML } =
      TemplateResolver.resolve(event, meta);

    // 2️⃣ Create DB notification
    const notification = await Notification.create({
      recipient,
      recipientRole,
      category,
      event,
      title,
      message,
      relatedEntity: { entityType, entityId },
      priority,
      meta
    });

    // 3️⃣ Dispatch channels
    await ChannelManager.process({
      event,
      notification,
      email: payload.email || null,
      emailSubject,
      emailHTML
    });

    return notification;
  }

}

export default NotificationDispatcher;