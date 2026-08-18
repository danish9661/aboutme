import type { Metadata } from "next";

/** Production origin — used for canonical URLs */
export const SITE_URL = "https://danish9661.github.io/aboutme";

export interface PostData {
  /** URL segment — the post page must live at app/blog/<slug>/page.tsx */
  slug: string;
  title: string;
  /** One-to-two sentence teaser shown on the blog index card. */
  excerpt: string;
  /** ISO date, e.g. "2026-07-14". Index sorts newest-first by this. */
  date: string;
  /** e.g. "6 min" */
  readingTime: string;
  tags: string[];
  /** Emoji shown in the card's gradient tile. */
  glyph: string;
}

/**
 * Single source of truth for blog posts.
 *
 * While this array is empty, /blog shows the animated "coming soon" state.
 * To publish a post:
 *   1. Add its entry here (newest date floats to the top automatically).
 *   2. Create app/blog/<slug>/page.tsx — see PROJECT_NOTES.md §"Blog" for
 *      the ready-to-copy template using <PostLayout>.
 *
 * Example entry:
 * {
 *   slug: "accuracy-lies",
 *   title: "Why accuracy lies about rare events",
 *   excerpt:
 *     "A model can score ~91% on apnea detection by mostly predicting 'normal'. What I use instead, and why.",
 *   date: "2026-07-14",
 *   readingTime: "6 min",
 *   tags: ["ML", "Evaluation"],
 *   glyph: "🫀",
 * }
 */
export const POSTS: PostData[] = [
  {
    slug: "jwts-in-redirect-urls",
    title: "Why I Don't Put JWTs in Redirect URLs",
    excerpt:
      "When OAuth login finishes, the easy move is to redirect back with the session token in the URL. It works on the first try — which is exactly why it's dangerous. Here's what I hand back in ArbFlow instead, and the reasoning behind it.",
    date: "2026-07-04",
    readingTime: "10 min",
    tags: ["Security", "Auth", "ArbFlow"],
    glyph: "🔐",
  },
];

/** Newest first. */
export const SORTED_POSTS: PostData[] = [...POSTS].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const POSTS_BY_SLUG: Record<string, PostData> = Object.fromEntries(
  POSTS.map((p) => [p.slug, p]),
);

/** Card accent cycle — same palette rhythm as the Stack cards. */
export const POST_ACCENTS = [
  {
    grad: "linear-gradient(135deg,#2563eb,#2563eb)",
    color: "#3b82f6",
    wash: "rgba(37,99,235,0.12)",
  },
  {
    grad: "linear-gradient(135deg,#38bdf8,#2563eb)",
    color: "#38bdf8",
    wash: "rgba(56,189,248,0.13)",
  },
  {
    grad: "linear-gradient(135deg,#3b82f6,#60a5fa)",
    color: "#1d4ed8",
    wash: "rgba(59,130,246,0.12)",
  },
  {
    grad: "linear-gradient(135deg,#60a5fa,#2563eb)",
    color: "#0284c7",
    wash: "rgba(96,165,250,0.16)",
  },
];

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Per-post <head> metadata: `export const metadata = postMetadata("slug")`. */
export function postMetadata(slug: string): Metadata {
  const post = POSTS_BY_SLUG[slug];
  if (!post) return { title: "Blog — Md. Danish" };
  const url = `${SITE_URL}/blog/${slug}`;
  return {
    title: `${post.title} — Md. Danish`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url,
    },
  };
}
