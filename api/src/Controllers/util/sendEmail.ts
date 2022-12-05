import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
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
    <a href='http://localhost:4000/api/auth/reset?token=${token}'>reset password</a>
    `,
  };
  transporter.sendMail(
    mailOptions,
    (err: any, info: SMTPTransport.SentMessageInfo) => {
      cb(err, info);
    }
  );
};
