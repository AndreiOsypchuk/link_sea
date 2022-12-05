import { Request, Response } from "express";
import { Controller, post, get, assure } from "./decorators";
import {
  BodyType,
  tokenize,
  sendEmail,
  sendResetEmail,
  authorize,
} from "./util";
import { Database, DbError } from "../Database";

// import nodemailer from "nodemailer";
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: "shyersoft@gmail.com",
//     pass: "hjcagbzvafdlncrx",
//   },
// });
// const sendEmail = (to: string, subject: string, text: string) => {
//   const mailOptions = {
//     from: "shyersoft@gmail.com",
//     to,
//     subject,
//     text,
//   };

//   transporter.sendMail(mailOptions, (err: any, info: any) => {
//     if (err) console.log(err);
//     else console.log("Email sent:", info.response);
//   });
// };

@Controller("auth")
class AuthController {
  //
  @post("register")
  @assure(BodyType.REGISTER)
  async Register(req: Request, res: Response) {
    try {
      await Database.CreateUser(req.body, (result: any, e: DbError | null) => {
        //
        if (e) {
          res.status(e.status).json({ message: e.message, success: false });
          return;
        } else {
          const token = tokenize(result._id);
          res.cookie("auth", token, {
            httpOnly: true,
            maxAge: 60000 * 60 * 24,
          });
          res.status(200).json({ data: result });
        }
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }

  @post("login")
  @assure(BodyType.LOGIN)
  async Login(req: Request, res: Response) {
    try {
      await Database.LoginUser(req.body, (result: any, e: DbError | null) => {
        if (e) return res.status(e.status).json({ message: e.message });
        const token = tokenize(result._id);
        res.cookie("auth", token, {
          httpOnly: true,
          maxAge: 60000 * 60 * 24,
        });
        res.status(200).json({ data: result });
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }

  @post("email")
  async SendEmail(req: Request, res: Response) {
    try {
      sendEmail(
        req.body.email,
        "Password reset",
        "<button>cliuck</button>Hello, we would like you to know that your password is reset now so yeah",
        (err: any, info: any) => {
          if (err)
            res.status(400).json({ message: err.message, success: false });
          else res.status(200).json(info);
        }
      );
    } catch (e: any) {
      res.status(500).json(e.message);
    }
  }
  @post("send_reset_email")
  async SendResetEmail(req: Request, res: Response) {
    try {
      await Database.GetUserId(
        req.body.email,
        (result: any, e: DbError | null) => {
          if (e) {
            res.status(400).json({ message: e.message, success: false });
          } else {
            const token = tokenize(result);
            sendResetEmail(req.body.email, token, (err: any, info: any) => {
              if (err) res.status(400).json(err.message);
              res.status(200).json(info);
            });
          }
        }
      );
    } catch (e: any) {}
  }

  @get("reset")
  async Reset(req: Request, res: Response) {
    if (req.query.token) {
      const data = authorize(req.query.token as string);
      res.status(200).json({ message: data });
    }
  }
  @post("reset_password")
  async ResetPassword(req: Request, res: Response) {
    const tokenData: any = authorize(req.body.token as string);
    await Database.ResetUserPassword(
      tokenData.data,
      req.body.newPass,
      (result: any, e: DbError | null) => {
        if (e) {
          res.status(e.status).json({ message: e.message, success: false });
        } else {
          res.status(200).json(result);
        }
      }
    );
  }
}
// spe lasdffk programming here comment and stuff to do
