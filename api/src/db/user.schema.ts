import mongoose from "mongoose";
import { emailValidator } from "./validators";
const userSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator,
  },
  password: { type: String, required: true },
});

export interface userSchemaType {
  handle: string;
  email: string;
  password: string;
  _id: any;
}

userSchema.virtual("info").get(function geUserInfo(this: userSchemaType) {
  return { handle: this.handle, _id: this._id };
});
export const User = mongoose.model("User", userSchema);
