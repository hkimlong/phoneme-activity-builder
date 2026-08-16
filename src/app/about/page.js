export default function AboutPage() {
  return (
    <section className="about-page">

      <div className="about-section">
        <h1>About the Phoneme Activity Builder</h1>

        <p>
          This project is a part of the CSE3CWA assessment at La Trobe University, designed to demonstrate frontend
          development skills using React and Next.js. The Phoneme Activity Builder is a frontend tool designed for 
          teachers who prepare classroom activities for Speech Pathology students. 
          It allows teachers to create, preview, and generate phoneme-based Wordle and Word Search activities.
         
        </p>

      </div>

      {/* ==== <div className="about-section">
        <h2>Assessment 1 Scope</h2>

        <p>
          Assessment 1 focuses on frontend design, usability,
          accessibility, responsive layout, and component-based React
          development. A database and dynamic word-list management are
          not included at this stage and are intended for later
          assessments.
        </p>
      </div>==== */}

      <div className="about-tools">

        <article className="about-card">
          <h2>Wordle</h2>

          <p>
            The Wordle builder allows a teacher to enter a phoneme-based
            word and its English equivalent, select difficulty and hint
            settings, choose the number of guesses, preview the activity,
            and generate a standalone playable HTML file.
          </p>

          <h3>Difficulty Levels</h3>

          <p>
            <strong>Easy:</strong> Hints show the correct phoneme and its position.
          </p>

          <p>
            <strong>Medium:</strong> Hints show the correct phoneme, but not its position.
          </p>

          <p>
            <strong>Hard:</strong> No hints are provided.
          </p>
        </article>

        <article className="about-card">
          <h2>Word Search</h2>

          <p>
            The Word Search builder allows a teacher to edit a small list
            of phoneme words and their English equivalents, select a
            difficulty level and grid size, regenerate the puzzle preview,
            and export the selected grid as a standalone HTML activity.
          </p>

          <h3>Difficulty Levels</h3>

          <p>
            <strong>Easy:</strong> Words appear right or down.
          </p>

          <p>
            <strong>Medium:</strong> Words can also appear diagonally.
          </p>

          <p>
            <strong>Hard:</strong> Words can appear in any direction, including backwards.
          </p>
        </article>

      </div>

      <div className="about-section student-details">
        <h2>Student Details</h2>

        <p>
          <strong>Name:</strong> Kim Long Hoang
        </p>

        <p>
          <strong>Student Number:</strong> 22666484
        </p>
      </div>

      <div className="about-section">
        <h2>How to Use the Website</h2>

        <p>
          The video below demonstrates how to navigate the website,
          configure the activities, preview the results, and generate
          the standalone HTML files.
        </p>

        <div className="video-placeholder">
          <p>Instructional video will be added here.</p>
        </div>
      </div>

    </section>
  );
}