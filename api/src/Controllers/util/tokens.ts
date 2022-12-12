import jwt from "jsonwebtoken";
import fs from "fs";
export const tokenize = (data: any, ecb: Function): string | null => {
  try {
    const key = fs.readFileSync("jwtRS256.key", { encoding: "utf8" });
    const token = jwt.sign({ data }, key, {
      algorithm: "RS256",
      issuer: "shyer_auth",
      expiresIn: "1d",
    });
    return token;
  } catch (e: any) {
    ecb(e);
    return null;
  }
};

interface tokenPayload {
  data: string;
  iat: number;
  exp: number;
  iss: string;
}

export const createTokenPair = (
  id: string
): { ref: string; acc: string } | null => {
  try {
    // TODO: move secret to dotenv
    const ref = jwt.sign({ data: id }, "wtf");
    const acc = tokenize(id, (e: any) => console.log(e.message));
    if (!ref || !acc) throw new Error("tokens failed");
    return { ref, acc };
  } catch (e: any) {
    console.log(e.message);
    return null;
  }
};

export const authorize = (
  token: string,
  ecb: Function
): tokenPayload | null => {
  try {
    const key = fs.readFileSync("jwtRS256.key.pub", { encoding: "utf8" });
    const data = jwt.verify(token, key) as tokenPayload;
    if (data) return data;
    return null;
  } catch (e: any) {
    ecb(e);
    return null;
  }
};

export const verifyRefresh = (token: string) => {
  try {
    if (process.env.REF_SEC) {
      const { data }: any = jwt.verify(token, process.env.REF_SEC);
      if (data) return data;
    }
    throw new Error("Something wrong with refresh token");
  } catch (e: any) {
    return null;
  }
};
