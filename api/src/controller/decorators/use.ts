import "reflect-metadata";

export const use = (...fns: Function[]) => {
  return (proto: any, key: string, _desc: PropertyDescriptor) => {
    const midFns = Reflect.getMetadata("middlewares", proto, key) || [];
    Reflect.defineMetadata("middlewares", [...midFns, ...fns], proto, key);
  };
};
