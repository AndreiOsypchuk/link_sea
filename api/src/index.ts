import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import "./Controllers";
import { router } from "./Controllers/decorators";
import { Database } from "./Database";
Database.Init();
export const app = express();
app.use(express.json());

app.use(cookieParser());

app.use("/api", router);
app.use(cors());

const PORT = process.env.PORT || 4000;
export const serverInstance: http.Server = app.listen(PORT, () =>
  console.log(`Server is up and running on port\x1b[33m ${PORT}\x1b[0m 🚀`)
);
