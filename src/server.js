import dotenv from "dotenv";
dotenv.config(); // لازم يتنفذ قبل ما أي ملف يقرأ process.env

import http from "http";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connect } from "./lib/DB/mongoose.js";
import { env } from "./lib/config/env.js";
import { logger } from "./pkg/logger/logger.js";

async function main() {
  await connect();

  const app = createApp();
  let a =  "ahme  Mohamed 'waael'"
  const server = http.createServer(app);

  server.listen(env.port, () => {
    logger.info(`server started on port ${env.port}`);
  });

  let shuttingDown = false;

  function shutdown(signal) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`${signal} received, shutting down`);

    // لو الإغلاق علّق، اقفل بالعافية بعد 10 ثواني
    const timer = setTimeout(() => process.exit(1), 10_000);
    timer.unref();

    server.close(async (err) => {
      try {
        await mongoose.disconnect();
        process.exit(err ? 1 : 0);
      } catch (e) {
        logger.error(e);
        process.exit(1);
      }
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err) => {
  logger.error(err);
  process.exit(1);
});