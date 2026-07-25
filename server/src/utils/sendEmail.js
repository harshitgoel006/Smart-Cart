import * as brevo from "@getbrevo/brevo";
import { ApiError } from "./ApiError.js";

console.log("📧 Brevo mail.js loaded");

const apiInstance = new brevo.TransactionalEmailsApi();

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new ApiError(400, "Recipient email is required");
  }

  try {
    const email = new brevo.SendSmtpEmail();

    email.sender = {
      name: "SmartCart",
      email: "smartcart025@gmail.com",
    };

    email.to = [
      {
        email: to,
      },
    ];

    email.subject = subject;
    email.htmlContent = html;

    await apiInstance.sendTransacEmail(email);

    console.log(`✅ Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Brevo Error:", err);

    throw new ApiError(
      500,
      err?.response?.text || err?.message || "Email sending failed"
    );
  }
};

export const sendEmailWithHTML = async ({ to, subject, html }) =>
  sendEmail(to, subject, html);

export default sendEmail;