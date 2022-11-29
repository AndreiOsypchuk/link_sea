import bcrypt from "bcrypt";

export const encrypt = async (str: string): Promise<string | null> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(str, salt);
    return hash;
  } catch (e: any) {
    throw new Error(e.message);
  }
};
