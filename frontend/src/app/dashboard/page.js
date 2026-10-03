"use client";

import { useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4080";

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/health`);

      if (!response.ok) {
        throw new Error("Could not load dashboard data");
      }

      const data = await response.json();

      setHealthData(data);
    } catch (error) {
      console.error("Failed to load dashboard:", error);
      setError(
        "Dashboard data could not be loaded. Please try again."
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
        <p>Loading dashboard data...</p>
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
            Monitor activity creation, usage, generation results and
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
            <h3>Wordle Activities Created</h3>
            <p className="dashboard-value">
              {metrics.wordleCreated}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Word Search Activities Created</h3>
            <p className="dashboard-value">
              {metrics.wordSearchCreated}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Wordle Uses</h3>
            <p className="dashboard-value">
              {metrics.wordleUsage}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Word Search Uses</h3>
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
            <h3>Most-Used Activity</h3>
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
            <h3>Successful Generations</h3>
            <p className="dashboard-value">
              {metrics.successfulGenerations}
            </p>
          </article>

          <article className="dashboard-card">
            <h3>Failed Generations</h3>
            <p className="dashboard-value">
              {metrics.failedGenerations}
            </p>
          </article>
        </div>
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