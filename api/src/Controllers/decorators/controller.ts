import "reflect-metadata";
import express from "express";
import { Methods } from "./methods";
export const router = express.Router();
export const Controller = (prefix: string) => {
  return (target: any) => {
    const targetMethods = Object.getOwnPropertyNames(target.prototype);
    targetMethods.shift();
    for (let key of targetMethods) {
      const method: Methods = Reflect.getMetadata(
        "method",
        target.prototype,
        key
      );
      const path = Reflect.getMetadata("path", target.prototype, key);
      const middlewares =
        Reflect.getMetadata("middlewares", target.prototype, key) || [];
      router[method](
        `/${prefix}/${path}`,
        ...middlewares,
        target.prototype[key]
      );
    }
  };
};
