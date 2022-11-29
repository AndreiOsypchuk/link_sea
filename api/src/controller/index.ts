import { Request, Response } from "express";
import { get, Controller, post, assure, use } from "./decorators";
import BodyType from "./util/bodies";
import { Database } from "../db";
import { Callback, CallbackError } from "mongoose";
import { tokenize } from "./util";
import { protectedRoute } from "./middleware";

//===============================================================================================
//=========================================AUTH==================================================
//===============================================================================================
@Controller("/auth")
class AuthController {
  //====================================REGISTER
  @post("/register")
  @assure(BodyType.Register)
  async Register(req: Request, res: Response) {
    try {
      await Database.CreateUser(
        req.body,
        async (e: CallbackError, newUserInfo) => {
          if (e)
            return res.status(400).json({ message: e.message, success: false });
          const token = tokenize(newUserInfo._id);
          await Database.CreateLinkList(
            newUserInfo._id,
            (er: CallbackError, newList) => {
              if (er) {
                return res
                  .status(400)
                  .json({ message: er.message, success: false });
              }
              res.cookie("acc", token, {
                httpOnly: true,
                maxAge: 60000 * 60 * 24,
              });
              res.status(200).json({
                data: { ...newUserInfo, links: newList.links },
                success: true,
              });
            }
          );
        }
      );
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }
  //======================================LOGIN
  @post("/login")
  @assure(BodyType.Login)
  async Login(req: Request, res: Response) {
    try {
      Database.GetUser(req.body.email, (e: CallbackError, userInfo) => {
        if (e)
          return res.status(400).json({ message: e.message, success: false });
        const token = tokenize(userInfo._id);

        res.cookie("acc", token, { httpOnly: true, maxAge: 60000 * 60 * 24 });
        res.status(200).json({ data: userInfo, success: true });
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }
  //======================================LOGOUT
  @get("/logout")
  async Logout(_req: Request, res: Response) {
    res.clearCookie("acc");
    res.end();
  }

  @get("/list")
  @use(protectedRoute)
  async List(req: Request, res: Response) {
    try {
      await Database.ListUsers(async (e: any, result: any) => {
        if (e) {
          return res.status(500).json({ message: e.message, success: false });
        }
        res.status(200).json(result);
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }
}
//===============================================================================================
//=========================================AUTH==================================================
//===============================================================================================
@Controller("/links")
class LinksController {
  @get("/create")
  @use(protectedRoute)
  async Create(req: Request, res: Response) {
    try {
      await Database.ListUsers(async (e: any, result: any) => {
        if (e) {
          return res.status(500).json({ message: e.message, success: false });
        }
        res.status(200).json(result);
      });
    } catch (e: any) {
      res.status(500).json({ message: e.message, success: false });
    }
  }
}
