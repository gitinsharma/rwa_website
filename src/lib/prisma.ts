import { PrismaClient } from "@prisma/client";

// Next.js dev mode reloads modules on every change; without this guard each
// reload would open a fresh pool of Postgres connections. Cache the client
// on the global object in development and create it fresh in production.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
