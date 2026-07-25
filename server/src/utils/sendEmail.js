import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

console.log("📧 mail.js loaded");

console.log("SMTP Config:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  passExists: !!process.env.SMTP_PASS,
  passPrefix: process.env.SMTP_PASS?.substring(0, 8),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
  tls: {
    rejectUnauthorized: false,
  },
});

console.log("📨 Transporter created");

(async () => {
  try {
    console.log("🔍 Verifying SMTP...");
    await transporter.verify();
    console.log("✅ SMTP Server Ready");
  } catch (err) {
    console.error("❌ SMTP Verify Error:");
    console.error(err);
  }
})();

const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new ApiError(400, "Recipient email is required");
  }

  try {
    const info = await transporter.sendMail({
      from: `"SmartCart" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    return info;
  } catch (err) {
    console.error("❌ sendMail Error:");
    console.error(err);

    throw new ApiError(500, `Email sending failed: ${err.message}`);
  }
};

export const sendEmailWithHTML = async ({ to, subject, html }) =>
  sendEmail(to, subject, html);

export default sendEmail;