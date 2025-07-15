import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: 587,
        secure: false, // TLS
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    const mailOptions = {
        from: `"SmartCart" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html
    };

    await transporter.sendMail(mailOptions);
};

export default sendEmail;
