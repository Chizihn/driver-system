"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Simple Prisma client export used by repositories
exports.prisma = new client_1.PrismaClient();
exports.default = exports.prisma;
