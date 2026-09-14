# Phoneme Activity Builder

A Next.js frontend application for creating phoneme-based classroom activities for Speech Pathology students.

The application allows teachers to configure, preview, and export two activities:

* Phoneme Wordle
* Phoneme Word Search

Each activity can be downloaded as a standalone HTML file and opened directly in a normal web browser.

## Features

### Phoneme Wordle

* Enter a phoneme-based target word
* Enter the English equivalent
* Select Easy, Medium, or Hard difficulty
* Enable or disable phoneme hints
* Configure the number of guesses
* Preview the activity before generating
* Use a phoneme keyboard in the generated game
* Hover over supported phonemes for hints such as `θ → TH (as in thin)`
* Display the English equivalent when the correct answer is found
* Download the activity as a standalone HTML file

### Phoneme Word Search

* Edit five phoneme words and their English equivalents
* Select Easy, Medium, or Hard difficulty
* Configure the grid size
* Regenerate the puzzle until the teacher is satisfied with the layout
* Preview the actual generated puzzle
* Export the same previewed grid as a standalone HTML file
* Select words by dragging across the generated puzzle

Difficulty controls word placement:

* **Easy:** Words appear right or down
* **Medium:** Words may also appear diagonally
* **Hard:** Words may appear in any direction, including backwards

## Pages

The application contains five main pages:

* **Home** — introduces the application and provides access to both activity builders
* **About** — explains the project, activity features, and assessment scope
* **Wordle** — creates and previews a phoneme-based Wordle activity
* **Word Search** — creates and previews a phoneme-based Word Search activity
* **Settings** — allows the user to change the application appearance

## Theme and Responsive Design

The application supports:

* Light theme
* Dark theme
* System theme
* Theme preferences stored using cookies
* Responsive desktop, tablet, and mobile layouts
* Hamburger navigation on smaller screens

## Accessibility

Accessibility considerations include:

* Semantic HTML elements
* Keyboard-accessible controls
* Visible keyboard focus indicators
* Form labels
* ARIA labels where appropriate
* Responsive text and controls
* Phoneme hover hints
* Text-based feedback rather than relying only on colour

## Technology

This project was created using:

* Next.js
* React
* JavaScript
* CSS
* HTML

The project was originally created with:

```bash
npx create-next-app .
```

## Running the Project

Install the project dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Standalone HTML Output

The React application acts as the teacher-facing activity builder.

When the teacher selects **Generate HTML**, the application creates a standalone `.html` file containing the playable activity.

The generated file does not require:

* Next.js
* React
* npm
* a database
* a web server

It can be opened directly in a normal web browser.

## Assessment 1 Scope

Assessment 1 focuses on frontend design, usability, accessibility, responsive design, React component structure, and standalone activity generation.

Database-driven word lists and more advanced dynamic content are outside the scope of this assessment and are intended for later stages of the project.

## Student

**Name:** Kim Long Hoang
**Student ID:** 22666484

## Project Structure

```text
src/
├── app/
│   ├── about/
│   ├── settings/
│   ├── wordle/
│   ├── word-search/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│   ├── Footer.js
│   ├── Header.js
│   ├── MobileMenu.js
│   ├── Navbar.js
│   └── ThemeSettings.js
│
└── functions/
    ├── generateHTML.js
    └── generateWordSearchGrid.js
```
