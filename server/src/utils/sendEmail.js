// This module defines the sendEmail function, which is responsible for sending emails using the nodemailer library. It sets up a transporter with SMTP configuration from environment variables and provides a function to send emails with specified recipient, subject, and HTML content. The module also includes error handling to ensure that any issues during email sending are properly reported through an ApiError. Additionally, it verifies the transporter configuration at startup in non-production environments to catch any potential issues early on.

import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

// Configure the nodemailer transporter using SMTP settings from environment variables. It supports custom host and port, with defaults for Gmail's SMTP server. TLS is configured to allow self-signed certificates, which can be useful in development environments.
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

// In non-production environments, verify the transporter configuration at startup to ensure that the SMTP server is reachable and the credentials are correct. This helps to catch configuration issues early on before attempting to send emails.
if (process.env.NODE_ENV !== "production") {
  transporter
    .verify()
    .then(() => console.log("SMTP Server ready"))
    .catch((err) => console.error("SMTP Config Error:", err.message));
}

// The sendEmail function takes the recipient's email address, subject, and HTML content as parameters. It uses the configured transporter to send the email and returns the result. If the recipient email is not provided or if there is an error during sending, it throws an ApiError with an appropriate message and status code.
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
