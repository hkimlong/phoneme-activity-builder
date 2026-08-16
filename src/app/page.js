import Link from "next/link";

export default function Home() {
  return (
    <section className="home-page">

      <div className="home-intro">
        <h1></h1>

        <p>
          Start building and generating your phoneme-based activities by clicking on the buttons below. The 
          activities are designed to be used in a classroom setting, and can be exported as standalone HTML files 
          for easy sharing, printing or playing on any web browser.
        </p>
      </div>

      <div className="activity-cards">

        <article className="activity-card">
          <h2>Wordle</h2>

          <p>
            Create an activity where players use phoneme symbols to guess a target word, receive feedback based on the 
            selected difficulty, and can use phoneme hints to support recognition and understanding. 
          </p>

          <Link
            href="/wordle"
            className="home-action-button"
          >
            Create Wordle
          </Link>
        </article>

        <article className="activity-card">
          <h2>Word Search</h2>

          <p>
            Create a phoneme Word Search using an editable word list.
            Players look for phoneme-based words in a grid of letters and phonemes symbols.
          </p>

          <Link
            href="/word-search"
            className="home-action-button"
          >
            Create Word Search
          </Link>
        </article>

      </div>

    </section>
  );
}