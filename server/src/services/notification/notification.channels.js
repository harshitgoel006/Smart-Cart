// services/notification/notification.channels.js

import sendEmail from "../../utils/sendEmail.js";

class ChannelManager {

  static async process({ event, notification, email, emailSubject, emailHTML }) {

    // In-app is always created via DB

    if (email) {
      await sendEmail(email, emailSubject, emailHTML);
    }

    // Future:
    // await PushService.send(...)
    // await SMSService.send(...)
  }

}

export default ChannelManager;