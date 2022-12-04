import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  handle: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, rquired: true },
});

export const User = mongoose.model("User", userSchema);
