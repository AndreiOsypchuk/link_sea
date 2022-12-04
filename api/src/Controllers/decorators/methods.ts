import "reflect-metadata";

export enum Methods {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
}

const methodsFactory = (method: string) => {
  return (path: string) => {
    return (proto: any, key: string, desc: PropertyDescriptor) => {
      Reflect.defineMetadata("method", method, proto, key);
      Reflect.defineMetadata("path", path, proto, key);
    };
  };
};

export const get = methodsFactory("get");
export const post = methodsFactory("post");
export const put = methodsFactory("put");
export const del = methodsFactory("delete");
