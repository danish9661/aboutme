"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Divider from "./Divider";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const inv = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Scroll-driven cricket scene: as the section passes through the viewport the
 * batsman swings and launches a straight six, the ball arcs up and away, and a
 * gradient "SIX!" pops. Attributes are driven directly off scrollYProgress via
 * a throttled rAF (reliable for SVG transforms). Under prefers-reduced-motion
 * it renders a clean static end-state.
 */
export default function CricketSix() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const batRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const sixRef = useRef<SVGGElement>(null);
  const rafRef = useRef<number | null>(null);
  const pRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const apply = () => {
    rafRef.current = null;
    const p = pRef.current;

    // a lofted-six swing: one fluid sweep from a low backlift (bat down-right)
    // UP through contact (~horizontal) to a high follow-through (bat up).
    // 0deg = bat pointing up; 90 = right; 135 = down-right.
    const angle = lerp(135, 4, inv(p, 0.2, 0.6));
    batRef.current?.setAttribute("transform", `translate(150 132) rotate(${angle.toFixed(2)})`);

    // ball launches at contact and arcs up-and-away
    const bx = lerp(176, 500, inv(p, 0.34, 0.9));
    const by =
      p < 0.62 ? lerp(178, 50, inv(p, 0.34, 0.62)) : lerp(50, 120, inv(p, 0.62, 0.9));
    const bo = p < 0.38 ? inv(p, 0.34, 0.38) : 1 - inv(p, 0.88, 0.99);
    if (ballRef.current) {
      ballRef.current.setAttribute("transform", `translate(${bx.toFixed(1)} ${by.toFixed(1)})`);
      ballRef.current.style.opacity = `${clamp01(bo).toFixed(2)}`;
    }

    const s = lerp(0.5, 1, inv(p, 0.46, 0.62));
    const so = p < 0.56 ? inv(p, 0.46, 0.56) : 1 - inv(p, 0.9, 0.99);
    if (sixRef.current) {
      sixRef.current.setAttribute("transform", `translate(430 66) scale(${s.toFixed(3)})`);
      sixRef.current.style.opacity = `${clamp01(so).toFixed(2)}`;
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    pRef.current = v;
    if (!reduce && rafRef.current == null) rafRef.current = requestAnimationFrame(apply);
  });

  useEffect(() => {
    if (reduce) {
      // static end-state: ball landed up-field, SIX shown
      batRef.current?.setAttribute("transform", "translate(150 132) rotate(12)");
      if (ballRef.current) {
        ballRef.current.setAttribute("transform", "translate(470 96)");
        ballRef.current.style.opacity = "1";
      }
      if (sixRef.current) {
        sixRef.current.setAttribute("transform", "translate(430 66) scale(1)");
        sixRef.current.style.opacity = "1";
      }
    } else {
      apply();
    }
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <section ref={ref} className="overflow-hidden pb-20 sm:pb-24">
      <Divider />
      <div className="mx-auto mt-20 w-full max-w-page px-6 sm:mt-24 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
            <span className="text-accent" aria-hidden>
              ∿
            </span>
            Off the keyboard
          </p>
          <h2 className="mt-4 text-[26px] font-semibold tracking-tightest text-ink sm:text-[32px]">
            I like a clean straight six.
          </h2>
          <p className="mt-3 text-[15px] text-ink-2">
            Same way I like shipping — line it up, make clean contact, send it.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-[640px]">
          <svg
            viewBox="0 0 560 240"
            className="w-full overflow-visible"
            role="img"
            aria-label="A batsman hitting a straight six"
          >
            <defs>
              <linearGradient id="sixGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="50%" stopColor="#ff4e9b" />
                <stop offset="100%" stopColor="#845ec2" />
              </linearGradient>
            </defs>

            {/* pitch line + shadow */}
            <line x1="30" y1="212" x2="530" y2="212" stroke="var(--line-strong)" strokeWidth="2" />
            <ellipse cx="148" cy="214" rx="42" ry="6" fill="rgba(132,94,194,0.16)" />

            {/* ── batsman ── */}
            <g>
              <rect x="134" y="150" width="12" height="60" rx="6" fill="#4f3578" />
              <rect x="154" y="150" width="12" height="60" rx="6" fill="#4f3578" />
              <ellipse cx="140" cy="212" rx="11" ry="5" fill="#2b1b3d" />
              <ellipse cx="160" cy="212" rx="11" ry="5" fill="#2b1b3d" />
              <rect x="126" y="102" width="48" height="56" rx="15" fill="#ff4e9b" />
              {/* head — mirrored about x=150 so the face points right, toward the shot */}
              <g transform="matrix(-1 0 0 1 300 0)">
                <circle cx="150" cy="88" r="16" fill="#eeb98c" />
                <path d="M134 86 a16 16 0 0 1 32 0 z" fill="#2b1b3d" />
                <rect x="159" y="84" width="9" height="12" rx="3" fill="#2b1b3d" />
                {/* helmet grille bars on the face side (right) */}
                <g stroke="#2b1b3d" strokeWidth="1.4" opacity="0.9">
                  <line x1="132" y1="86" x2="139" y2="86" />
                  <line x1="131" y1="90" x2="139" y2="90" />
                  <line x1="132" y1="94" x2="139" y2="94" />
                </g>
              </g>
            </g>

            {/* ── bat (swings around the hands at 150,132) ── */}
            <g ref={batRef} transform="translate(150 132) rotate(135)">
              <circle cx="0" cy="0" r="7" fill="#eeb98c" />
              <rect x="-4" y="-26" width="8" height="26" rx="3" fill="#3a2a22" />
              <rect x="-8" y="-104" width="16" height="80" rx="7" fill="#e3c089" />
              <line x1="0" y1="-100" x2="0" y2="-30" stroke="#caa269" strokeWidth="2" />
            </g>

            {/* ── ball + trail ── */}
            <g ref={ballRef} transform="translate(158 186)" style={{ opacity: 0 }}>
              <circle cx="-34" cy="16" r="5" fill="#c0392b" opacity="0.2" />
              <circle cx="-22" cy="9" r="6.5" fill="#c0392b" opacity="0.35" />
              <circle cx="-11" cy="4" r="8" fill="#c0392b" opacity="0.55" />
              <circle cx="0" cy="0" r="9" fill="#c0392b" />
              <path d="M-6 -6 A 9 9 0 0 1 6 6" fill="none" stroke="#fff" strokeWidth="1.4" opacity="0.85" />
            </g>

            {/* ── SIX! ── */}
            <g ref={sixRef} transform="translate(430 66) scale(0.5)" style={{ opacity: 0 }}>
              <text
                textAnchor="middle"
                fontSize="42"
                fontWeight="700"
                letterSpacing="-1"
                style={{ fontFamily: "var(--font-mono)" }}
                fill="url(#sixGrad)"
              >
                SIX!
              </text>
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
