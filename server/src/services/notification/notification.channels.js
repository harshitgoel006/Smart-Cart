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
      await sendEmail(email, emailSubject, emailHTML);
    }
  }
}

export default ChannelManager;
