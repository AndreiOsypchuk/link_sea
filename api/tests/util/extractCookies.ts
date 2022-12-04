interface HeaderWithCookies {
  "set-cookie": string[] | undefined;
}
interface CookieObj {
  auth?: string;
}
enum CookieNames {
  auth = "auth",
}
export const extractCookies = (header: HeaderWithCookies) => {
  const cookies = header["set-cookie"];
  let result: CookieObj = {};
  if (!cookies) return result;
  for (let i in cookies) {
    const [rawCookie, ...rawFlag] = cookies[i].split("; ");
    const [name, value] = rawCookie.split("=");
    result[name as CookieNames] = value;
  }
  return result;
};
