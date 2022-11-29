import express, { Express } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
export class ServerAPI {
  private API: Express;
  private Router: express.Router;
  private PORT: string | number;
  constructor(defaultPort: string | number = 4000) {
    this.PORT = process.env.PORT || defaultPort;
    this.API = express();
    this.Router = express.Router();
    this.Use();
  }

  private Use(): void {
    this.API.use(cors());
    this.API.use(express.json());
    this.API.use(cookieParser());
  }

  public Start(): void {
    this.API.listen(this.PORT, () =>
      console.log(
        `Server is up and running on port\x1b[33m ${this.PORT}\x1b[0m 🚀`
      )
    );
  }

  public EnableRouter(): void {
    this.API.use(this.Router);
  }

  public GetRouter(): express.Router {
    return this.Router;
  }
}
