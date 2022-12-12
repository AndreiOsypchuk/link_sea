import { CookieName } from "./constants";
export const cookieParams = (kind: CookieName) => {
  switch (kind) {
    case CookieName.ACC: {
      //return { httpOnly: true, maxAge: 1000 * 60 * 15 };
      return { httpOnly: true, maxAge: 1000 * 10 };
    }
    case CookieName.REF: {
      return { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 };
    }
    default:
      return {};
  }
};
