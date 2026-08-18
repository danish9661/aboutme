import type { Config } from "tailwindcss";

/**
 * Design tokens are defined as CSS variables in app/globals.css and surfaced
 * here so they can be used as Tailwind utilities (e.g. `text-ink-2`, `bg-accent-wash`).
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        accent: "var(--accent)",
        "accent-bright": "var(--accent-bright)",
        "accent-wash": "var(--accent-wash)",
        "accent-2": "var(--accent-2)",
        "accent-2-bright": "var(--accent-2-bright)",
        "accent-2-wash": "var(--accent-2-wash)",
        "accent-3": "var(--accent-3)",
        "accent-3-wash": "var(--accent-3-wash)",
        coral: "var(--coral)",
        term: "var(--term-bg)",
        "term-line": "var(--term-line)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "system-ui",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        hand: ["var(--font-hand)", "ui-rounded", "cursive"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      maxWidth: {
        page: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
