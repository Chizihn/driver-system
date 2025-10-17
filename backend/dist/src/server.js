"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const database_config_1 = require("./config/database.config");
const logger_util_1 = require("./utils/logger.util");
const PORT = process.env.PORT || 4000;
async function start() {
    try {
        await database_config_1.prisma.$connect();
        app_1.default.listen(PORT, () => logger_util_1.logger.info(`Server running on port ${PORT}`));
    }
    catch (err) {
        logger_util_1.logger.error("Failed to start server", err);
        process.exit(1);
    }
}
start();
