import { Link } from "next-view-transitions";
import {
  POST_ACCENTS,
  formatPostDate,
  type PostData,
} from "@/lib/posts";

interface PostCardProps {
  post: PostData;
  /** Position in the index — drives the accent colour cycle. */
  index: number;
  /** Newest post renders as a full-width hero card. */
  featured?: boolean;
}

export default function PostCard({ post, index, featured = false }: PostCardProps) {
  const accent = POST_ACCENTS[index % POST_ACCENTS.length];

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block h-full overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_55px_-20px_rgba(132,94,194,0.45)] motion-reduce:hover:translate-y-0"
    >
      <div className="h-1.5 w-full" style={{ background: accent.grad }} aria-hidden />

      <div className={featured ? "p-7 sm:p-9" : "p-6"}>
        <div className="flex items-center gap-3">
          <span
            className={`flex shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3 motion-reduce:transform-none ${
              featured ? "h-12 w-12 text-[22px]" : "h-10 w-10 text-[18px]"
            }`}
            style={{ background: accent.grad }}
            aria-hidden
          >
            {post.glyph}
          </span>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span className="mx-2" aria-hidden>
              ·
            </span>
            {post.readingTime} read
          </p>
        </div>

        <h2
          style={{ viewTransitionName: `post-title-${post.slug}` }}
          className={`mt-4 font-semibold tracking-tightest text-ink transition-colors group-hover:text-accent ${
            featured ? "text-[26px] leading-snug sm:text-[32px]" : "text-[19px] leading-snug"
          }`}
        >
          {post.title}
        </h2>

        <p
          className={`mt-3 leading-relaxed text-ink-2 ${
            featured ? "max-w-2xl text-[16px]" : "text-[14px]"
          }`}
        >
          {post.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg px-2.5 py-1 font-mono text-[11px] font-medium"
              style={{ background: accent.wash, color: accent.color }}
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto inline-flex items-center gap-1 font-mono text-[12px] text-ink-3 transition-colors group-hover:text-accent">
            Read
            <span
              aria-hidden
              className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
