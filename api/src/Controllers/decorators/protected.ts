import { NextFunction, Request, Response } from "express";
import { TokenStore } from "../../Redis";
import { authorize } from "../util";
import jwt from "jsonwebtoken";

export const protect = (proto: any, key: string, _desc: PropertyDescriptor) => {
  // if only refresh token is present we are going to attempt to issue a new access token
  // and
  const checkForToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const acc = req.cookies.acc;
      if (acc) {
        const { data }: any = authorize(acc, (e: any) => {
          res.status(403).json({ message: e.message, success: false });
        });
        req.body.id = data;
        return next();
      } else {
        return res.status(403).json({
          message: "Not allowed without a token bitch",
          success: false,
        });
      }
    } catch (e: any) {
      return res.status(500).json({ message: e.message, success: false });
    }
  };

  const mids = Reflect.getMetadata("middlewares", proto, key) || [];
  mids.push(checkForToken);
  Reflect.defineMetadata("middlewares", mids, proto, key);
};
