const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465, // 587 or 465 for SSL
      secure: true,
      service: "gmail", // Others: Outlook, yahoos
      auth: {
        user: process.env.SUPER_ADMIN_USER, // mianhamid@gmail.com
        pass: process.env.SUPER_ADMIN_PASS, // "google app password"
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
      from: `"Islamipic" <${process.env.SUPER_ADMIN_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;