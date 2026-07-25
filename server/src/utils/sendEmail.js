import Brevo from "@getbrevo/brevo";
import { ApiError } from "./ApiError.js";

console.log("📧 Brevo mail.js loaded");

const apiInstance = new Brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new ApiError(400, "Recipient email is required");
  }

  try {
    const email = {
      sender: {
        name: "SmartCart",
        email: "smartcart025@gmail.com",
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    };

    await apiInstance.sendTransacEmail(email);

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Brevo Error:", error);

    throw new ApiError(
      500,
      error?.response?.text || error?.message || "Email sending failed"
    );
  }
};

export const sendEmailWithHTML = async ({ to, subject, html }) =>
  sendEmail(to, subject, html);

export default sendEmail;