// This module defines the NotificationDispatcher class, which is responsible for handling the entire lifecycle of a notification. It resolves the appropriate template based on the event, creates a notification record in the database, and dispatches it through various channels such as email. The dispatcher serves as a central point for managing notifications, ensuring that they are processed consistently and efficiently across the application.

import { Notification } from "../../models/notification.model.js";
import ChannelManager from "./notification.channels.js";
import TemplateResolver from "./notification.templates.js";

// The NotificationDispatcher class provides a static method 'dispatch' that takes an event and a payload containing all necessary information for creating and sending a notification. It first resolves the notification template to generate the title, message, and email content. Then, it creates a notification record in the database with all relevant details. Finally, it uses the ChannelManager to send the notification through the specified channels, such as email.
class NotificationDispatcher {
  static async dispatch(event, payload) {
    const {
      recipient,
      recipientRole,
      entityType = null,
      entityId = null,
      category = "system",
      priority = "medium",
      meta = {},
    } = payload;

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

    //
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
