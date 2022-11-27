import "reflect-metadata";

export enum Method {
  get = "get",
  post = "post",
  del = "delete",
  patch = "patch",
}

const method =
  (m: string) =>
  (path: string) =>
  (proto: any, key: string, _desc: PropertyDescriptor) => {
    Reflect.defineMetadata("path", path, proto, key);
    Reflect.defineMetadata("method", m, proto, key);
  };

export const get = method(Method.get);
export const post = method(Method.post);
export const del = method(Method.del);
export const patch = method(Method.patch);
