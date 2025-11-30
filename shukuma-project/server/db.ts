import mongoose from "mongoose";

let isConnecting = false;

export async function connectMongo() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (isConnecting) return mongoose;
  const url = process.env.MONGO_URL ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("MONGO_URL is not set (or DATABASE_URL fallback)");
  }
  isConnecting = true;
  await mongoose.connect(url, {
    // Add options here if needed
  });
  isConnecting = false;
  return mongoose;
}

export { mongoose };
