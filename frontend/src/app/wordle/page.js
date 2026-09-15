"use client";

import {
  getWordLists,
  getActivities,
  createWord,
  createActivity,
  deleteActivity,
  updateActivity,
  updateWord,
} from "@/functions/api";
import { useEffect, useState } from "react";
import { generateWordleHTML } from "@/functions/generateHTML";


export default function WordlePage() {
  const [phonemeWord, setPhonemeWord] = useState("");
  const [englishWord, setEnglishWord] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [showHints, setShowHints] = useState("yes");
  const [guesses, setGuesses] = useState(6);
  const [saveMessage, setSaveMessage] = useState("");
  const [savedActivities, setSavedActivities] = useState([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");

  const phonemes = phonemeWord
    .trim()
    .split(/\s+/)
    .filter((item) => item.length > 0);

useEffect(() => {
  async function loadSavedActivities() {
    try {
      const activities = await getActivities("WORDLE");

      setSavedActivities(activities);
      setSelectedActivityId("");
    } catch (error) {
      console.error(
        "Failed to load saved Wordle activities:",
        error
      );
    }
  }

  loadSavedActivities();
}, []); 

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
    const wordLists = await getWordLists();

    if (wordLists.length === 0) {
      setSaveMessage("Please create a word list first.");
      return;
    }

    const wordListId = wordLists[0].id;

    // Save the English word and its phonemes.
    const savedWord = await createWord({
     englishWord: englishWord.trim(),
     phonemes: phonemes,
     wordListId: wordListId,
    });

    // Save the Wordle activity configuration.
    const savedActivity = await createActivity({
     name: `${englishWord.trim()} Wordle`,
     type: "WORDLE",
     difficulty: difficulty.toUpperCase(),
     showHints: showHints === "yes",
     numberOfGuesses: Number(guesses),
     wordListId: wordListId,
     wordId: savedWord.id,
    });

    setSavedActivities((currentActivities) => [
      savedActivity,
      ...currentActivities,
    ]);

    setSelectedActivityId(savedActivity.id);

    setSaveMessage("Wordle activity saved successfully.");
  } catch (error) {
    console.error(
      "Failed to save Wordle activity:",
      error
    );

    setSaveMessage(error.message);
  }
}

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

      if (nextActivity.word) {
        setEnglishWord(nextActivity.word.englishWord);

        setPhonemeWord(
          [...nextActivity.word.phonemes]
            .sort((a, b) => a.position - b.position)
            .map((phoneme) => phoneme.symbol)
            .join(" ")
        );
      }

      setDifficulty(
        nextActivity.difficulty.toLowerCase()
      );

      setShowHints(
        nextActivity.showHints ? "yes" : "no"
      );

      setGuesses(
        nextActivity.numberOfGuesses ?? 6
      );
    } else {
      setSelectedActivityId("");
    }

    setSaveMessage(
      "Wordle activity deleted successfully."
    );
  } catch (error) {
    console.error(
      "Failed to delete Wordle activity:",
      error
    );

    setSaveMessage(
      "Failed to delete Wordle activity."
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

    const selectedActivity = savedActivities.find(
      (activity) => activity.id === selectedActivityId
    );

    if (!selectedActivity) {
      setSaveMessage(
        "Could not find the selected activity."
      );
      return;
    }

    if (!selectedActivity.word) {
      setSaveMessage(
        "The selected activity does not contain a saved word."
      );
      return;
    }

    if (!englishWord.trim()) {
      setSaveMessage(
        "Please enter the English equivalent."
      );
      return;
    }

    const phonemes = phonemeWord
      .trim()
      .split(/\s+/)
      .filter((item) => item.length > 0);

    if (phonemes.length === 0) {
      setSaveMessage(
        "Please enter a phoneme word."
      );
      return;
    }

    await updateWord({
      id: selectedActivity.word.id,
      englishWord: englishWord.trim(),
      phonemes: phonemes,
      wordListId: selectedActivity.word.wordListId,
    });

    await updateActivity({
      id: selectedActivityId,
      name: `${englishWord.trim()} Wordle`,
      type: "WORDLE",
      difficulty: difficulty.toUpperCase(),
      showHints: showHints === "yes",
      numberOfGuesses: Number(guesses),
      wordId: selectedActivity.word.id,
    });

    const refreshedActivities = await getActivities("WORDLE");

    setSavedActivities(refreshedActivities);

    const refreshedActivity = refreshedActivities.find(
      (activity) => activity.id === selectedActivityId
    );

    if (refreshedActivity && refreshedActivity.word) {
      setEnglishWord(
        refreshedActivity.word.englishWord
      );

      setPhonemeWord(
        [...refreshedActivity.word.phonemes]
          .sort((a, b) => a.position - b.position)
          .map((phoneme) => phoneme.symbol)
          .join(" ")
      );

      setDifficulty(
        refreshedActivity.difficulty.toLowerCase()
      );

      setShowHints(
        refreshedActivity.showHints ? "yes" : "no"
      );

      setGuesses(
        refreshedActivity.numberOfGuesses ?? 6
      );
    }

    setSaveMessage(
      "Wordle activity updated successfully."
    );
  } catch (error) {
    console.error(
      "Failed to update Wordle activity:",
      error
    );

    setSaveMessage(error.message);
  }
}

function loadActivityIntoPreview(activityId) {
  setSelectedActivityId(activityId);

  const activity = savedActivities.find(
    (item) => item.id === activityId
  );

  if (!activity) {
    return;
  }

  if (!activity.word) {
    setSaveMessage(
      "This older activity is not linked to a specific word."
    );
    return;
  }

  const phonemeText = activity.word.phonemes
    .sort((a, b) => a.position - b.position)
    .map((phoneme) => phoneme.symbol)
    .join(" ");

  setPhonemeWord(phonemeText);
  setEnglishWord(activity.word.englishWord);
  setDifficulty(activity.difficulty.toLowerCase());
  setShowHints(activity.showHints ? "yes" : "no");
  setGuesses(activity.numberOfGuesses ?? 6);

  setSaveMessage("");
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

          <div className="form-row">
            <label htmlFor="savedActivity">Saved Activity:</label>

            <select
              id="savedActivity"
              value={selectedActivityId}
              onChange={(e) =>
                loadActivityIntoPreview(e.target.value)
              }
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

        </div>

        <div className="preview-panel">
          <div className="preview-header">
            <h2>Live Preview</h2>

            <button
              type="button"
              className="generate-button"
              onClick={async () => {
                try {
                  const activities = await getActivities("WORDLE");

                  if (activities.length === 0) {
                    alert("No saved Wordle activity found.");
                    return;
                  }

                  const savedActivity = activities.find(
                    (activity) => activity.id === selectedActivityId
                  );

                  if (!savedActivity) {
                    alert("Please select a saved Wordle activity.");
                    return;
                  }

                if (!savedActivity.word) {
                    alert(
                      "This older activity is not linked to a specific word. Please save a new activity."
                    );
                    return;
                  }

                  const savedWord = savedActivity.word;

                  const savedPhonemeWord = savedWord.phonemes
                    .sort((a, b) => a.position - b.position)
                    .map((phoneme) => phoneme.symbol)
                    .join(" ");

                  generateWordleHTML(
                    savedPhonemeWord,
                    savedWord.englishWord,
                    savedActivity.difficulty.toLowerCase(),
                    savedActivity.showHints ? "yes" : "no",
                    savedActivity.numberOfGuesses
                  );
                } catch (error) {
                  console.error(error);
                  alert("Failed to generate Wordle HTML from saved data.");
                }
              }}
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

           <button
            type="button"
            className="secondary-button preview-action-button"
            onClick={updateSavedActivity}
          >
            UPDATE ACTIVITY
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