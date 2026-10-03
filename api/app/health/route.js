import { prisma } from "../../lib/prisma";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost",
  "http://44.205.173.19",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");

  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : allowedOrigins[0],
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS(request) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

export async function GET(request) {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const [
      wordleCreated,
      wordSearchCreated,
      successfulGenerations,
      failedGenerations,
      pageDurationData,
      wordleUsage,
      wordSearchUsage,
    ] = await Promise.all([
      prisma.activity.count({
        where: {
          type: "WORDLE",
        },
      }),

      prisma.activity.count({
        where: {
          type: "WORD_SEARCH",
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION",
          success: true,
        },
      }),

      prisma.usageEvent.count({
        where: {
          eventType: "GENERATION",
          success: false,
        },
      }),

      prisma.usageEvent.aggregate({
        where: {
          eventType: "PAGE_VIEW",
          duration: {
            not: null,
          },
        },
        _avg: {
          duration: true,
        },
      }),

      prisma.usageEvent.count({
        where: {
          activityType: "WORDLE",
          eventType: "ACTIVITY_USED",
        },
      }),

      prisma.usageEvent.count({
        where: {
          activityType: "WORD_SEARCH",
          eventType: "ACTIVITY_USED",
        },
      }),
    ]);

    let mostUsedActivityType = "No usage data";

    if (wordleUsage > wordSearchUsage) {
      mostUsedActivityType = "WORDLE";
    } else if (wordSearchUsage > wordleUsage) {
      mostUsedActivityType = "WORD_SEARCH";
    } else if (wordleUsage > 0 && wordSearchUsage > 0) {
      mostUsedActivityType = "TIE";
    }

    const averageTimeOnPage =
      pageDurationData._avg.duration === null
        ? 0
        : Math.round(pageDurationData._avg.duration);

    return Response.json(
      {
        status: "ok",
        database: "connected",
        message: "Phoneme Activity Builder API is running",
        metrics: {
          wordleCreated,
          wordSearchCreated,
          averageTimeOnPageSeconds: averageTimeOnPage,
          wordleUsage,
          wordSearchUsage,
          mostUsedActivityType,
          successfulGenerations,
          failedGenerations,
        },
      },
      {
        status: 200,
        headers: getCorsHeaders(request),
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
        status: 503,
        headers: getCorsHeaders(request),
      }
    );
  }
}
