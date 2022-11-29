import mongoose, { ObjectId } from "mongoose";
import { emailValidator } from "./validators";
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: emailValidator,
  },
  password: { type: String, required: true },
});

export interface userSchemaType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  _id: any;
}

userSchema.virtual("info").get(function geUserInfo(this: userSchemaType) {
  return { firstName: this.firstName, lastName: this.lastName, _id: this._id };
});
export const User = mongoose.model("User", userSchema);
