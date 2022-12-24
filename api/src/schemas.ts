import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  fileBuffer: Buffer,
});
const userSchema = new mongoose.Schema({
  handle: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: imageSchema, default: null },
});

export const User = mongoose.model("User", userSchema);
