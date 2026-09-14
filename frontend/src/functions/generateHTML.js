export function generateWordleHTML(
  phonemeWord,
  englishWord,
  difficulty,
  showHints,
  guesses
) {
  const html = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Phoneme Wordle</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 30px;
      background-color: #f5f7fa;
      color: #222;
    }

    .game {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #173f5f;
    }

    .instructions {
      text-align: center;
      margin-bottom: 30px;
    }

    .game-area {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 40px;
      align-items: start;
    }

    .grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }

    .grid-row {
      display: flex;
      gap: 8px;
    }

    .grid-cell {
      width: 60px;
      height: 60px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 2px solid #777;
      background: white;

      font-size: 1.35rem;
      font-weight: 700;
    }

    .keyboard {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .key {
      min-height: 44px;
      border: 1px solid #777;
      background: white;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
    }

    .key:hover {
      background: #e8eef3;
    }

    .key:focus-visible {
      outline: 3px solid #173f5f;
      outline-offset: 2px;
    }

    .controls {
      margin-top: 16px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .action-button {
      padding: 12px;
      font-weight: 700;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .enter-button {
      background: #173f5f;
      color: white;
    }

    .delete-button {
      background: #d9e0e7;
      color: #222;
    }

    .message {
      min-height: 30px;
      text-align: center;
      margin-top: 25px;
      font-weight: 700;
    }

    .answer {
      text-align: center;
      margin-top: 15px;
      font-size: 1.2rem;
    }

    @media (max-width: 800px) {
      .game-area {
        grid-template-columns: 1fr;
      }

      .keyboard {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    @media (max-width: 500px) {
      body {
        padding: 15px;
      }

      .grid-cell {
        width: 48px;
        height: 48px;
      }

      .keyboard {
        grid-template-columns: repeat(4, 1fr);
      }

      .key {
        font-size: 0.9rem;
      }
    }
  </style>
</head>

<body>

  <main class="game">

    <h1>Phoneme'le</h1>

    <p class="instructions">
      Select phonemes from the keyboard to guess the word.
    </p>

    <div class="game-area">

      <div>
        <div id="grid" class="grid"></div>

        <p id="message" class="message"></p>
        <p id="answer" class="answer"></p>
      </div>

      <div>
        <div id="keyboard" class="keyboard"></div>

        <div class="controls">
          <button
            type="button"
            class="action-button delete-button"
            id="deleteButton"
          >
            Delete
          </button>

          <button
            type="button"
            class="action-button enter-button"
            id="enterButton"
          >
            Enter
          </button>
        </div>
      </div>

    </div>

  </main>

  <script>
    const phonemeWord = ${JSON.stringify(phonemeWord)};
    const englishWord = ${JSON.stringify(englishWord)};
    const maxGuesses = ${JSON.stringify(Number(guesses))};
    const difficulty = ${JSON.stringify(difficulty)};
    const showHints = ${JSON.stringify(showHints)};

    const target = phonemeWord
      .trim()
      .split(/\\s+/)
      .filter(Boolean);

    const phonemeKeyboard = [
      "p", "t", "k",
      "b", "d", "g",
      "n", "m", "ŋ",
      "f", "s", "θ", "ʃ",
      "v", "z", "ð", "ʒ",
      "l", "ɹ", "w", "j",
      "h", "tʃ", "dʒ",
      "iː", "ɪ", "e", "eː",
      "æ", "ɐ", "ɐː", "ɜː",
      "ʉː", "ɔ", "oː", "ʊ",
      "æɪ", "ɑe", "oɪ", "əʉ",
      "æɔ", "ɪə", "ə"
    ];

    const hints = {
        "θ": "TH (as in thin)",
        "ð": "TH (as in then)",
        "ʃ": "SH (as in ship)",
        "tʃ": "CH (as in chin)",
        "dʒ": "J (as in jam)",
        "ŋ": "NG (as in ring)",
        "ɪ": "I (as in bid)",
        "æ": "A (as in bad)",
        "ɹ": "R (as in ring)"
        };

    let currentRow = 0;
    let currentGuess = [];
    let gameOver = false;

    const gridElement = document.getElementById("grid");
    const keyboardElement = document.getElementById("keyboard");
    const messageElement = document.getElementById("message");
    const answerElement = document.getElementById("answer");

    function buildGrid() {
      gridElement.innerHTML = "";

      for (let row = 0; row < maxGuesses; row++) {
        const rowElement = document.createElement("div");
        rowElement.className = "grid-row";

        for (let col = 0; col < target.length; col++) {
          const cell = document.createElement("div");
          cell.className = "grid-cell";
          cell.dataset.row = row;
          cell.dataset.col = col;

          rowElement.appendChild(cell);
        }

        gridElement.appendChild(rowElement);
      }
    }

    function buildKeyboard() {
      keyboardElement.innerHTML = "";

      phonemeKeyboard.forEach((phoneme) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "key";
        button.textContent = phoneme;

        if (showHints === "yes" && hints[phoneme]) {
          button.title = hints[phoneme];
          button.setAttribute(
            "aria-label",
            phoneme + ", " + hints[phoneme]
          );
        } else {
          button.setAttribute(
            "aria-label",
            "phoneme " + phoneme
          );
        }

        button.addEventListener("click", () => {
          addPhoneme(phoneme);
        });

        keyboardElement.appendChild(button);
      });
    }

    function addPhoneme(phoneme) {
      if (gameOver) return;

      if (currentGuess.length >= target.length) {
        return;
      }

      currentGuess.push(phoneme);
      updateCurrentRow();
    }

    function deletePhoneme() {
      if (gameOver) return;

      currentGuess.pop();
      updateCurrentRow();
    }

    function updateCurrentRow() {
      const row = gridElement.children[currentRow];

      if (!row) return;

      const cells = row.children;

      for (let i = 0; i < cells.length; i++) {
        cells[i].textContent = currentGuess[i] || "";
      }
    }
    function getGuessFeedback() {
        let correctPosition = 0;
        let wrongPosition = 0;

        const targetCopy = [...target];
        const guessCopy = [...currentGuess];

        // First check phonemes in the correct position
        for (let i = 0; i < target.length; i++) {
            if (guessCopy[i] === targetCopy[i]) {
            correctPosition++;
            guessCopy[i] = null;
            targetCopy[i] = null;
            }
        }

        // Then check correct phonemes in the wrong position
        for (let i = 0; i < guessCopy.length; i++) {
            if (guessCopy[i] === null) continue;

            const foundIndex = targetCopy.indexOf(guessCopy[i]);

            if (foundIndex !== -1) {
            wrongPosition++;
            targetCopy[foundIndex] = null;
            }
        }

        if (difficulty === "easy") {
            return (
            correctPosition +
            " correct position, " +
            wrongPosition +
            " correct phoneme in a different position."
            );
        }

        if (difficulty === "medium") {
            return (
            correctPosition +
            " phoneme(s) in the correct position."
            );
        }

        return "Incorrect. Try again.";
        }
    function submitGuess() {
      if (gameOver) return;

      if (currentGuess.length !== target.length) {
        messageElement.textContent =
          "Please select " + target.length + " phonemes.";
        return;
      }

      const correct =
        currentGuess.every(
          (phoneme, index) => phoneme === target[index]
        );

      if (correct) {
        messageElement.textContent = "Correct!";

        answerElement.textContent =
          "The English equivalent word is " + englishWord;

        gameOver = true;
        return;
      }
      messageElement.textContent = getGuessFeedback();
      currentRow++;

      if (currentRow >= maxGuesses) {
        messageElement.textContent =
          "No guesses remaining.";

        answerElement.textContent =
          "Answer: " +
          target.join(" ") +
          " — " +
          englishWord;

        gameOver = true;
        return;
      }

      currentGuess = [];
      
    }

    document
      .getElementById("deleteButton")
      .addEventListener("click", deletePhoneme);

    document
      .getElementById("enterButton")
      .addEventListener("click", submitGuess);

    buildGrid();
    buildKeyboard();
  </script>

</body>

</html>
  `;

  const blob = new Blob([html], {
    type: "text/html",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "phoneme-wordle.html";

  link.click();

  URL.revokeObjectURL(url);
}

export function generateWordSearchHTML(puzzle, difficulty, gridSize) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Phoneme Word Search</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, Helvetica, sans-serif;
      margin: 0;
      padding: 30px;
      background: #f5f7fa;
      color: #222;
    }

    .game {
      max-width: 900px;
      margin: 0 auto;
    }

    h1 {
      text-align: center;
      color: #173f5f;
    }

    .instructions {
      text-align: center;
      margin-bottom: 25px;
    }

    .word-list {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
      margin-bottom: 25px;
    }

    .word-item {
      padding: 10px 16px;
      border: 1px solid #bbb;
      border-radius: 5px;
      background: white;
      font-weight: 700;
      font-size: 1.2rem;
    }

    .grid {
      display: grid;
      gap: 3px;
      justify-content: center;
      margin: 0 auto;
    }

    .cell {
      width: 42px;
      height: 42px;

      display: flex;
      align-items: center;
      justify-content: center;

      border: 1px solid #bbb;
      background: white;

      font-weight: 700;
      cursor: pointer;
      user-select: none;
    }

    .cell.highlighted {
      background: #fef08a;
    }

    .cell.found {
      background: #bbf7d0;
    }

    .word-item.found {
      text-decoration: line-through;
      color: #777;
    }

    .message {
      text-align: center;
      margin-top: 20px;
      font-weight: 700;
    }

    @media (max-width: 600px) {
      body {
        padding: 15px;
      }

      .cell {
        width: 34px;
        height: 34px;
        font-size: 0.9rem;
      }
    }
  </style>
</head>

<body>

  <main class="game">

    <h1>Phoneme Word Search</h1>

    <p class="instructions">
      Find the phoneme words hidden in the grid.
    </p>

    <div id="wordList" class="word-list"></div>

    <div id="grid" class="grid"></div>

    <p id="message" class="message"></p>

  </main>

  <script>
    const puzzle = ${JSON.stringify(puzzle)};
    const difficulty = ${JSON.stringify(difficulty)};
    const size = ${JSON.stringify(Number(gridSize))};

    const wordData = puzzle.words.map((word) => ({
    english: word.english,
    phonemes: word.phonemes,
    found: false
    }));

    const grid = puzzle.grid;

    const solutions = puzzle.solutions;

    let selecting = false;
    let startCell = null;

    const gridElement = document.getElementById("grid");
    const wordListElement = document.getElementById("wordList");
    const messageElement = document.getElementById("message");



    function renderGrid() {
      gridElement.innerHTML = "";

      gridElement.style.gridTemplateColumns =
        "repeat(" + size + ", 42px)";

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const cell =
            document.createElement("div");

          cell.className = "cell";

          cell.dataset.row = row;
          cell.dataset.col = col;

          cell.textContent = grid[row][col];

          gridElement.appendChild(cell);
        }
      }
    }

    function renderWordList() {
      wordListElement.innerHTML = "";

      wordData.forEach((word, index) => {
        const item =
          document.createElement("div");

        item.className = "word-item";
        item.id = "word-" + index;

        item.textContent =
          word.phonemes.join(" ");

        wordListElement.appendChild(item);
      });
    }

    function getPath(cellA, cellB) {
      const row1 =
        Number(cellA.dataset.row);

      const col1 =
        Number(cellA.dataset.col);

      const row2 =
        Number(cellB.dataset.row);

      const col2 =
        Number(cellB.dataset.col);

      const rowDifference = row2 - row1;
      const colDifference = col2 - col1;

      if (
        rowDifference !== 0 &&
        colDifference !== 0 &&
        Math.abs(rowDifference) !==
          Math.abs(colDifference)
      ) {
        return null;
      }

      const steps =
        Math.max(
          Math.abs(rowDifference),
          Math.abs(colDifference)
        );

      const rowStep =
        steps === 0
          ? 0
          : rowDifference / steps;

      const colStep =
        steps === 0
          ? 0
          : colDifference / steps;

      const path = [];

      for (let i = 0; i <= steps; i++) {
        path.push({
          row: row1 + rowStep * i,
          col: col1 + colStep * i
        });
      }

      return path;
    }

    function highlightPath(start, end) {
      clearHighlights();

      const path = getPath(start, end);

      if (!path) return;

      path.forEach((position) => {
        const cell =
          document.querySelector(
            '[data-row="' +
              position.row +
              '"][data-col="' +
              position.col +
              '"]'
          );

        if (cell) {
          cell.classList.add("highlighted");
        }
      });
    }

    function clearHighlights() {
      document
        .querySelectorAll(".cell.highlighted")
        .forEach((cell) => {
          cell.classList.remove("highlighted");
        });
    }

    function checkSelection(endCell) {
      const path =
        getPath(startCell, endCell);

      if (!path) {
        clearHighlights();
        return;
      }

      const selected = path.map(
        (position) =>
          grid[position.row][position.col]
      );

      const selectedForward =
        selected.join("");

      const selectedBackward =
        [...selected].reverse().join("");

      wordData.forEach((word, index) => {
        if (word.found) return;

        const target =
          word.phonemes.join("");

        if (
          target === selectedForward ||
          target === selectedBackward
        ) {
          word.found = true;

          path.forEach((position) => {
            const cell =
              document.querySelector(
                '[data-row="' +
                  position.row +
                  '"][data-col="' +
                  position.col +
                  '"]'
              );

            if (cell) {
              cell.classList.add("found");
            }
          });

          document
            .getElementById("word-" + index)
            .classList.add("found");
        }
      });

      clearHighlights();

      if (
        wordData.every((word) => word.found)
      ) {
        messageElement.textContent =
          "Great work! You found all the words.";
      }
    }

    gridElement.addEventListener(
      "mousedown",
      (event) => {
        if (
          !event.target.classList.contains("cell")
        ) {
          return;
        }

        selecting = true;
        startCell = event.target;

        highlightPath(
          startCell,
          startCell
        );
      }
    );

    gridElement.addEventListener(
      "mouseover",
      (event) => {
        if (
          selecting &&
          event.target.classList.contains("cell")
        ) {
          highlightPath(
            startCell,
            event.target
          );
        }
      }
    );

    window.addEventListener(
      "mouseup",
      (event) => {
        if (!selecting) return;

        selecting = false;

        if (
          event.target.classList.contains("cell")
        ) {
          checkSelection(event.target);
        } else {
          clearHighlights();
        }
      }
    );

    
    renderGrid();
    renderWordList();

  </script>

</body>
</html>
  `;

  const blob = new Blob([html], {
    type: "text/html",
  });

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    "phoneme-word-search.html";

  link.click();

  URL.revokeObjectURL(url);
}