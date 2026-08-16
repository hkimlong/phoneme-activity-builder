export function generateWordSearchGrid(words, difficulty, gridSize) {
  const size = Number(gridSize);

  const wordData = words
    .filter(
      (word) =>
        word.phonemes.trim() !== "" &&
        word.english.trim() !== ""
    )
    .map((word) => ({
      english: word.english,
      phonemes: word.phonemes
        .trim()
        .split(/\s+/)
        .filter(Boolean),
    }));

  // Create empty grid
  const grid = Array.from(
    { length: size },
    () => Array(size).fill(null)
  );

  // Difficulty controls allowed directions
  let directions = [];

  if (difficulty === "easy") {
    directions = [
      { row: 0, col: 1 }, // right
      { row: 1, col: 0 }, // down
    ];
  }

  if (difficulty === "medium") {
    directions = [
      { row: 0, col: 1 }, // right
      { row: 1, col: 0 }, // down
      { row: 1, col: 1 }, // down-right
      { row: 1, col: -1 }, // down-left
    ];
  }

  if (difficulty === "hard") {
    directions = [
      { row: 0, col: 1 }, // right
      { row: 0, col: -1 }, // left

      { row: 1, col: 0 }, // down
      { row: -1, col: 0 }, // up

      { row: 1, col: 1 }, // down-right
      { row: 1, col: -1 }, // down-left
      { row: -1, col: 1 }, // up-right
      { row: -1, col: -1 }, // up-left
    ];
  }

  const solutions = [];

  function canPlace(phonemes, startRow, startCol, direction) {
    const endRow =
      startRow +
      direction.row * (phonemes.length - 1);

    const endCol =
      startCol +
      direction.col * (phonemes.length - 1);

    if (
      endRow < 0 ||
      endRow >= size ||
      endCol < 0 ||
      endCol >= size
    ) {
      return false;
    }

    for (let i = 0; i < phonemes.length; i++) {
      const row =
        startRow + direction.row * i;

      const col =
        startCol + direction.col * i;

      if (
        grid[row][col] !== null &&
        grid[row][col] !== phonemes[i]
      ) {
        return false;
      }
    }

    return true;
  }

  // Place every word
  wordData.forEach((word) => {
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 300) {
      attempts++;

      const direction =
        directions[
          Math.floor(Math.random() * directions.length)
        ];

      const startRow =
        Math.floor(Math.random() * size);

      const startCol =
        Math.floor(Math.random() * size);

      if (
        canPlace(
          word.phonemes,
          startRow,
          startCol,
          direction
        )
      ) {
        const coordinates = [];

        word.phonemes.forEach((phoneme, index) => {
          const row =
            startRow + direction.row * index;

          const col =
            startCol + direction.col * index;

          grid[row][col] = phoneme;

          coordinates.push({
            row,
            col,
          });
        });

        solutions.push({
          english: word.english,
          phonemes: word.phonemes,
          coordinates,
        });

        placed = true;
      }
    }
  });

  // Build pool of phonemes for empty cells
  const phonemePool = [];

  wordData.forEach((word) => {
    word.phonemes.forEach((phoneme) => {
      if (!phonemePool.includes(phoneme)) {
        phonemePool.push(phoneme);
      }
    });
  });

  // Fallback in case list is empty
  const fillerPool =
    phonemePool.length > 0
      ? phonemePool
      : ["p", "t", "k", "æ", "ɪ", "n"];

  // Fill remaining empty cells
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (grid[row][col] === null) {
        grid[row][col] =
          fillerPool[
            Math.floor(
              Math.random() * fillerPool.length
            )
          ];
      }
    }
  }

  return {
    grid,
    solutions,
    words: wordData,
  };
}