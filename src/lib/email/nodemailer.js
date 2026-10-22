// create transport for sending emails
import { config } from "dotenv";
import nodemailer from "nodemailer";
config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT), // env vars are strings
  secure: false,
  //! true for 465, false for other ports
  family: 4,
  requireTLS: true, // refuse to send without TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"NGL-APP" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };
  return await transporter.sendMail(mailOptions);
}
