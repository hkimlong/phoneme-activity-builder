import { prisma } from "../../../lib/prisma";

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost",
    "http://44.205.173.19",
  ];

  return {
    "Access-Control-Allow-Origin": allowedOrigins.includes(origin)
      ? origin
      : "http://localhost",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
    const usageEvents = await prisma.usageEvent.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(usageEvents, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to get usage events:", error);

    return Response.json(
      {
        error: "Failed to get usage events",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const validEventTypes = [
      "PAGE_VIEW",
      "ACTIVITY_USED",
      "GENERATION",
      "SIMULATED_INPUT",
    ];

    if (!validEventTypes.includes(body.eventType)) {
      return Response.json(
        {
          error:
            "Event type must be PAGE_VIEW, ACTIVITY_USED, GENERATION or SIMULATED_INPUT",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (
      body.activityType &&
      !["WORDLE", "WORD_SEARCH"].includes(body.activityType)
    ) {
      return Response.json(
        {
          error: "Activity type must be WORDLE or WORD_SEARCH",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (
      body.duration !== undefined &&
      body.duration !== null &&
      (!Number.isInteger(Number(body.duration)) || Number(body.duration) < 0)
    ) {
      return Response.json(
        {
          error: "Duration must be a whole number of seconds",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (
      body.success !== undefined &&
      body.success !== null &&
      typeof body.success !== "boolean"
    ) {
      return Response.json(
        {
          error: "Success must be true or false",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    const usageEvent = await prisma.usageEvent.create({
      data: {
        eventType: body.eventType,
        activityType: body.activityType || null,
        page: body.page?.trim() || null,
        duration:
          body.duration !== undefined && body.duration !== null
            ? Number(body.duration)
            : null,
        success:
          body.success !== undefined && body.success !== null
            ? body.success
            : null,
        message: body.message?.trim() || null,
      },
    });

    return Response.json(usageEvent, {
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to create usage event:", error);

    return Response.json(
      {
        error: "Failed to create usage event",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}