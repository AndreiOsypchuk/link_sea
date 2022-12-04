import mongoose from "mongoose";
import { User } from "./user.schema";
import { compare, encrypt } from "./util";
interface DbErrorProps {
  message: string;
  status: number;
}
export class DbError extends Error {
  public status: number;
  public message: string;
  constructor(obj: DbErrorProps) {
    super(obj.message);
    this.status = obj.status;
    this.message = obj.message;
  }
}

interface CreateUserProps {
  handle: string;
  email: string;
  password: string;
}
interface LoginUserProps {
  email: string;
  password: string;
}
type DBCallback = (result: any, e: DbError | null) => void;
export class Database {
  private static s_Connection: mongoose.Connection | null;
  public static async Init() {
    const uri = process.env.DEV ? process.env.DB_TEST : process.env.DB_PROD;
    if (!uri) throw new Error("No database uri was provided");
    await mongoose.connect(uri);
    Database.s_Connection = mongoose.connection;
    console.log(
      `Connected to\x1b[32m ${Database.s_Connection?.name}\x1b[0m database 🍃`
    );
  }

  public static async Destroy() {
    Database.s_Connection?.close();
    Database.s_Connection = null;
  }

  public static async CreateUser(data: CreateUserProps, cb: DBCallback) {
    if (
      (await User.countDocuments({ handle: data.handle })) ||
      (await User.countDocuments({ email: data.email }))
    ) {
      cb(null, new DbError({ message: "User already exists", status: 400 }));
    } else {
      const hash = await encrypt(data.password);
      const newUser = new User({ ...data, password: hash });
      newUser.save((e: any, result: any) => {
        if (e) cb(null, new DbError({ message: e.message, status: 400 }));
        else {
          const { email, password, ...other } = result._doc;
          cb(other, null);
        }
      });
    }
  }

  public static async LoginUser(data: LoginUserProps, cb: DBCallback) {
    const user: any = await User.findOne({ email: data.email });
    if (!user) {
      cb(
        null,
        new DbError({ message: "Email or password is incorrect", status: 400 })
      );
    } else {
      const match = user.password
        ? await compare(user.password, data.password)
        : false;
      if (!match) {
        cb(
          null,
          new DbError({
            message: "Email or password is incorrect",
            status: 400,
          })
        );
      } else {
        const { email, password, ...other } = user._doc;
        cb(other, null);
      }
    }
    // const match = compare(user.password, data.password);
  }
}
