import sendEmail from "../../utils/sendEmail.js";

class ChannelManager {
  static async process({
    event,
    notification,
    email,
    emailSubject,
    emailHTML,
  }) {

    if (email) {
      try {
        await sendEmail(email, emailSubject, emailHTML);
      } catch (error) {
        // In-app notification delivery must not fail an order/status operation
        // just because the optional email provider is unavailable.
        console.warn("Notification email delivery skipped:", error?.message || "email provider unavailable");
      }
    }
  }
}

export default ChannelManager;
