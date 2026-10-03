import { prisma } from "../../lib/prisma";

export async function GET() {
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
          eventType: {
            in: ["GENERATION", "ACTIVITY_USED"],
          },
        },
      }),

      prisma.usageEvent.count({
        where: {
          activityType: "WORD_SEARCH",
          eventType: {
            in: ["GENERATION", "ACTIVITY_USED"],
          },
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
          mostUsedActivityType,
          successfulGenerations,
          failedGenerations,
        },
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
        status: 503,
      }
    );
  }
}
