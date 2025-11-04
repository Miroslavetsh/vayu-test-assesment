import prisma from "./prisma";

export async function testConnection(): Promise<void> {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ MySQL connected!");
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    throw error;
  }
}

export { prisma };
