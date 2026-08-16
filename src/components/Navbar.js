import Link from "next/link";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">

      <div className="nav-container">

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/wordle">Wordle</Link>
          <Link href="/word-search">Word Search</Link>
          <Link href="/about">About</Link>
          <Link href="/settings">Settings</Link>
        </div>

        <MobileMenu />

      </div>

    </nav>
  );
}