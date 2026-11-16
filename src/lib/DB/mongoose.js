import mongoose from "mongoose";
import { env } from "../config/env.js";
import { logger } from "../../pkg/logger/logger.js";

// Returns the real promise so `await connect()` in server.js actually waits for MongoDB.
// If the connection fails, the error propagates to main().catch -> logged + process exits,
// instead of the server starting and every query hanging.
export async function connect() {
  await mongoose.connect(env.db.url);
  logger.info("DB connected");
}
