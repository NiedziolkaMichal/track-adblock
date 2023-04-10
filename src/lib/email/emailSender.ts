import nodemailer from "nodemailer";

export function sendEmail(receiver: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: false,
    from: process.env.EMAIL_FROM,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  return transporter.sendMail({
    from: `"Track Adblock" <${process.env.EMAIL_FROM}>`,
    to: receiver,
    subject: subject,
    html: html,
  });
}
