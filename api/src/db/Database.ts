import mongoose, { CallbackError } from "mongoose";
import { User } from "./user.schema";
import { LinkList, linkListType } from "./linkList.schema";
import { encrypt } from "../controller/util";

interface CreateUserProps {
  handle: string;
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
    const uri = process.env.DEV ? process.env.DB_TEST : process.env.DB_PROD;
    if (uri) mongoose.connect(uri);
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
      if (
        (await User.countDocuments({ email: data.email })) &&
        (await User.countDocuments({ handle: data.handle }))
      ) {
        dbCallback(
          new Error("User with this handle or email already exists"),
          null
        );
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
        const list: linkListType | null = await LinkList.findOne({
          owner: res.info._id,
        });
        if (!res) dbCallback(new Error("Wrong email or password"), null);
        if (!list) dbCallback(new Error("No list was found"), null);
        if (list) dbCallback(e, { ...res.info, links: list.links });
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

  static async CreateLinkList(
    userId: string,
    dbCallback: dbCallbackFn
  ): Promise<void> {
    try {
      const newLinkList = new LinkList({ owner: userId });
      newLinkList.save(async (e: CallbackError, result: any) => {
        dbCallback(e, result);
      });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
