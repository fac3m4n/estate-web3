import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

prisma
  .$connect()
  .then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error: any) => {
    console.error("Failed to connect to database:", error);
  });
