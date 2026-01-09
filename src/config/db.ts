import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "warn", "error"]
      : ["error"],
});

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
};
