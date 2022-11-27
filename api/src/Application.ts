import { Database } from "./db";
import { ServerAPI } from "./server";
import express from "express";
import dotenv from "dotenv";
export class Application {
  public static Instance: Application | null = null;
  public static s_Server: ServerAPI;
  constructor() {
    if (Application.Instance) throw new Error("Application is already running");
    Application.Instance = this;
    dotenv.config();
    Database.Init();
    Application.s_Server = new ServerAPI();
    require("./controller");
  }

  public static GetRouter(): express.Router {
    return Application.s_Server.GetRouter();
  }

  public Run(): void {
    Database.CreateConnection();
    Application.s_Server.Start();
    Application.s_Server.EnableRouter();
  }
}
