import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { prisma } from "./config/database.config";
import { logger } from "./utils/logger.util";

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
  } catch (err) {
    logger.error("Failed to start server", err);
    process.exit(1);
  }
}

start();
