import { Link } from "next-view-transitions";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/Section";
import Button from "@/components/Button";
import HeadingAnchors from "@/components/blog/HeadingAnchors";
import TableOfContents from "@/components/blog/TableOfContents";
import {
  POSTS_BY_SLUG,
  POST_ACCENTS,
  SORTED_POSTS,
  SITE_URL,
  formatPostDate,
} from "@/lib/posts";

/**
 * Shared shell for every blog post. A post page is just:
 *
 *   export const metadata = postMetadata("my-slug");
 *   export default function Post() {
 *     return (
 *       <PostLayout slug="my-slug">
 *         <p>…</p>
 *         <h2>…</h2>
 *       </PostLayout>
 *     );
 *   }
 *
 * Body typography (h2/h3, p, lists, code, blockquote…) is styled by the
 * `.prose-blog` rules in globals.css.
 */
export default function PostLayout({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const post = POSTS_BY_SLUG[slug];
  if (!post) notFound();

  const index = SORTED_POSTS.findIndex((p) => p.slug === slug);
  const accent = POST_ACCENTS[Math.max(index, 0) % POST_ACCENTS.length];

  // SORTED_POSTS is newest-first: index-1 is newer, index+1 is older.
  const newer = index > 0 ? SORTED_POSTS[index - 1] : undefined;
  const older =
    index >= 0 && index < SORTED_POSTS.length - 1
      ? SORTED_POSTS[index + 1]
      : undefined;

  const url = `${SITE_URL}/blog/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    keywords: post.tags.join(", "),
    image: `${url}/opengraph-image`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", name: "Md. Danish", url: SITE_URL },
    publisher: { "@type": "Person", name: "Md. Danish", url: SITE_URL },
  };

  return (
    <article className="relative mx-auto w-full max-w-page px-6 py-16 sm:px-8 sm:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* vibrant header backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] overflow-hidden"
      >
        <div className="absolute -left-24 -top-20 h-80 w-80 rounded-full bg-accent-wash blur-3xl" />
        <div className="absolute right-0 -top-10 h-72 w-72 rounded-full bg-accent-2-wash blur-3xl" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(56,189,248,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>

      <Link
        href="/blog"
        className="font-mono text-[13px] text-ink-2 transition-colors hover:text-accent"
      >
        ← All posts
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Eyebrow>Blog</Eyebrow>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span className="mx-2" aria-hidden>
              ·
            </span>
            {post.readingTime} read
          </p>
        </div>

        <h1
          style={{ viewTransitionName: `post-title-${slug}` }}
          className="mt-5 max-w-3xl text-[36px] font-semibold leading-[1.08] tracking-tightest sm:text-[48px]"
        >
          <span className="text-candy">{post.title}</span>
        </h1>

        <div className="mt-6 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-3 py-1 font-mono text-[12px] font-medium"
              style={{ background: accent.wash, color: accent.color }}
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-10">
        <div className="prose-blog">{children}</div>
        <TableOfContents />
      </div>
      <HeadingAnchors />

      {/* prev / next posts */}
      {(newer || older) && (
        <nav
          aria-label="More posts"
          className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2"
        >
          {older ? (
            <Link
              href={`/blog/${older.slug}`}
              className="group rounded-2xl border border-line bg-surface p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-24px_rgba(56,189,248,0.35)] motion-reduce:hover:translate-y-0"
            >
              <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:-translate-x-1 motion-reduce:transform-none"
                >
                  ←
                </span>
                Older
              </span>
              <span
                style={{ viewTransitionName: `post-title-${older.slug}` }}
                className="mt-2 block font-semibold leading-snug text-ink transition-colors group-hover:text-accent"
              >
                {older.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden />
          )}
          {newer && (
            <Link
              href={`/blog/${newer.slug}`}
              className="group rounded-2xl border border-line bg-surface p-5 text-right transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-24px_rgba(56,189,248,0.35)] motion-reduce:hover:translate-y-0"
            >
              <span className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">
                Newer
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                >
                  →
                </span>
              </span>
              <span
                style={{ viewTransitionName: `post-title-${newer.slug}` }}
                className="mt-2 block font-semibold leading-snug text-ink transition-colors group-hover:text-accent"
              >
                {newer.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      <footer className="mt-12 border-t border-line pt-10">
        <p className="text-[16px] leading-relaxed text-ink-2">
          Thoughts, corrections, or want to talk about this? I read everything.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button href="mailto:9661346164h@gmail.com">Email me</Button>
          <Button href="/blog" variant="outline">
            More posts
          </Button>
        </div>
      </footer>
    </article>
  );
}
