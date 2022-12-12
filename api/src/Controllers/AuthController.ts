import { Request, Response } from "express";
import { Controller, post, get, assure } from "./decorators";
import jwt from "jsonwebtoken";
import {
  BodyType,
  CookieName,
  tokenize,
  createTokenPair,
  cookieParams,
  sendResetEmail,
  authorize,
  verifyRefresh,
} from "./util";
import { Database, DbError } from "../Database";
import { TokenStore } from "../Redis";

// Register Login Logout ResetPassword RequestPasswordResetEmail SendResetEmail storeRefreshTokensInRedis

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
          const { ref, acc } = createTokenPair(result._id) || {
            ref: null,
            acc: null,
          };

          if (ref && acc) {
            TokenStore.StoreToken(result._id, ref);
            res.cookie(CookieName.ACC, acc, cookieParams(CookieName.ACC));
            res.cookie(CookieName.REF, ref, cookieParams(CookieName.REF));
            res.status(200).json({ data: result });
          } else {
            throw new Error("Token pair did not generate properly");
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
        const { ref, acc } = createTokenPair(result._id) || {
          ref: null,
          acc: null,
        };

        if (ref && acc) {
          TokenStore.StoreToken(result._id, ref);
          res.cookie(CookieName.ACC, acc, cookieParams(CookieName.ACC));
          res.cookie(CookieName.REF, ref, cookieParams(CookieName.REF));
          res.status(200).json({ data: result });
        } else {
          throw new Error("Token pair did not generate properly");
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
              sendResetEmail(req.body.email, token, (err: any, _info: any) => {
                if (err) res.status(400).json(err.message);
                res
                  .status(200)
                  .json({ message: "Email has been sent", success: true });
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
  @post("logout")
  async Logout(req: Request, res: Response) {
    try {
      const { ref }: any = req.cookies;
      // TODO: make it a separate function something like verifyRefresh
      if (ref) {
        const data: any = verifyRefresh(ref);
        await TokenStore.ClearTokens(data);
      }
      res.clearCookie(CookieName.ACC);
      res.clearCookie(CookieName.REF);
      res.end();
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }

  @get("refresh")
  async Refresh(req: Request, res: Response) {
    try {
      const { ref } = req.cookies;
      console.log(ref);
      if (ref) {
        const data: any = verifyRefresh(ref);
        const exists = await TokenStore.Check(data, ref);
        if (exists) {
          const { acc }: any = createTokenPair(data);
          res.cookie(CookieName.ACC, acc, cookieParams(CookieName.ACC));
          res.end();
        } else {
          res.status(403).json({ message: "Refresh token is invalid" });
        }
      } else {
        res.status(403).json({ message: "No refresh token", success: false });
      }
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }
}
