import type { Metadata } from "next";
import { Eyebrow } from "@/components/Section";
import Reveal from "@/components/Reveal";
import ComingSoon from "@/components/blog/ComingSoon";
import PostCard from "@/components/blog/PostCard";
import Button from "@/components/Button";
import { SORTED_POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog — Md. Danish",
  description:
    "Notes from the build — systems, firmware, emulators, and low-level software engineering.",
  openGraph: {
    title: "Blog — Md. Danish",
    description:
      "Notes from the build — systems, firmware, emulators, and low-level software engineering.",
    type: "website",
  },
};

export default function BlogIndex() {
  if (SORTED_POSTS.length === 0) return <ComingSoon />;

  const [featured, ...rest] = SORTED_POSTS;

  return (
    <div className="relative mx-auto w-full max-w-page px-6 py-16 sm:px-8 sm:py-24">
      {/* header backdrop */}
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
              "radial-gradient(circle, rgba(132,94,194,0.12) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
      </div>

      <header>
        <Eyebrow>Blog</Eyebrow>
        <h1 className="mt-5 text-[40px] font-semibold leading-[1.05] tracking-tightest sm:text-[52px]">
          Notes from <span className="text-candy">the build</span>.
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
          Applied ML, healthcare biosignals, shipping SaaS — written up the way
          I actually figured it out.
        </p>
      </header>

      <div className="mt-14">
        <Reveal>
          <PostCard post={featured} index={0} featured />
        </Reveal>
      </div>

      {rest.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.05}>
              <PostCard post={post} index={i + 1} />
            </Reveal>
          ))}
        </div>
      ) : (
        <Reveal delay={0.05}>
          <div className="mt-6 rounded-2xl border border-dashed border-line-strong bg-surface/50 px-8 py-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
              More on the way
            </p>
            <h3 className="mt-3 text-[20px] font-semibold tracking-tightest text-ink">
              More posts are in the works.
            </h3>
            <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-ink-2">
              I write these up when I&apos;ve built something worth explaining.
              Subscribe to catch the next one.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button href="/feed.xml" variant="outline" newTab>
                Subscribe via RSS
              </Button>
              <Button href="mailto:9661346164h@gmail.com" variant="outline">
                Get notified
              </Button>
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
