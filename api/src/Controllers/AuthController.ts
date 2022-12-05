import { Request, Response } from "express";
import { Controller, post, get, assure } from "./decorators";
import { BodyType, tokenize, sendResetEmail, authorize } from "./util";
import { Database, DbError } from "../Database";

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
          const token = tokenize(result._id, (e: any) => {
            if (e) res.status(400).json({ message: e.message });
          });
          if (token) {
            res.cookie("auth", token, {
              httpOnly: true,
              maxAge: 60000 * 60 * 24,
            });
            res.status(200).json({ data: result });
          }
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
        const token = tokenize(result._id, (e: any) => {
          if (e) res.status(400).json({ message: e.message });
        });
        if (token) {
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

  @post("send_reset_email")
  @assure(BodyType.REQUSET_EMAIL)
  async SendResetEmail(req: Request, res: Response) {
    try {
      await Database.GetUserId(
        req.body.email,
        (result: any, e: DbError | null) => {
          if (e) {
            res.status(400).json({ message: e.message, success: false });
          } else {
            const token = tokenize(result, (e: any) => {
              if (e) res.status(400).json({ message: e.message });
            });
            if (token) {
              sendResetEmail(req.body.email, token, (err: any, info: any) => {
                if (err) res.status(400).json(err.message);
                res.status(200).json(info);
              });
            }
          }
        }
      );
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }

  @get("reset")
  async Reset(req: Request, res: Response) {
    if (req.query.token) {
      const data = authorize(req.query.token as string, (e: any) =>
        res.status(400).json({ message: e.message })
      );
      if (data) {
        res.status(200).json({ message: data });
      }
    } else {
      res.status(400).json({ message: "No token in the params" });
    }
  }
  @post("reset_password")
  @assure(BodyType.RESET_PASS)
  async ResetPassword(req: Request, res: Response) {
    const tokenData: any = authorize(req.body.token as string, (e: any) => {
      if (e) res.status(400).json({ message: e.message });
    });
    if (tokenData) {
      await Database.ResetUserPassword(
        tokenData.data,
        req.body.password,
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
}
