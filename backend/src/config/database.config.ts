import { PrismaClient } from "@prisma/client";

// Simple Prisma client export used by repositories
export const prisma = new PrismaClient();

export default prisma;
