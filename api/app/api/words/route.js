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
    const wordListId = searchParams.get("wordListId");

    const words = await prisma.word.findMany({
      where: wordListId
        ? {
            wordListId: wordListId,
          }
        : {},
      include: {
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },
        wordList: true,
      },
    });

    return Response.json(words, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Failed to get words:", error);

    return Response.json(
      {
        error: "Failed to get words",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (
      !body.englishWord ||
      body.englishWord.trim() === ""
    ) {
      return Response.json(
        {
          error: "English word is required",
        },
        {
          status: 400,
          headers: corsHeaders,
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
          headers: corsHeaders,
        }
      );
    }

    if (
      !Array.isArray(body.phonemes) ||
      body.phonemes.length === 0
    ) {
      return Response.json(
        {
          error: "At least one phoneme is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const cleanedPhonemes = body.phonemes
      .map((phoneme) => String(phoneme).trim())
      .filter((phoneme) => phoneme !== "");

    if (cleanedPhonemes.length === 0) {
      return Response.json(
        {
          error: "At least one valid phoneme is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const wordList = await prisma.wordList.findUnique({
      where: {
        id: body.wordListId,
      },
    });

    if (!wordList) {
      return Response.json(
        {
          error: "Word list not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const word = await prisma.word.create({
      data: {
        englishWord: body.englishWord.trim(),
        wordListId: body.wordListId,
        phonemes: {
          create: cleanedPhonemes.map(
            (phoneme, index) => ({
              symbol: phoneme,
              position: index + 1,
            })
          ),
        },
      },
      include: {
        phonemes: {
          orderBy: {
            position: "asc",
          },
        },
        wordList: true,
      },
    });

    return Response.json(word, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Failed to create word:", error);

    return Response.json(
      {
        error: "Failed to create word",
      },
      {
        status: 500,
        headers: corsHeaders,
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
          error: "Word ID is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      !body.englishWord ||
      body.englishWord.trim() === ""
    ) {
      return Response.json(
        {
          error: "English word is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    if (
      !Array.isArray(body.phonemes) ||
      body.phonemes.length === 0
    ) {
      return Response.json(
        {
          error: "At least one phoneme is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const cleanedPhonemes = body.phonemes
      .map((phoneme) => String(phoneme).trim())
      .filter((phoneme) => phoneme !== "");

    if (cleanedPhonemes.length === 0) {
      return Response.json(
        {
          error: "At least one valid phoneme is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingWord) {
      return Response.json(
        {
          error: "Word not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    const word = await prisma.$transaction(
      async (tx) => {
        await tx.phoneme.deleteMany({
          where: {
            wordId: id,
          },
        });

        return tx.word.update({
          where: {
            id: id,
          },
          data: {
            englishWord: body.englishWord.trim(),
            phonemes: {
              create: cleanedPhonemes.map(
                (phoneme, index) => ({
                  symbol: phoneme,
                  position: index + 1,
                })
              ),
            },
          },
          include: {
            phonemes: {
              orderBy: {
                position: "asc",
              },
            },
            wordList: true,
          },
        });
      }
    );

    return Response.json(word, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("Failed to update word:", error);

    return Response.json(
      {
        error: "Failed to update word",
      },
      {
        status: 500,
        headers: corsHeaders,
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
          error: "Word ID is required",
        },
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    const existingWord = await prisma.word.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingWord) {
      return Response.json(
        {
          error: "Word not found",
        },
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    await prisma.word.delete({
      where: {
        id: id,
      },
    });

    return Response.json(
      {
        message: "Word deleted successfully",
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("Failed to delete word:", error);

    return Response.json(
      {
        error: "Failed to delete word",
      },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}