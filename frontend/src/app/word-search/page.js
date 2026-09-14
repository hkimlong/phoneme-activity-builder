"use client";

import { useEffect, useState } from "react";
import { generateWordSearchHTML } from "@/functions/generateHTML";
import { generateWordSearchGrid } from "@/functions/generateWordSearchGrid";

export default function WordSearchPage() {
  const [difficulty, setDifficulty] = useState("easy");
  const [gridSize, setGridSize] = useState(10);

  const [words, setWords] = useState([
    { phonemes: "tʃ ɪ n", english: "chin" },
    { phonemes: "b æ ɪ t", english: "bait" },
    { phonemes: "dʒ æ m", english: "jam" },
    { phonemes: "b æ d", english: "bad" },
    { phonemes: "ɹ ɪ ŋ", english: "ring" },
  ]);

  const [puzzle, setPuzzle] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedActivities, setSavedActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");

  useEffect(() => {
    async function loadSavedActivities() {
      try {
        const response = await fetch(
          "http://localhost:4080/api/activities?type=WORD_SEARCH"
        );

        if (!response.ok) {
          throw new Error("Could not load saved Word Search activities");
        }

        const activities = await response.json();

        setSavedActivities(activities);

        if (activities.length > 0) {
          setSelectedActivityId(activities[0].id);
        }
      } catch (error) {
        console.error(
          "Failed to load saved Word Search activities:",
          error
        );
      }
    }

    loadSavedActivities();
  }, []);

  function updateWord(index, field, value) {
    const updatedWords = [...words];

    updatedWords[index] = {
      ...updatedWords[index],
      [field]: value,
    };

    setWords(updatedWords);
  }

  function regenerateGrid() {
    const newPuzzle = generateWordSearchGrid(
      words,
      difficulty,
      gridSize
    );

    setPuzzle(newPuzzle);
  }

  return (
    <section className="builder-page">
      <div className="builder-content">

        <div className="builder-form">
          <h2>Word Search Builder</h2>

          <div className="word-list-section">
            <h3>Word List</h3>

            <p className="helper-text">
              Edit the five phoneme words and their English equivalents
              for this activity.
            </p>

            <div className="word-input-list">

              <div className="word-input-headings">
                <span>Phoneme Word</span>
                <span>English Equivalent</span>
              </div>

              {words.map((word, index) => (
                <div
                  className="word-input-row"
                  key={index}
                >
                  <input
                    type="text"
                    value={word.phonemes}
                    onChange={(e) =>
                      updateWord(index, "phonemes", e.target.value)
                    }
                    aria-label={`Phoneme word ${index + 1}`}
                  />

                  <input
                    type="text"
                    value={word.english}
                    onChange={(e) =>
                      updateWord(index, "english", e.target.value)
                    }
                    aria-label={`English equivalent ${index + 1}`}
                  />
                </div>
              ))}

            </div>
          </div>

          <fieldset className="radio-group">
            <legend>Difficulty</legend>

            <label>
              <input
                type="radio"
                name="wordSearchDifficulty"
                value="easy"
                checked={difficulty === "easy"}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Easy
            </label>

            <label>
              <input
                type="radio"
                name="wordSearchDifficulty"
                value="medium"
                checked={difficulty === "medium"}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Medium
            </label>

            <label>
              <input
                type="radio"
                name="wordSearchDifficulty"
                value="hard"
                checked={difficulty === "hard"}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Hard
            </label>
          </fieldset>

          <div className="form-row">
            <label htmlFor="gridSize">Grid Size:</label>

            <input
              id="gridSize"
              type="number"
              min="6"
              max="15"
              value={gridSize}
              onChange={(e) => setGridSize(e.target.value)}
            />
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-header word-search-preview-header">
            <h2>Live Preview</h2>

            <div className="preview-actions">

              <button
                type="button"
                className="secondary-button preview-action-button"
                onClick={regenerateGrid}
              >
                REGENERATE GRID
              </button>

              <button
                type="button"
                className="generate-button preview-action-button"
                onClick={() => {
                  if (!puzzle) {
                    alert("Please regenerate the grid before generating the HTML.");
                    return;
                  }

                  generateWordSearchHTML(
                    puzzle,
                    difficulty,
                    gridSize
                  );
                }}
              >
                Generate HTML
              </button>

            </div>
          </div>

          <div className="word-search-preview">
            <h3>Phoneme Word Search</h3>

            <p>
              <strong>Difficulty:</strong> {difficulty}
            </p>

            <p>
              <strong>Grid:</strong> {gridSize} × {gridSize}
            </p>

            <h4>Find these words:</h4>

            <div className="preview-word-list">
              {words.map((word) => (
                <span key={word.english}>
                  {word.phonemes}
                </span>
              ))}
            </div>
            {puzzle ? (
              <div
                className="word-search-grid-preview"
                style={{
                  gridTemplateColumns: `repeat(${puzzle.grid.length}, 1fr)`,
                }}
              >
                {puzzle.grid.flatMap((row, rowIndex) =>
                  row.map((phoneme, colIndex) => (
                    <div
                      className="preview-grid-cell"
                      key={`${rowIndex}-${colIndex}`}
                    >
                      {phoneme}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid-placeholder">
                Click Regenerate Grid to preview the puzzle.
              </div>
            )}
                      
          </div>
        </div>

      </div>
    </section>
  );
}

