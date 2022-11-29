import jwt from "jsonwebtoken";
import fs from "fs";
export const tokenize = (data: any): string => {
  try {
    const key = fs.readFileSync("jwtRS256.key", { encoding: "utf8" });
    const token = jwt.sign({ data }, key, {
      algorithm: "RS256",
      issuer: "shyer_auth",
      expiresIn: "1d",
    });
    return token;
  } catch (e: any) {
    throw new Error(e.message);
  }
};

interface tokenPayload {
  data: string;
  iat: number;
  exp: number;
  iss: string;
}

export const authorize = (token: string): tokenPayload | null => {
  try {
    const key = fs.readFileSync("jwtRS256.key.pub", { encoding: "utf8" });
    const data = jwt.verify(token, key) as tokenPayload;
    if (data) return data;
    return null;
  } catch (e: any) {
    throw new Error(e.message);
  }
};
