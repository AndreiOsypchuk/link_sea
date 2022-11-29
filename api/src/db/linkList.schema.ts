import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  name: String,
  href: String,
});

const linkListSchema = new mongoose.Schema({
  owner: mongoose.Types.ObjectId,
  links: [linkSchema],
});

export interface linkListType {
  owner: mongoose.Types.ObjectId;
  links: any[];
}

export const LinkList = mongoose.model("LinkList", linkListSchema);
