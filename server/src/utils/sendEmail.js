// import nodemailer from 'nodemailer';

// const sendEmail = async (to, subject, html) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST || "smtp.gmail.com",
//         port: 587,
//         secure: false, // TLS
//         auth: {
//             user: process.env.SMTP_USER,
//             pass: process.env.SMTP_PASS
//         }
//     });

//     const mailOptions = {
//         from: `"SmartCart" <${process.env.SMTP_USER}>`,
//         to,
//         subject,
//         html
//     };

//     await transporter.sendMail(mailOptions);
// };

// export default sendEmail;



import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ✅ OLD FUNCTION - Backwards compatible (used for OTP, notifications, etc.)
const sendEmail = async (to, subject, html) => {
  try {
    console.log("📧 Sending email to:", to);

    const mailOptions = {
      from: `"SmartCart" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully");
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

// ✅ NEW FUNCTION - Invoice email (object destructuring)
export const sendEmailWithHTML = async ({ to, subject, html }) => {
  return sendEmail(to, subject, html);
};

export default sendEmail;
