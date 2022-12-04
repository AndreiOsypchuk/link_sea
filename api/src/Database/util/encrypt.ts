import bcrypt from "bcrypt";

export async function encrypt(password: string) {
  try {
    if (!password) throw new Error("password is required");
    const saltRounds = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function compare(hash: string, password: string) {
  try {
    const match = await bcrypt.compare(password, hash);
    if (match) {
      return true;
    }
    return false;
  } catch (e: any) {
    throw new Error(e);
  }
}
