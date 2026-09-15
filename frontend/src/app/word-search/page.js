"use client";

import { useEffect, useState } from "react";
import { generateWordSearchHTML } from "@/functions/generateHTML";
import { generateWordSearchGrid } from "@/functions/generateWordSearchGrid";
import {
  getActivities,
  createWordList,
  createWord,
  createActivity,
  deleteActivity,
  updateActivity,
  updateWord as updateSavedWord,
} from "@/functions/api";

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
        const activities = await getActivities("WORD_SEARCH");

        setSavedActivities(activities);
        setSelectedActivityId("");
        
      } catch (error) {
        console.error(
          "Failed to load saved Word Search activities:",
          error
        );
      }
    }

    loadSavedActivities();
  }, []);

  async function deleteSavedActivity() {
    try {
      if (!selectedActivityId) {
        setSaveMessage(
          "Please select a saved activity to delete."
        );
        return;
      }

      const selectedActivity = savedActivities.find(
        (activity) => activity.id === selectedActivityId
      );

      if (!selectedActivity) {
        setSaveMessage(
          "Could not find the selected activity."
        );
        return;
      }

      const confirmed = window.confirm(
        `Delete "${selectedActivity.name}"?`
      );

      if (!confirmed) {
        return;
      }

      await deleteActivity(selectedActivityId);

      const remainingActivities = savedActivities.filter(
        (activity) => activity.id !== selectedActivityId
      );

      setSavedActivities(remainingActivities);

      if (remainingActivities.length > 0) {
        const nextActivity = remainingActivities[0];

        setSelectedActivityId(nextActivity.id);

        const loadedWords = nextActivity.wordList.words.map((word) => ({
          english: word.englishWord,
          phonemes: [...word.phonemes]
            .sort((a, b) => a.position - b.position)
            .map((phoneme) => phoneme.symbol)
            .join(" "),
        }));

        setWords(loadedWords);
        setDifficulty(nextActivity.difficulty.toLowerCase());
        setGridSize(nextActivity.gridSize ?? 10);
        setPuzzle(nextActivity.puzzleData ?? null);
      } else {
        setSelectedActivityId("");
        setPuzzle(null);
      }

      setSaveMessage(
        "Word Search activity deleted successfully."
      );
    } catch (error) {
      console.error(
        "Failed to delete Word Search activity:",
        error
      );

      setSaveMessage(
        "Failed to delete Word Search activity."
      );
    }
  }

  async function updateSavedActivity() {
    try {
      setSaveMessage("");

      if (!selectedActivityId) {
        setSaveMessage(
          "Please select a saved activity to update."
        );
        return;
      }

      if (!puzzle) {
        setSaveMessage(
          "Please regenerate the grid before updating the activity."
        );
        return;
      }

      const selectedActivity = savedActivities.find(
        (activity) => activity.id === selectedActivityId
      );

      if (!selectedActivity) {
        setSaveMessage(
          "Could not find the selected activity."
        );
        return;
      }

      if (
        !selectedActivity.wordList ||
        !selectedActivity.wordList.words
      ) {
        setSaveMessage(
          "The selected activity does not contain a word list."
        );
        return;
      }

      const cleanedWords = words.map((word) => ({
        english: word.english.trim(),
        phonemes: word.phonemes
          .trim()
          .split(/\s+/)
          .filter((item) => item.length > 0),
      }));

      const hasInvalidWord = cleanedWords.some(
        (word) =>
          word.english.length === 0 ||
          word.phonemes.length === 0
      );

      if (hasInvalidWord) {
        setSaveMessage(
          "Please enter a phoneme word and English equivalent for all five words."
        );
        return;
      }

      const savedWords = selectedActivity.wordList.words;

      if (savedWords.length !== cleanedWords.length) {
        setSaveMessage(
          "The saved activity does not contain the expected number of words."
        );
        return;
      }

      for (let index = 0; index < cleanedWords.length; index++) {
        await updateSavedWord({
          id: savedWords[index].id,
          englishWord: cleanedWords[index].english,
          phonemes: cleanedWords[index].phonemes,
          wordListId: selectedActivity.wordListId,
        });
      }

      await updateActivity({
        id: selectedActivityId,
        name: selectedActivity.name,
        type: "WORD_SEARCH",
        difficulty: difficulty.toUpperCase(),
        showHints: true,
        gridSize: Number(gridSize),
        puzzleData: puzzle,
      });

      const refreshedActivities = await getActivities(
        "WORD_SEARCH"
      );

      setSavedActivities(refreshedActivities);

      const refreshedActivity = refreshedActivities.find(
        (activity) => activity.id === selectedActivityId
      );

      if (refreshedActivity) {
        const loadedWords = refreshedActivity.wordList.words.map(
          (word) => ({
            english: word.englishWord,
            phonemes: [...word.phonemes]
              .sort((a, b) => a.position - b.position)
              .map((phoneme) => phoneme.symbol)
              .join(" "),
          })
        );

        setWords(loadedWords);
        setDifficulty(
          refreshedActivity.difficulty.toLowerCase()
        );
        setGridSize(refreshedActivity.gridSize ?? 10);
        setPuzzle(refreshedActivity.puzzleData ?? null);
      }

      setSaveMessage(
        "Word Search activity updated successfully."
      );
    } catch (error) {
      console.error(
        "Failed to update Word Search activity:",
        error
      );

      setSaveMessage(
        "Failed to update Word Search activity."
      );
    }
  }

  async function saveWordSearchActivity() {
   try {
    setSaveMessage("");

    if (!puzzle) {
      setSaveMessage(
        "Please regenerate the grid before saving the activity."
      );
      return;
    }

    const cleanedWords = words.map((word) => ({
      english: word.english.trim(),
      phonemes: word.phonemes
        .trim()
        .split(/\s+/)
        .filter((item) => item.length > 0),
    }));

    const hasInvalidWord = cleanedWords.some(
      (word) =>
        word.english.length === 0 ||
        word.phonemes.length === 0
    );

    if (hasInvalidWord) {
      setSaveMessage(
        "Please enter a phoneme word and English equivalent for all five words."
      );
      return;
    }

    const savedWordList = await createWordList(
      `Word Search ${new Date().toLocaleString()}`
    );

    for (const word of cleanedWords) {
      await createWord({
        englishWord: word.english,
        phonemes: word.phonemes,
        wordListId: savedWordList.id,
      });
    }

    const savedActivity = await createActivity({
      name: `Word Search ${new Date().toLocaleString()}`,
      type: "WORD_SEARCH",
      difficulty: difficulty.toUpperCase(),
      showHints: true,
      gridSize: Number(gridSize),
      puzzleData: puzzle,
      wordListId: savedWordList.id,
    });

    setSavedActivities((currentActivities) => [
      savedActivity,
      ...currentActivities,
    ]);

    setSelectedActivityId(savedActivity.id);

    setSaveMessage(
      "Word Search activity saved successfully."
    );
  } catch (error) {
    console.error(
      "Failed to save Word Search activity:",
      error
    );

    setSaveMessage(
      "Failed to save Word Search activity."
    );
  }
  }

  function loadSavedActivity(activityId) {
    setSelectedActivityId(activityId);

    const activity = savedActivities.find(
      (item) => item.id === activityId
    );

    if (!activity) {
      return;
    }

    if (!activity.wordList || !activity.wordList.words) {
      setSaveMessage(
        "The saved activity does not contain a word list."
      );
      return;
    }

    const loadedWords = activity.wordList.words.map((word) => ({
      english: word.englishWord,
      phonemes: [...word.phonemes]
        .sort((a, b) => a.position - b.position)
        .map((phoneme) => phoneme.symbol)
        .join(" "),
    }));

    setWords(loadedWords);
    setDifficulty(activity.difficulty.toLowerCase());
    setGridSize(activity.gridSize ?? 10);
    setPuzzle(activity.puzzleData ?? null);
    setSaveMessage("");
  }

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

          <div className="form-row">
            <label htmlFor="savedActivity">Saved Activity:</label>

            <select
              id="savedActivity"
              value={selectedActivityId}
              onChange={(e) => loadSavedActivity(e.target.value)}
            >
              <option value="">
                Select a saved activity
              </option>

              {savedActivities.map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <button
              type="button"
              className="secondary-button"
              onClick={deleteSavedActivity}
              
            >
              DELETE SAVED ACTIVITY
            </button>
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
                className="secondary-button preview-action-button"
                onClick={saveWordSearchActivity}
              >
                SAVE ACTIVITY
              </button>

              <button
                type="button"
                className="secondary-button preview-action-button"
                onClick={updateSavedActivity}
              >
                UPDATE ACTIVITY
              </button>

              <button
                type="button"
                className="generate-button preview-action-button"
                onClick={async () => {
                  try {
                    if (!selectedActivityId) {
                      alert(
                        "Please save or select a Word Search activity before generating the HTML."
                      );
                      return;
                    }

                    const activities = await getActivities("WORD_SEARCH");

                    const savedActivity = activities.find(
                      (activity) => activity.id === selectedActivityId
                    );

                    if (!savedActivity) {
                      alert(
                        "Could not find the selected Word Search activity."
                      );
                      return;
                    }

                    if (!savedActivity.puzzleData) {
                      alert(
                        "This activity does not have a saved grid. Please regenerate the grid and save a new activity."
                      );
                      return;
                    }

                    generateWordSearchHTML(
                      savedActivity.puzzleData,
                      savedActivity.difficulty.toLowerCase(),
                      savedActivity.gridSize
                    );
                  } catch (error) {
                    console.error(
                      "Failed to generate Word Search HTML:",
                      error
                    );

                    alert(
                      "Failed to generate the Word Search HTML."
                    );
                  }
                }}
              >
                Generate HTML
              </button>

            </div>

            {saveMessage && (
              <p className="helper-text">
                {saveMessage}
              </p>
            )}
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

