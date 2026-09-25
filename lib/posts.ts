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
  /** Short monogram shown in the card's tile (2-3 ASCII chars, no emoji). */
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
 *   glyph: "ML",
 * }
 */
export const POSTS: PostData[] = [];

/** Newest first. */
export const SORTED_POSTS: PostData[] = [...POSTS].sort((a, b) =>
  b.date.localeCompare(a.date),
);

export const POSTS_BY_SLUG: Record<string, PostData> = Object.fromEntries(
  POSTS.map((p) => [p.slug, p]),
);

/** Card accent cycle — ultraviolet neon rhythm, same as the Stack cards. */
export const POST_ACCENTS = [
  {
    grad: "linear-gradient(135deg,#7C3AED,#7C3AED)",
    color: "#7C3AED",
    wash: "rgba(124,58,237,0.12)",
  },
  {
    grad: "linear-gradient(135deg,#C084FC,#7C3AED)",
    color: "#A855F7",
    wash: "rgba(192,132,252,0.14)",
  },
  {
    grad: "linear-gradient(135deg,#7C3AED,#C084FC)",
    color: "#7C3AED",
    wash: "rgba(124,58,237,0.12)",
  },
  {
    grad: "linear-gradient(135deg,#C084FC,#7C3AED)",
    color: "#A855F7",
    wash: "rgba(192,132,252,0.14)",
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
