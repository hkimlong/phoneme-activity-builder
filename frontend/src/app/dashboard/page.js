"use client";

import { useEffect, useState } from "react";
import { getActivities } from "@/functions/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4080";

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [
        healthResponse,
        wordleActivities,
        wordSearchActivities,
      ] = await Promise.all([
        fetch(`${API_URL}/health`),
        getActivities("WORDLE"),
        getActivities("WORD_SEARCH"),
      ]);

      if (!healthResponse.ok) {
        throw new Error("Could not load health data");
      }

      const health = await healthResponse.json();

      const combinedActivities = [
        ...wordleActivities,
        ...wordSearchActivities,
      ].sort(
        (a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
      );

      setHealthData(health);
      setActivities(combinedActivities);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setError(
        "Activity Overview data could not be loaded. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="dashboard-page">
        <h1>Activity Overview</h1>
        <p>Loading activity data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="dashboard-page">
        <h1>Activity Overview</h1>

        <div className="dashboard-error" role="alert">
          <p>{error}</p>

          <button
            type="button"
            className="dashboard-refresh-button"
            onClick={loadDashboard}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  const metrics = healthData.metrics;

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <div>
          <h1>Activity Overview</h1>

          <p>
            Monitor stored activities, usage, generation results and
            application health.
          </p>
        </div>

        <button
          type="button"
          className="dashboard-refresh-button"
          onClick={loadDashboard}
        >
          Refresh Data
        </button>
      </div>

      <section
        className="dashboard-status"
        aria-labelledby="system-status-heading"
      >
        <h2 id="system-status-heading">System Status</h2>

        <div className="status-details">
          <p>
            <strong>API Status:</strong>{" "}
            {healthData.status === "ok" ? "Online" : "Unavailable"}
          </p>

          <p>
            <strong>Database:</strong>{" "}
            {healthData.database === "connected"
              ? "Connected"
              : "Disconnected"}
          </p>
        </div>
      </section>

      <section aria-labelledby="activity-summary-heading">
        <h2 id="activity-summary-heading">Activity Summary</h2>

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h3>Wordle Activities Saved</h3>

            <p className="dashboard-value">
              {metrics.wordleCreated}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Word Search Activities Saved</h3>

            <p className="dashboard-value">
              {metrics.wordSearchCreated}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Wordle HTML Generated</h3>

            <p className="dashboard-value">
              {metrics.wordleUsage}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Word Search HTML Generated</h3>

            <p className="dashboard-value">
              {metrics.wordSearchUsage}
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="monitoring-heading">
        <h2 id="monitoring-heading">Usage and Monitoring</h2>

        <div className="dashboard-grid">
          <article className="dashboard-card">
            <h3>Most Generated Activity</h3>

            <p className="dashboard-value dashboard-value-text">
              {formatActivityType(metrics.mostUsedActivityType)}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Average Time on Page</h3>

            <p className="dashboard-value">
              {metrics.averageTimeOnPageSeconds}
              <span className="dashboard-unit"> seconds</span>
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Successful HTML Generations</h3>

            <p className="dashboard-value">
              {metrics.successfulGenerations}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Failed HTML Generations</h3>

            <p className="dashboard-value">
              {metrics.failedGenerations}
            </p>
          </article>
        </div>
      </section>

      <section
        className="dashboard-alerts"
        aria-labelledby="alerts-heading"
      >
        <h2 id="alerts-heading">Operational Alerts</h2>

        {metrics.failedGenerations > 0 ? (
          <div
            className="dashboard-alert dashboard-alert-warning"
            role="alert"
          >
            <strong>Generation Warning</strong>

            <p>
              {metrics.failedGenerations} failed activity{" "}
              {metrics.failedGenerations === 1
                ? "generation has"
                : "generations have"}{" "}
              been recorded. Review activity data and generation
              behaviour.
            </p>
          </div>
        ) : (
          <div className="dashboard-alert dashboard-alert-ok">
            <strong>System Operating Normally</strong>

            <p>
              No failed activity generations have been recorded.
            </p>
          </div>
        )}

        {activities.length === 0 && (
          <div
            className="dashboard-alert dashboard-alert-warning"
            role="alert"
          >
            <strong>No Stored Activities</strong>

            <p>
              No Wordle or Word Search activities are currently
              stored in the database.
            </p>
          </div>
        )}
      </section>

      <section
        className="stored-activities-section"
        aria-labelledby="stored-activities-heading"
      >
        <div className="stored-activities-heading">
          <div>
            <h2 id="stored-activities-heading">
              Stored Activities
            </h2>

            <p>
              Showing the 5 most recently saved activities.
            </p>
          </div>

          <p>
            <strong>Total saved activities:</strong> {activities.length}
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="dashboard-empty-message">
            <p>No stored activities are available.</p>
          </div>
        ) : (
          <div className="activity-table-wrapper">
            <table className="activity-table">
              <thead>
                <tr>
                  <th scope="col">Activity</th>
                  <th scope="col">Type</th>
                  <th scope="col">Difficulty</th>
                  <th scope="col">Stored Data</th>
                  <th scope="col">Created</th>
                </tr>
              </thead>

              <tbody>
                {activities.slice(0, 5).map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.name}</td>

                    <td>
                      {formatActivityType(activity.type)}
                    </td>

                    <td>
                      {formatDifficulty(activity.difficulty)}
                    </td>

                    <td>
                      {getActivityDetails(activity)}
                    </td>

                    <td>
                      {formatDate(activity.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  );
}

function formatActivityType(activityType) {
  if (activityType === "WORDLE") {
    return "Wordle";
  }

  if (activityType === "WORD_SEARCH") {
    return "Word Search";
  }

  if (activityType === "TIE") {
    return "Tie";
  }

  return "No usage data";
}

function formatDifficulty(difficulty) {
  if (!difficulty) {
    return "Not set";
  }

  return (
    difficulty.charAt(0) +
    difficulty.slice(1).toLowerCase()
  );
}

function getActivityDetails(activity) {
  if (activity.type === "WORDLE") {
    const word = activity.word;

    if (!word) {
      return `${activity.numberOfGuesses || 0} guesses`;
    }

    const phonemes = [...(word.phonemes || [])]
      .sort((a, b) => a.position - b.position)
      .map((phoneme) => phoneme.symbol)
      .join(" ");

    return `${word.englishWord} /${phonemes}/ · ${
      activity.numberOfGuesses || 0
    } guesses`;
  }

  if (activity.type === "WORD_SEARCH") {
    const wordCount = activity.wordList?.words?.length || 0;

    return `${activity.gridSize || 0} × ${
      activity.gridSize || 0
    } grid · ${wordCount} words`;
  }

  return "No details";
}

function formatDate(dateValue) {
  if (!dateValue) {
    return "Unknown";
  }

  return new Date(dateValue).toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}