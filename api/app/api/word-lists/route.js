import { prisma } from "../../../lib/prisma";

export async function GET() {
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

    return Response.json(wordLists, { status: 200 });
  } catch (error) {
    console.error("Failed to get word lists:", error);

    return Response.json(
      {
        error: "Failed to get word lists",
      },
      {
        status: 500,
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
        }
      );
    }

    const wordList = await prisma.wordList.create({
      data: {
        name: body.name.trim(),
      },
    });

    return Response.json(wordList, { status: 201 });
  } catch (error) {
    console.error("Failed to create word list:", error);

    return Response.json(
      {
        error: "Failed to create word list",
      },
      {
        status: 500,
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
        { error: "Word list ID is required" },
        { status: 400 }
      );
    }

    if (!body.name || body.name.trim() === "") {
      return Response.json(
        { error: "Word list name is required" },
        { status: 400 }
      );
    }

    const wordList = await prisma.wordList.update({
      where: { id },
      data: {
        name: body.name.trim(),
      },
    });

    return Response.json(wordList, { status: 200 });
  } catch (error) {
    console.error("Failed to update word list:", error);

    return Response.json(
      { error: "Failed to update word list" },
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
        { error: "Word list ID is required" },
        { status: 400 }
      );
    }

    await prisma.wordList.delete({
      where: { id },
    });

    return Response.json(
      { message: "Word list deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete word list:", error);

    return Response.json(
      { error: "Failed to delete word list" },
      { status: 500 }
    );
  }
}