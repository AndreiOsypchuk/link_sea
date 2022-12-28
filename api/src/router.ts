import express, { NextFunction, Request, Response } from "express";
import { User } from "./schemas";
import {
  checkIfInRedis,
  clearTokensInRedis,
  storeTokenInRedis,
} from "./redis_connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "./sendEmail";

export const authRouter = express.Router();
const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
  } catch (e: any) {
    throw e;
  }
};

const genTokenPair = (userId: object) => {
  try {
    if (!process.env.ACC_SEC) throw new Error("No Access secret");
    const acc_token = jwt.sign(userId, process.env.ACC_SEC, {
      expiresIn: "15m",
      issuer: "shyer_inc",
    });
    if (!process.env.REF_SEC) throw new Error("No Refresh secret");
    const ref_token = jwt.sign(userId, process.env.REF_SEC, {
      expiresIn: "1d",
      issuer: "shyer_inc",
    });
    return { acc_token, ref_token };
  } catch (e: any) {
    throw e;
  }
};

authRouter.post("/register", async (req: Request, res: Response) => {
  try {
    if (!(req.body.handle && req.body.email && req.body.password))
      return res.status(400).json({ message: "Missing required fields" });
    const { handle, email, password } = req.body;
    const hash = await hashPassword(password);
    const newUser: any = new User({
      handle,
      email,
      password: hash,
    });
    newUser.save((e: any, result: any) => {
      if (e && e.code === 11000) {
        return res
          .status(400)
          .json({ message: "Handle or Email is already in use" });
      } else {
        console.log(result);
        if (result) {
          const { email, password, _id, ...rest } = result._doc;
          const { acc_token, ref_token } = genTokenPair({ id: _id });
          storeTokenInRedis(_id, ref_token);
          res.cookie("acc", acc_token);
          res.cookie("ref", ref_token);
          console.log(rest);
          res.status(200).json({ user: rest });
        }
      }
    });
  } catch (e: any) {
    res.status(500).json(e.message);
  }
});

authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    if (!((req.body.handle || req.body.email) && req.body.password)) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const { handle, email, password } = req.body;
    const user: any = handle
      ? await User.findOne({ handle })
      : await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "Hanlde/Email or password is incorrect" });
    console.log(user);
    const match = await bcrypt.compare(password, user._doc.password);
    if (!match) {
      return res
        .status(400)
        .json({ message: "Hanlde/email or password is incorrect" });
    } else {
      const { acc_token, ref_token } = genTokenPair({ id: user._doc._id });
      const { email, password, _id, ...rest } = user._doc;
      storeTokenInRedis(_id, ref_token);
      res.cookie("acc", acc_token);
      res.cookie("ref", ref_token);
      res.status(200).json({ user: rest });
    }
  } catch (e: any) {
    res.status(500).json(e.message);
  }
});

authRouter.post("/logout", async (req: Request, res: Response) => {
  const { ref } = req.cookies;
  if (ref) {
    if (process.env.REF_SEC) {
      const key: any = jwt.verify(ref, process.env.REF_SEC);
      clearTokensInRedis(key.id as string);
    }
  }
  res.clearCookie("ref");
  res.clearCookie("acc");
  res.end();
});

authRouter.post("/request_reset_token", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({
        message: "Email must be provided in order to reset the password",
      });
    const user: any = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No user with such email" });
    const { acc_token } = genTokenPair({ id: user._doc._id });
    sendResetEmail(user._doc.email, acc_token, (err: any, info: any) => {
      if (err) return res.status(400).json({ message: err.message });
      res.status(200).json({ info });
    });
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

authRouter.post("/reset_password", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    if (!(token && newPassword))
      return res.status(400).json({ message: "Missing required fields" });
    if (process.env.ACC_SEC) {
      const { id }: any = jwt.verify(token, process.env.ACC_SEC);
      const hash = await hashPassword(newPassword);
      const user = await User.findOneAndUpdate({ _id: id }, { password: hash });
      user?.save((e: any) => {
        if (e) return res.status(500).json({ message: e.message });
        return res.status(200).json({ message: "Password has been reset" });
      });
    }
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});

const verifyAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { ref, acc } = req.cookies;
    if (!(ref && acc) || !acc)
      return res.status(403).json({ message: "Missing access token" });
    if (!process.env.ACC_SEC) throw new Error("no acc token env");
    const { id }: any = jwt.verify(acc, process.env.ACC_SEC);
    const exists = await checkIfInRedis(id, ref);
    if (!exists)
      return res
        .status(403)
        .json({ message: "Idk how you got that token but ok." });
    req.body.id = id;
    return next();
  } catch (e: any) {
    return res.status(500).json({ message: e.message });
  }
};

authRouter.post("/exists", async (req: Request, res: Response) => {
  try {
    const { handle } = req.query;
    console.log(handle);
    const count = await User.countDocuments({ handle });
    if (count) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
});
authRouter.post(
  "/update",
  verifyAccess,
  async (req: Request, res: Response) => {
    try {
      const user = await User.findById({ _id: req.body.id });
      console.log(user);
      res.status(200).json("Protected things and data");
    } catch (e: any) {
      res.status(500).json({ message: e.message });
    }
  }
);
