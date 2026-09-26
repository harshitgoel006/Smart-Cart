import { ApiError } from "./ApiError.js";
import nodemailer from "nodemailer";

const maskEmail = (email = "") => {
  const [name, domain] = email.split("@");
  if (!domain) return "[invalid-email]";
  return `${name.slice(0, 2)}***@${domain}`;
};

const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new ApiError(400, "Recipient email is required");
  }

  try {
    if (!process.env.BREVO_API_KEY && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const port = Number(process.env.SMTP_PORT || 587);
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: process.env.SMTP_SECURE === "true" || port === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const result = await transporter.sendMail({
        from: `SmartCart <${process.env.SMTP_FROM_EMAIL || "smartcart025@gmail.com"}>`,
        to,
        subject,
        html,
      });

      console.log("Email accepted by SMTP provider:", {
        to: maskEmail(to),
        subject,
        messageId: result.messageId,
        accepted: result.accepted,
        rejected: result.rejected,
      });
      return result;
    }

    if (!process.env.BREVO_API_KEY) {
      throw new ApiError(500, "Email provider is not configured");
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM_EMAIL || "smartcart025@gmail.com";
    const senderName = process.env.BREVO_SENDER_NAME || "SmartCart";

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    console.log("Brevo Response:", data);

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data.message || JSON.stringify(data)
      );
    }

    console.log("✅ Email Sent:", data.messageId);

    return data;
  } catch (err) {
    console.error("❌ Brevo Error:", err);

    throw new ApiError(
      500,
      err.message || "Email sending failed"
    );
  }
};

export const sendEmailWithHTML = async ({ to, subject, html }) =>
  sendEmail(to, subject, html);

export default sendEmail;
