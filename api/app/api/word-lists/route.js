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
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
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
    const wordLists = await prisma.wordList.findMany({
      include: {
        words: {
          include: {
            phonemes: true,
          },
        },
        activities: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(wordLists, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to get word lists:", error);

    return Response.json(
      {
        error: "Failed to get word lists",
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

    if (!body.name || body.name.trim() === "") {
      return Response.json(
        {
          error: "Word list name is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    const wordList = await prisma.wordList.create({
      data: {
        name: body.name.trim(),
      },
    });

    return Response.json(wordList, {
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to create word list:", error);

    return Response.json(
      {
        error: "Failed to create word list",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const body = await request.json();

    if (!id) {
      return Response.json(
        {
          error: "Word list ID is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (!body.name || body.name.trim() === "") {
      return Response.json(
        {
          error: "Word list name is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    const wordList = await prisma.wordList.update({
      where: {
        id: id,
      },
      data: {
        name: body.name.trim(),
      },
    });

    return Response.json(wordList, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to update word list:", error);

    return Response.json(
      {
        error: "Failed to update word list",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        {
          error: "Word list ID is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    await prisma.wordList.delete({
      where: {
        id: id,
      },
    });

    return Response.json(
      {
        message: "Word list deleted successfully",
      },
      {
        status: 200,
        headers: getCorsHeaders(request),
      }
    );
  } catch (error) {
    console.error("Failed to delete word list:", error);

    return Response.json(
      {
        error: "Failed to delete word list",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}