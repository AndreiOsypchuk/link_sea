import { Request, Response } from "express";
import { Controller, get } from "./decorators";
import { protect } from "./decorators/protected";
import { CookieName, cookieParams, createTokenPair } from "./util";

@Controller("links")
class ApiController {
  @get("")
  @protect
  async GetLinks(req: Request, res: Response) {
    const { acc }: any = createTokenPair(req.body.id);
    res.cookie(CookieName.ACC, acc, cookieParams(CookieName.ACC));
    res.json({ message: req.body, success: true });
  }
}
