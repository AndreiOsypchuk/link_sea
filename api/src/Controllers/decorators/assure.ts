import { NextFunction, Request, Response } from "express";

export const assure = (fields: string[]) => {
  return (proto: any, key: string, desc: PropertyDescriptor) => {
    const checkForFields = (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      for (let field of fields) {
        if (!req.body[field])
          return res
            .status(400)
            .json({ message: `${field} is missing`, success: false });
      }
      return next();
    };
    const mids = Reflect.getMetadata("middlewares", proto, key) || [];
    mids.push(checkForFields);
    Reflect.defineMetadata("middlewares", mids, proto, key);
  };
};
