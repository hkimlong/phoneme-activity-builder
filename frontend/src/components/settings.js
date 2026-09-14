"use client";

import { useEffect, useState } from "react";

export default function ThemeSettings() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = getCookie("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    }
  }, []);

  function getCookie(name) {
    const cookies = document.cookie.split("; ");

    const cookie = cookies.find((item) =>
      item.startsWith(name + "=")
    );

    if (!cookie) {
      return null;
    }

    return cookie.split("=")[1];
  }

  function applyTheme(selectedTheme) {
    const root = document.documentElement;

    if (selectedTheme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      root.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light"
      );

      return;
    }

    root.setAttribute("data-theme", selectedTheme);
  }

  function changeTheme(selectedTheme) {
    setTheme(selectedTheme);

    document.cookie =
      `theme=${selectedTheme}; path=/; max-age=31536000; SameSite=Lax`;

    applyTheme(selectedTheme);
  }

  return (
    <div className="theme-settings">

      <h2>Appearance</h2>

      <p className="settings-description">
        Choose how the activity builder appears.
        Your preference will be saved automatically.
      </p>

      <fieldset className="theme-options">
        <legend>Theme</legend>

        <label className="theme-option">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === "light"}
            onChange={() => changeTheme("light")}
          />

          <span>
            <strong>Light</strong>
            <small>Use a light background.</small>
          </span>
        </label>

        <label className="theme-option">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === "dark"}
            onChange={() => changeTheme("dark")}
          />

          <span>
            <strong>Dark</strong>
            <small>Use a dark background.</small>
          </span>
        </label>

        <label className="theme-option">
          <input
            type="radio"
            name="theme"
            value="system"
            checked={theme === "system"}
            onChange={() => changeTheme("system")}
          />

          <span>
            <strong>System</strong>
            <small>Match your device appearance.</small>
          </span>
        </label>

      </fieldset>

    </div>
  );
}