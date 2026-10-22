import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const client = process.env.DATABASE_URL
  ? new PrismaClient({ adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }) })
  : new PrismaClient();
export const prisma = globalForPrisma.prisma ?? client;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
