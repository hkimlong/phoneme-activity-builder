import { prisma } from "../../../lib/prisma";

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");

  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost",
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
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const activities = await prisma.activity.findMany({
      where: type
        ? {
            type: type,
          }
        : {},
      include: {
        word: {
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
        wordList: {
          include: {
            words: {
              include: {
                phonemes: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(activities, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to get activities:", error);

    return Response.json(
      {
        error: "Failed to get activities",
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
          error: "Activity name is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (!["WORDLE", "WORD_SEARCH"].includes(body.type)) {
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

    if (!["EASY", "MEDIUM", "HARD"].includes(body.difficulty)) {
      return Response.json(
        {
          error: "Difficulty must be EASY, MEDIUM or HARD",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (!body.wordListId) {
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

    if (body.type === "WORDLE") {
      const numberOfGuesses = Number(
        body.numberOfGuesses ?? 6
      );

      if (
        !Number.isInteger(numberOfGuesses) ||
        numberOfGuesses < 1 ||
        numberOfGuesses > 20
      ) {
        return Response.json(
          {
            error:
              "Number of guesses must be a whole number between 1 and 20",
          },
          {
            status: 400,
            headers: getCorsHeaders(request),
          }
        );
      }
    }

    if (body.type === "WORD_SEARCH") {
      const gridSize = Number(body.gridSize ?? 10);

      if (
        !Number.isInteger(gridSize) ||
        gridSize < 5 ||
        gridSize > 20
      ) {
        return Response.json(
          {
            error:
              "Grid size must be a whole number between 5 and 20",
          },
          {
            status: 400,
            headers: getCorsHeaders(request),
          }
        );
      }
    }

    const activity = await prisma.activity.create({
      data: {
        name: body.name.trim(),
        type: body.type,
        difficulty: body.difficulty,
        showHints: body.showHints ?? true,
        numberOfGuesses:
          body.type === "WORDLE"
            ? Number(body.numberOfGuesses ?? 6)
            : null,
        gridSize:
          body.type === "WORD_SEARCH"
            ? Number(body.gridSize ?? 10)
            : null,
        puzzleData:
          body.type === "WORD_SEARCH"
            ? body.puzzleData ?? null
            : null,
        wordListId: body.wordListId,
        wordId: body.wordId || null,
      },
      include: {
        word: {
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
        wordList: {
          include: {
            words: {
              include: {
                phonemes: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    return Response.json(activity, {
      status: 201,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to create activity:", error);

    return Response.json(
      {
        error: "Failed to create activity",
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
          error: "Activity ID is required",
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
          error: "Activity name is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (!["WORDLE", "WORD_SEARCH"].includes(body.type)) {
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

    if (!["EASY", "MEDIUM", "HARD"].includes(body.difficulty)) {
      return Response.json(
        {
          error: "Difficulty must be EASY, MEDIUM or HARD",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    if (body.type === "WORDLE") {
      const numberOfGuesses = Number(
        body.numberOfGuesses ?? 6
      );

      if (
        !Number.isInteger(numberOfGuesses) ||
        numberOfGuesses < 1 ||
        numberOfGuesses > 20
      ) {
        return Response.json(
          {
            error:
              "Number of guesses must be a whole number between 1 and 20",
          },
          {
            status: 400,
            headers: getCorsHeaders(request),
          }
        );
      }
    }

    if (body.type === "WORD_SEARCH") {
      const gridSize = Number(body.gridSize ?? 10);

      if (
        !Number.isInteger(gridSize) ||
        gridSize < 5 ||
        gridSize > 20
      ) {
        return Response.json(
          {
            error:
              "Grid size must be a whole number between 5 and 20",
          },
          {
            status: 400,
            headers: getCorsHeaders(request),
          }
        );
      }
    }

    const activity = await prisma.activity.update({
      where: {
        id: id,
      },
      data: {
        name: body.name.trim(),
        type: body.type,
        difficulty: body.difficulty,
        showHints: body.showHints ?? true,
        numberOfGuesses:
          body.type === "WORDLE"
            ? Number(body.numberOfGuesses ?? 6)
            : null,
        gridSize:
          body.type === "WORD_SEARCH"
            ? Number(body.gridSize ?? 10)
            : null,
        puzzleData:
          body.type === "WORD_SEARCH"
            ? body.puzzleData ?? null
            : null,
        wordId: body.wordId || null,
      },
      include: {
        word: {
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
          },
        },
        wordList: {
          include: {
            words: {
              include: {
                phonemes: {
                  orderBy: {
                    position: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    return Response.json(activity, {
      status: 200,
      headers: getCorsHeaders(request),
    });
  } catch (error) {
    console.error("Failed to update activity:", error);

    return Response.json(
      {
        error: "Failed to update activity",
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
          error: "Activity ID is required",
        },
        {
          status: 400,
          headers: getCorsHeaders(request),
        }
      );
    }

    await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    return Response.json(
      {
        message: "Activity deleted successfully",
      },
      {
        status: 200,
        headers: getCorsHeaders(request),
      }
    );
  } catch (error) {
    console.error("Failed to delete activity:", error);

    return Response.json(
      {
        error: "Failed to delete activity",
      },
      {
        status: 500,
        headers: getCorsHeaders(request),
      }
    );
  }
}