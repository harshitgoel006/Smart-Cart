import {Notification} from '../models/notification.model.js';
import sendEmail from './sendEmail.js';
import {emailTemplates} from './notificationEmailTemplates.js';





const createAndSendNotification = async (notificationData) => {
  const {
    recipientId,
    recipientRole,
    recipientEmail,
    type,
    title,
    message,
    relatedEntity = { entityType: "none" },
    channels = ["in-app"],
    meta = {},
  } = notificationData;


  const notification = await Notification.create({
    recipientId,
    recipientRole,
    type,
    title,
    message,
    relatedEntity,
    channels: channels.map((ch) => ({ type: ch, sent: false })),
    meta,
  });

  for (const channel of channels) {
    try {
      if (channel === "in-app") {
        await Notification.findByIdAndUpdate(
          notification._id,
          {
            $set: {
              "channels.$[elem].sent": true,
              "channels.$[elem].sentAt": new Date(),
            },
          },
          { arrayFilters: [{ "elem.type": "in-app" }] }
        );
      }

      if (channel === "email" && recipientEmail) {
        await sendEmailViaTemplate(notification, recipientEmail);
      }
    } catch (err) {
      console.error("Notification channel error:", channel, err);
    }
  }

  return notification;
};

const sendEmailViaTemplate = async (notification, toEmail) => {
  const tmpl = emailTemplates[notification.type] || emailTemplates.DEFAULT;
  const meta = notification.meta || {};

  const subject =
    typeof tmpl.subject === "function" ? tmpl.subject(meta) : tmpl.subject;
  const html = tmpl.html(meta);

  await sendEmail(toEmail, subject, html);

  await Notification.findByIdAndUpdate(
    notification._id,
    {
      $set: {
        "channels.$[elem].sent": true,
        "channels.$[elem].sentAt": new Date(),
      },
    },
    { arrayFilters: [{ "elem.type": "email" }] }
  );
};

export default createAndSendNotification;
