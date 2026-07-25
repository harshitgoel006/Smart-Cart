import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => console.log("SMTP Server ready"))
    .catch((err) => console.error("SMTP Config Error:", err.message));
}

const sendEmail = async (to, subject, html) => {
  if (!to) throw new ApiError(400, "Recipient email is required");

  try {
    return await transporter.sendMail({
      from: `"SmartCart" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
  } catch (error) {
    throw new ApiError(500, `Email sending failed: ${error.message}`);
  }
};

export const sendEmailWithHTML = async ({ to, subject, html }) =>
  sendEmail(to, subject, html);

export default sendEmail;
