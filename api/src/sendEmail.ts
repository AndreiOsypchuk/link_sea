import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import dotenv from "dotenv";
dotenv.config();
const user = process.env.EMAIL_HOST;
const pass = process.env.EMAIL_PASS;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user,
    pass,
  },
});

type EmailCallback = (err: any, info: SMTPTransport.SentMessageInfo) => void;
export const sendEmail = (
  to: string,
  subject: string,
  text: string,
  cb: EmailCallback
) => {
  const mailOptions = {
    from: `ShyerSoft <no-reply.${user}>`,
    replyTo: `noreply.${user}`,
    to,
    subject,
    text,
  };
  transporter.sendMail(
    mailOptions,
    (err: any, info: SMTPTransport.SentMessageInfo) => {
      cb(err, info);
    }
  );
};

export const sendResetEmail = (
  to: string,
  token: string,
  cb: EmailCallback
) => {
  const mailOptions = {
    from: `ShyerSoft <no-reply.${user}>`,
    replyTo: `noreply.${user}`,
    to,
    subject: "Password reset",
    html: `
    <h1>Hello</h1>
    <p>Click here to reset your password</p>
    <a href='${process.env.HOST_URL}/reset_passord?token=${token}'>reset password</a>
    `,
  };
  transporter.sendMail(
    mailOptions,
    (err: any, info: SMTPTransport.SentMessageInfo) => {
      cb(err, info);
    }
  );
};
