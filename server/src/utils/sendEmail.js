import { ApiError } from "./ApiError.js";

const sendEmail = async (to, subject, html) => {
  if (!to) {
    throw new ApiError(400, "Recipient email is required");
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "SmartCart",
          email: "smartcart025@gmail.com",
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