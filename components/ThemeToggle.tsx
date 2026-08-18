"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark toggle. Persists the choice to localStorage and stamps
 * `data-theme` on <html>; the no-flash script in layout.tsx applies a stored
 * choice before paint. With no stored choice, the OS preference wins (via the
 * @media block in globals.css), so the button reflects that until first click.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else {
      setTheme(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      );
    }
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked — session-only toggle */
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface/80 text-ink-2 transition-colors hover:border-accent hover:text-accent"
    >
      {/* sun by default (also the pre-mount SSR state → no hydration mismatch) */}
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
        {isDark ? (
          <path
            d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
            fill="currentColor"
          />
        ) : (
          <>
            <circle cx="12" cy="12" r="4.2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5 5l1.6 1.6M17.4 17.4L19 19M19 5l-1.6 1.6M6.6 17.4L5 19" />
            </g>
          </>
        )}
      </svg>
    </button>
  );
}
