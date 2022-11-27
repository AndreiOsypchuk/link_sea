import "reflect-metadata";
import { Request, Response } from "express";
import { get, Controller, post, assure } from "./decorators";
import { User } from "../db/user.schema";
import BodyType from "./util/bodies";

@Controller("/api")
class ApplicationController {
  @post("/register")
  @assure(BodyType.Register)
  async Register(req: Request, res: Response) {
    res.json("hello this is kinda worksing");
  }
  @post("/login")
  @assure(BodyType.Login)
  async Login(req: Request, res: Response) {
    return res.json("asdf");
  }
  @post("/logout")
  async Logout(req: Request, res: Response) {
    try {
      const newUser = new User(req.body);
      newUser.save();
      res.json(newUser);
    } catch (e) {
      res.status(500).json(e);
    }
  }
}
