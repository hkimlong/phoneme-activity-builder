import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return Response.json(
      {
        status: "ok",
        database: "connected",
        message: "Phoneme Activity Builder API is running",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return Response.json(
      {
        status: "error",
        database: "disconnected",
        message: "Database connection failed",
      },
      {
        status: 500,
      }
    );
  }
}