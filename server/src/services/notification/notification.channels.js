// This module defines the ChannelManager class responsible for processing notifications through various channels such as email, push notifications, and SMS. Currently, it implements email sending functionality using a utility function, with placeholders for future integration of push and SMS services.
import sendEmail from "../../utils/sendEmail.js";

// The ChannelManager class provides a static method 'process' that takes an object containing the event, notification details, email address, email subject, and email HTML content. It sends an email if the email address is provided and can be extended in the future to include push notifications and SMS sending capabilities.
class ChannelManager {
  static async process({
    event,
    notification,
    email,
    emailSubject,
    emailHTML,
  }) {
    // In-app is always created via DBx, so no need to handle it here

    if (email) {
      await sendEmail(email, emailSubject, emailHTML);
    }
  }
}

export default ChannelManager;
