// create transport for sending emails
import nodemailer from "nodemailer";
import { env } from "../config/env.js";


const transporter = nodemailer.createTransport({
  
  host:env.email.host,
  port: Number(env.email.port), // env vars are strings
  secure: false,
  //! true for 465, false for other ports
  family: 4,
  requireTLS: true, // refuse to send without TLS
  auth: {
    user: env.email.user,
    pass: env.email.pass,
  },
});
export async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: `"NGL-APP" <${env.email.user}>`,
    to,
    subject,
    html,
  };
  return await transporter.sendMail(mailOptions);
}
