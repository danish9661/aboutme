import type { Metadata } from "next";

/** Production origin — used for canonical URLs */
export const SITE_URL = "https://danish9661.github.io";

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
    grad: "linear-gradient(135deg,#ff4e9b,#ff6b6b)",
    color: "#ff4e9b",
    wash: "rgba(255,78,155,0.12)",
  },
  {
    grad: "linear-gradient(135deg,#845ec2,#ff4e9b)",
    color: "#845ec2",
    wash: "rgba(132,94,194,0.13)",
  },
  {
    grad: "linear-gradient(135deg,#ff6b6b,#ffb347)",
    color: "#e2563b",
    wash: "rgba(255,107,107,0.12)",
  },
  {
    grad: "linear-gradient(135deg,#ffb347,#ff4e9b)",
    color: "#d98324",
    wash: "rgba(255,179,71,0.16)",
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
