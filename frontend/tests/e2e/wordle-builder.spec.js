const { test, expect } = require("@playwright/test");

test("teacher can create, update and delete a Wordle activity", async ({
  page,
}) => {
  await page.goto("/wordle");

  // -------------------------
  // CREATE
  // -------------------------

  await page.getByLabel("Phoneme Word:").fill("t ɛ s t");
  await page.getByLabel("English Word:").fill("playwrighttest");

  await page
    .getByRole("radio", { name: "Easy" })
    .check();

  await page
    .getByRole("radio", { name: "Yes" })
    .check();

  await page.getByLabel("Number of Guesses:").fill("6");

  await page
    .getByRole("button", { name: "Save Activity" })
    .click();

  await expect(
    page.getByText("Wordle activity saved successfully.")
  ).toBeVisible();

  await expect(
    page.getByLabel("Saved Activity:")
  ).toContainText("playwrighttest Wordle");

  // -------------------------
  // UPDATE
  // -------------------------

  await page
    .getByLabel("Saved Activity:")
    .selectOption({ label: "playwrighttest Wordle" });

  await page
    .getByRole("radio", { name: "Medium" })
    .check();

  await page.getByLabel("Number of Guesses:").fill("8");

  await page
    .getByRole("button", { name: "UPDATE ACTIVITY" })
    .click();

  await expect(
    page.getByText(/updated/i)
  ).toBeVisible();

  await expect(
    page.getByRole("radio", { name: "Medium" })
  ).toBeChecked();

  await expect(
    page.getByLabel("Number of Guesses:")
  ).toHaveValue("8");

  // -------------------------
  // DELETE
  // -------------------------

  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    await dialog.accept();
  });

  await page
    .getByRole("button", {
      name: "DELETE SAVED ACTIVITY",
    })
    .click();

  await expect(
    page.getByLabel("Saved Activity:")
  ).not.toContainText("playwrighttest Wordle");
});
