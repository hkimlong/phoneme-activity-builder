const { test, expect } = require("@playwright/test");

test("user can generate a saved Wordle activity as HTML", async ({
  page,
}) => {
  await page.goto("/wordle");

  // -------------------------
  // CREATE ACTIVITY FOR TEST
  // -------------------------

  await page.getByLabel("Phoneme Word:").fill("t ɛ s t");
  await page.getByLabel("English Word:").fill("playwrightgame");

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

  // -------------------------
  // SELECT SAVED ACTIVITY
  // -------------------------

  await page
    .getByLabel("Saved Activity:")
    .selectOption({ label: "playwrightgame Wordle" });

  // Confirm saved data is loaded into the builder.

  await expect(
    page.getByLabel("English Word:")
  ).toHaveValue("playwrightgame");

  await expect(
    page.getByLabel("Number of Guesses:")
  ).toHaveValue("6");

  // -------------------------
  // GENERATE HTML
  // -------------------------

  const downloadPromise = page.waitForEvent("download");

  await page
    .getByRole("button", { name: "Generate HTML" })
    .click();

  const download = await downloadPromise;

  // Confirm the correct standalone HTML file was generated.

  expect(download.suggestedFilename()).toBe(
    "phoneme-wordle.html"
  );

  // -------------------------
  // DELETE TEST ACTIVITY
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
  ).not.toContainText("playwrightgame Wordle");
});
