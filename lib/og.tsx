import { ImageResponse } from "next/og";
import { POSTS_BY_SLUG, formatPostDate } from "@/lib/posts";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * Build a per-post social card (next/og). A post's `opengraph-image.tsx` just
 * re-exports OG_SIZE + OG_CONTENT_TYPE and returns `postOgImage(slug)`.
 */
export function postOgImage(slug: string) {
  const post = POSTS_BY_SLUG[slug];
  const title = post?.title ?? "Pranav Shukla";
  const tags = post?.tags ?? [];
  const meta = post
    ? `${formatPostDate(post.date)} · ${post.readingTime} read`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px",
          background: "linear-gradient(135deg,#2563eb,#3b82f6,#38bdf8)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 700, opacity: 0.9 }}>
          Pranav.&nbsp;&nbsp;·&nbsp;&nbsp;Blog
        </div>

        <div
          style={{
            marginTop: "auto",
            fontSize: 66,
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <div
              key={tag}
              style={{
                display: "flex",
                fontSize: 24,
                fontWeight: 600,
                padding: "8px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.18)",
              }}
            >
              {tag}
            </div>
          ))}
          {meta && (
            <div style={{ display: "flex", fontSize: 24, opacity: 0.9, marginLeft: 8 }}>
              {meta}
            </div>
          )}
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
