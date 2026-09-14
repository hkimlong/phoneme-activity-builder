"use client";

import { useState } from "react";
import Link from "next/link";

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="mobile-menu-wrapper">

      <button
        type="button"
        className="menu-button"
        aria-label="Open navigation menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <div className="mobile-dropdown">

          <Link href="/" onClick={closeMenu}>
            Home
          </Link>

          <Link href="/wordle" onClick={closeMenu}>
            Wordle
          </Link>

          <Link href="/word-search" onClick={closeMenu}>
            Word Search
          </Link>

          <Link href="/about" onClick={closeMenu}>
            About
          </Link>

          <Link href="/settings" onClick={closeMenu}>
            Settings
          </Link>

        </div>
      )}

    </div>
  );
}