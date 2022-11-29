import { Application } from "../../Application";
import { Method } from "./method";
import "reflect-metadata";
const getClassMethods = (target: any) => {
  const l = Object.getOwnPropertyNames(target.prototype);
  l.shift();
  return l;
};
export const Controller =
  (prefix: string = "") =>
  (target: any) => {
    const methods = getClassMethods(target);
    for (let key of methods) {
      const method: Method = Reflect.getMetadata(
        "method",
        target.prototype,
        key
      );
      const path: string = Reflect.getMetadata("path", target.prototype, key);
      const middlewares =
        Reflect.getMetadata("middlewares", target.prototype, key) || [];

      Application.GetRouter()[method](
        prefix + path,
        ...middlewares,
        target.prototype[key]
      );
    }
  };
