import { Request, Response, NextFunction } from "express";
export const assure = (fields: string[]) => {
  return (proto: any, key: string, _desc: PropertyDescriptor) => {
    const fn = (req: Request, res: Response, next: NextFunction) => {
      for (let field of fields)
        if (!req.body[field])
          return res.status(400).json(`${field} is missing`);
      next();
    };

    const ms = Reflect.getMetadata("middlewares", proto, key) || [];
    ms.push(fn);
    Reflect.defineMetadata("middlewares", ms, proto, key);
  };
};

/**
 *            Creates middleware function that checks if request body has @param fields fields.
 *            If not, it responds with 400 and "{field} is missing"
              @param fields An array of fields to check if they exist on the request body
             
 */
