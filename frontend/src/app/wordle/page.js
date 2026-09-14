"use client";

import { useState } from "react";
import { generateWordleHTML } from "@/functions/generateHTML";

export default function WordlePage() {
  const [phonemeWord, setPhonemeWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [showHints, setShowHints] = useState("yes");
  const [guesses, setGuesses] = useState(6);
  const [saveMessage, setSaveMessage] = useState("");

  const phonemes = phonemeWord
    .trim()
    .split(/\s+/)
    .filter((item) => item.length > 0);

async function saveWordleActivity() {
  try {
    setSaveMessage("");

    if (!englishWord.trim()) {
      setSaveMessage("Please enter an English word.");
      return;
    }

    if (phonemes.length === 0) {
      setSaveMessage("Please enter at least one phoneme.");
      return;
    }

    // Get the available word lists.
    const wordListResponse = await fetch(
      "http://localhost:4080/api/word-lists"
    );

    if (!wordListResponse.ok) {
      throw new Error("Could not load word lists");
    }

    const wordLists = await wordListResponse.json();

    if (wordLists.length === 0) {
      setSaveMessage("Please create a word list first.");
      return;
    }

    const wordListId = wordLists[0].id;

    // Save the English word and its phonemes.
    const wordResponse = await fetch(
      "http://localhost:4080/api/words",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          englishWord: englishWord.trim(),
          phonemes: phonemes,
          wordListId: wordListId,
        }),
      }
    );

    if (!wordResponse.ok) {
      throw new Error("Could not save word");
    }

    // Save the Wordle activity configuration.
    const activityResponse = await fetch(
      "http://localhost:4080/api/activities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${englishWord.trim()} Wordle`,
          type: "WORDLE",
          difficulty: difficulty.toUpperCase(),
          showHints: showHints === "yes",
          numberOfGuesses: Number(guesses),
          wordListId: wordListId,
        }),
      }
    );

    if (!activityResponse.ok) {
      throw new Error("Could not save activity");
    }

    setSaveMessage("Wordle activity saved successfully.");
  } catch (error) {
    console.error("Failed to save Wordle activity:", error);
    setSaveMessage("Failed to save Wordle activity.");
  }
}

  return (
    <section className="builder-page">
      <div className="builder-content">

        <div className="builder-form">
          <h2>Wordle Builder</h2>

          <div className="form-row">
            <label htmlFor="phonemeWord">Phoneme Word:</label>

            <input
              id="phonemeWord"
              type="text"
              value={phonemeWord}
              onChange={(e) => setPhonemeWord(e.target.value)}
              placeholder="e.g. θ ɪ n"
            />
          </div>

          <div className="form-row">
            <label htmlFor="englishWord">English Word:</label>

            <input
              id="englishWord"
              type="text"
              value={englishWord}
              onChange={(e) => setEnglishWord(e.target.value)}
              placeholder="e.g. thin"
            />
          </div>

          <fieldset className="radio-group">
            <legend>Difficulty</legend>

            <label>
              <input
                type="radio"
                name="difficulty"
                value="easy"
                checked={difficulty === "easy"}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Easy
            </label>

            <label>
              <input
                type="radio"
                name="difficulty"
                value="medium"
                checked={difficulty === "medium"}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Medium
            </label>

            <label>
              <input
                type="radio"
                name="difficulty"
                value="hard"
                checked={difficulty === "hard"}
                onChange={(e) => setDifficulty(e.target.value)}
              />
              Hard
            </label>
          </fieldset>

          <fieldset className="radio-group">
            <legend>Show hints</legend>

            <label>
              <input
                type="radio"
                name="hints"
                value="yes"
                checked={showHints === "yes"}
                onChange={(e) => setShowHints(e.target.value)}
              />
              Yes
            </label>

            <label>
              <input
                type="radio"
                name="hints"
                value="no"
                checked={showHints === "no"}
                onChange={(e) => setShowHints(e.target.value)}
              />
              No
            </label>
          </fieldset>

          <div className="form-row">
            <label htmlFor="guesses">Number of Guesses:</label>

            <input
              id="guesses"
              type="number"
              min="1"
              max="10"
              value={guesses}
              onChange={(e) => setGuesses(e.target.value)}
            />
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-header">
            <h2>Live Preview</h2>

            <button
              type="button"
              className="generate-button"
              onClick={() =>
                generateWordleHTML(
                  phonemeWord,
                  englishWord,
                  difficulty,
                  showHints,
                  guesses
                )
              }
            >
              Generate HTML
            </button>

	   <button
 	     type="button"
  	     className="generate-button"
             onClick={saveWordleActivity}
           >
            Save Activity
           </button>
	   {saveMessage && <p>{saveMessage}</p>}
          </div>

          <div className="wordle-preview">
            <h3>Phoneme&apos;le</h3>

            <p className="preview-label">
              Target phoneme word
            </p>

            <div className="phoneme-preview-row">
              {phonemes.map((phoneme, index) => (
                <div
                  className="phoneme-preview-cell"
                  key={`${phoneme}-${index}`}
                >
                  {phoneme}
                </div>
              ))}
            </div>

            <div className="preview-details">
              <p>
                <strong>English:</strong> {englishWord || "Not set"}
              </p>

              <p>
                <strong>Difficulty:</strong> {difficulty}
              </p>

              <p>
                <strong>Hints:</strong> {showHints}
              </p>

              <p>
                <strong>Guesses:</strong> {guesses}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}