import { prisma } from "../../../lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
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

    return Response.json(activities, { status: 200, headers: corsHeaders, });
  } catch (error) {
    console.error("Failed to get activities:", error);

    return Response.json(
      { error: "Failed to get activities" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || body.name.trim() === "") {
      return Response.json(
        { error: "Activity name is required" },
        { status: 400 }
      );
    }

    if (!["WORDLE", "WORD_SEARCH"].includes(body.type)) {
      return Response.json(
        { error: "Activity type must be WORDLE or WORD_SEARCH" },
        { status: 400 }
      );
    }

    if (!["EASY", "MEDIUM", "HARD"].includes(body.difficulty)) {
      return Response.json(
        { error: "Difficulty must be EASY, MEDIUM or HARD" },
        { status: 400 }
      );
    }

    if (!body.wordListId) {
      return Response.json(
        { error: "Word list ID is required" },
        { status: 400 }
      );
    }

    const activity = await prisma.activity.create({
      data: {
        name: body.name.trim(),
        type: body.type,
        difficulty: body.difficulty,
        showHints: body.showHints ?? true,
        numberOfGuesses:
          body.type === "WORDLE" ? body.numberOfGuesses ?? 6 : null,
        gridSize:
          body.type === "WORD_SEARCH" ? body.gridSize ?? 10 : null,
        wordListId: body.wordListId,
      },
      include: {
        wordList: true,
      },
    });

    return Response.json(activity, { status: 201, headers: corsHeaders, });
  } catch (error) {
    console.error("Failed to create activity:", error);

    return Response.json(
      { error: "Failed to create activity" },
      { status: 500 }
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
        { error: "Activity ID is required" },
        { status: 400 }
      );
    }

    if (!body.name || body.name.trim() === "") {
      return Response.json(
        { error: "Activity name is required" },
        { status: 400 }
      );
    }

    if (!["WORDLE", "WORD_SEARCH"].includes(body.type)) {
      return Response.json(
        { error: "Activity type must be WORDLE or WORD_SEARCH" },
        { status: 400 }
      );
    }

    if (!["EASY", "MEDIUM", "HARD"].includes(body.difficulty)) {
      return Response.json(
        { error: "Difficulty must be EASY, MEDIUM or HARD" },
        { status: 400 }
      );
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
          body.type === "WORDLE" ? body.numberOfGuesses ?? 6 : null,
        gridSize:
          body.type === "WORD_SEARCH" ? body.gridSize ?? 10 : null,
      },
      include: {
        wordList: true,
      },
    });

    return Response.json(activity, { status: 200 });
  } catch (error) {
    console.error("Failed to update activity:", error);

    return Response.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { error: "Activity ID is required" },
        { status: 400 }
      );
    }

    await prisma.activity.delete({
      where: {
        id: id,
      },
    });

    return Response.json(
      { message: "Activity deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete activity:", error);

    return Response.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}