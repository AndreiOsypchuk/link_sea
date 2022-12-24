import mongoose from "mongoose";

export const connectToDb = async () => {
  const uri = process.env.DB_URI;
  if (!uri) throw new Error("Db uri is not provided");
  await mongoose.connect(uri);
  const connection = mongoose.connection;
  console.log("Connected to", connection.name, "database");
};
