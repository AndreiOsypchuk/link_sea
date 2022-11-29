import { NextFunction, Request, Response } from "express";
import { authorize } from "../util";
export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { acc } = req.cookies;
  if (!acc)
    return res
      .status(403)
      .json({ message: "Token is missing", success: false });
  const data = authorize(acc);
  if (!data)
    return res.status(403).json({ message: "Invalid token", success: false });
  req.body.id = data.data;
  return next();
};
