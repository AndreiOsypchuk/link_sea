import mongoose from "mongoose";

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
        `Connected to\x1b[33m ${Database.Connection.name}\x1b[0m database database`
      )
    );
    Database.Connection.on("error", () =>
      console.error.bind(console, "connection error: ")
    );
  }
}
