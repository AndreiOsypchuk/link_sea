import mongoose, { CallbackError } from "mongoose";
import { User } from "./user.schema";
import { encrypt } from "../controller/util";

interface CreateUserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

type dbCallbackFn = (e: CallbackError, resobj: any) => void;

export class Database {
  private static Instance: Database;
  static Connection: mongoose.Connection;
  static Init(): Database | null {
    if (Database.Instance) throw new Error("Database instance already exists");
    Database.Instance = this;
    return Database.Instance;
  }

  static CreateConnection(): void {
    if (process.env.DB_HOST) mongoose.connect(process.env.DB_HOST);
    else throw new Error("No database uri was provided");
    Database.Connection = mongoose.connection;
    Database.Connection.once("open", () =>
      console.log(
        `Connected to\x1b[33m ${Database.Connection.name}\x1b[0m database 🍃`
      )
    );
    Database.Connection.on("error", () =>
      console.error.bind(console, "connection error: ")
    );
  }
  static async CreateUser(
    data: CreateUserProps,
    dbCallback: dbCallbackFn
  ): Promise<void> {
    try {
      const hash = await encrypt(data.password);
      if (await User.countDocuments({ email: data.email })) {
        dbCallback(new Error("user already exitst"), null);
        return;
      }
      const newUser: any = new User({ ...data, password: hash });
      newUser.save(async (e: CallbackError) => {
        dbCallback(e, newUser.info);
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async GetUser(email: string, dbCallback: dbCallbackFn): Promise<void> {
    try {
      User.findOne({ email }, async (e: any, res: any) => {
        if (!res) dbCallback(new Error("Wrong email or password"), null);
        dbCallback(e, res.info);
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  static async ListUsers(dbCallback: dbCallbackFn): Promise<void> {
    try {
      User.find(async (e: any, res: any) => {
        dbCallback(e, res);
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
