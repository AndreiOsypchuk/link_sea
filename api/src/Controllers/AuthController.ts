import { Request, Response } from "express";
import { Controller, post, assure } from "./decorators";
import { BodyType, tokenize } from "./util";
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
}
// spe lasdffk programming here comment and stuff to do
