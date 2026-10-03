const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4080";

async function handleResponse(response, errorMessage) {
  if (!response.ok) {
    let details = "";

    try {
      const data = await response.json();
      details = data.error ? `: ${data.error}` : "";
    } catch {
      // The response did not contain JSON.
    }

    throw new Error(`${errorMessage}${details}`);
  }

  return response.json();
}

// WORD LISTS

export async function getWordLists() {
  const response = await fetch(`${API_URL}/api/word-lists`);

  return handleResponse(
    response,
    "Could not load word lists"
  );
}

export async function createWordList(name) {
  const response = await fetch(`${API_URL}/api/word-lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
    }),
  });

  return handleResponse(
    response,
    "Could not create word list"
  );
}

// WORDS

export async function createWord({
  englishWord,
  phonemes,
  wordListId,
}) {
  const response = await fetch(`${API_URL}/api/words`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      englishWord,
      phonemes,
      wordListId,
    }),
  });

  return handleResponse(
    response,
    "Could not save word"
  );
}

// ACTIVITIES

export async function getActivities(type) {
  const response = await fetch(
    `${API_URL}/api/activities?type=${encodeURIComponent(type)}`
  );

  return handleResponse(
    response,
    "Could not load activities"
  );
}

export async function createActivity({
  name,
  type,
  difficulty,
  showHints = true,
  numberOfGuesses = null,
  gridSize = null,
  puzzleData = null,
  wordListId,
  wordId = null,
}) {
  const response = await fetch(
    `${API_URL}/api/activities`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        type,
        difficulty,
        showHints,
        numberOfGuesses,
        gridSize,
        puzzleData,
        wordListId,
        wordId,
      }),
    }
  );

  return handleResponse(
    response,
    "Could not save activity"
  );
}

export async function deleteActivity(id) {
  const response = await fetch(
    `${API_URL}/api/activities?id=${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    }
  );

  return handleResponse(
    response,
    "Could not delete activity"
  );
}

export async function updateActivity({
  id,
  name,
  type,
  difficulty,
  showHints = true,
  numberOfGuesses = null,
  gridSize = null,
  puzzleData = null,
  wordId = null,
}) {
  const response = await fetch(
    `${API_URL}/api/activities?id=${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        type,
        difficulty,
        showHints,
        numberOfGuesses,
        gridSize,
        puzzleData,
        wordId,
      }),
    }
  );

  return handleResponse(
    response,
    "Could not update activity"
  );
}

export async function updateWord({
  id,
  englishWord,
  phonemes,
  wordListId,
}) {
  const response = await fetch(
    `${API_URL}/api/words?id=${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        englishWord,
        phonemes,
        wordListId,
      }),
    }
  );

  return handleResponse(
    response,
    "Could not update word"
  );
}
// USAGE EVENTS

export async function getUsageEvents() {
  const response = await fetch(`${API_URL}/api/usage-events`);

  return handleResponse(
    response,
    "Could not load usage events"
  );
}

export async function createUsageEvent({
  eventType,
  activityType = null,
  page = null,
  duration = null,
  success = null,
  message = null,
}) {
  const response = await fetch(`${API_URL}/api/usage-events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventType,
      activityType,
      page,
      duration,
      success,
      message,
    }),
  });

  return handleResponse(
    response,
    "Could not save usage event"
  );
}
