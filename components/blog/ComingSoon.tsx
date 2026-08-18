"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Badge from "@/components/Badge";
import Button from "@/components/Button";

/** Draft titles the terminal "types" while the blog warms up. */
const DRAFTS = [
  "why accuracy lies about rare events",
  "per-tenant isolation, the parts that bite",
  "shipping a SaaS while still in college",
  "what LOPO cross-validation actually buys you",
];

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1700;

function useTypewriter(phrases: string[], enabled: boolean) {
  const [phrase, setPhrase] = useState(0);
  const [chars, setChars] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const current = phrases[phrase];

    if (!deleting && chars === current.length) {
      const t = setTimeout(() => setDeleting(true), HOLD_MS);
      return () => clearTimeout(t);
    }
    if (deleting && chars === 0) {
      setDeleting(false);
      setPhrase((p) => (p + 1) % phrases.length);
      return;
    }
    const t = setTimeout(
      () => setChars((c) => c + (deleting ? -1 : 1)),
      deleting ? DELETE_MS : TYPE_MS,
    );
    return () => clearTimeout(t);
  }, [enabled, phrases, phrase, chars, deleting]);

  return enabled ? phrases[phrase].slice(0, chars) : phrases[0];
}

export default function ComingSoon() {
  const reduce = useReducedMotion();
  const typed = useTypewriter(DRAFTS, !reduce);

  return (
    <div className="relative mx-auto w-full max-w-page px-6 py-20 sm:px-8 sm:py-28">
      {/* floating gradient blobs + dotted backdrop, same language as the case study */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] overflow-hidden"
      >
        <div className="animate-float absolute -left-24 -top-16 h-80 w-80 rounded-full bg-accent-wash blur-3xl" />
        <div
          className="animate-float absolute right-0 -top-8 h-72 w-72 rounded-full bg-accent-2-wash blur-3xl"
          style={{ animationDelay: "-2.2s" }}
        />
        <div
          className="animate-float absolute left-1/3 top-40 h-64 w-64 rounded-full bg-accent-3-wash blur-3xl"
          style={{ animationDelay: "-4s" }}
        />
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

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Badge label="Coming soon" variant="live" pulse />

        <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-tightest sm:text-[56px]">
          The blog is <span className="text-candy">warming up</span>.
        </h1>

        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-ink-2">
          Long-form notes from the build — applied ML, shipping SaaS, and the
          decisions in between. The first post is being drafted right now.
        </p>

        {/* terminal draft window */}
        <div className="mt-10 w-full max-w-xl overflow-hidden rounded-2xl border border-term-line bg-term text-left shadow-[0_28px_70px_-28px_rgba(43,27,61,0.55)]">
          <div className="flex items-center gap-2 border-b border-term-line px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden />
            <span className="ml-3 font-mono text-[11px] tracking-[0.08em] text-white/40">
              ~/blog — drafts
            </span>
          </div>

          <div className="px-5 py-5 font-mono text-[13px] leading-loose sm:text-[14px]">
            <p className="text-white/40"># first post ships soon</p>
            <p className="text-white/90">
              <span className="text-accent">$</span>{" "}
              <span className="text-accent-2-bright">draft</span> {typed}
              <span className="animate-cursor ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[3px] bg-accent" />
            </p>

            {/* draft progress shimmer */}
            <div className="mt-4 flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.12em] text-white/40">
                progress
              </span>
              <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                <span
                  className="bg-candy absolute inset-y-0 left-0 w-2/3 rounded-full"
                  aria-hidden
                />
                <span className="animate-shimmer absolute inset-y-0 left-0 w-2/3 rounded-full" aria-hidden />
              </span>
              <span className="text-[11px] text-white/40">67%</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href="/#work">Meanwhile, see my work →</Button>
          <Button href="mailto:9661346164h@gmail.com" variant="outline">
            Get notified — say hi
          </Button>
        </div>
      </div>
    </div>
  );
}
