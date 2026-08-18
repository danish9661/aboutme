"use client";

import { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import Divider from "./Divider";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const inv = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Quadratic Bézier interpolation for smooth parabolic flight
const bezier = (p0: number, p1: number, p2: number, t: number) => {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
};

// Parabolic trajectory control points:
// Start at sweet-spot impact -> Apex in the sky -> Boundary landing
// Bat pivot is at (156, 130); sweet spot at r=70 rotated 110deg = (221.8, 153.9) -> (222, 154)
const P_START = { x: 222, y: 154 };
const P_APEX = { x: 375, y: 18 };
const P_END = { x: 535, y: 125 };

const getTrajectoryPos = (t: number) => ({
  x: bezier(P_START.x, P_APEX.x, P_END.x, t),
  y: bezier(P_START.y, P_APEX.y, P_END.y, t),
});

export default function CricketSix() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // SVG animated element refs
  const batRef = useRef<SVGGElement>(null);
  const armsRef = useRef<SVGGElement>(null);
  const ballRef = useRef<SVGGElement>(null);
  const trail1Ref = useRef<SVGGElement>(null);
  const trail2Ref = useRef<SVGGElement>(null);
  const trail3Ref = useRef<SVGGElement>(null);
  const sparkRef = useRef<SVGGElement>(null);
  const trajectoryPathRef = useRef<SVGPathElement>(null);
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

    // ─────────────────────────────────────────────────────────────
    // 1. BAT & ARMS SWING MECHANICS (Biomechanically correct):
    // - Phase A (p: 0.00 -> 0.16): Ready stance / Backlift (~ -40 deg, bat up-back)
    // - Phase B (p: 0.16 -> 0.28): Downswing reaching sweet-spot impact (+110 deg at contact)
    // - Phase C (p: 0.28 -> 0.60): Lofted high follow-through (~ +32 deg, bat pointing into sky)
    // ─────────────────────────────────────────────────────────────
    let batAngle = -40;
    if (p < 0.16) {
      batAngle = -40;
    } else if (p < 0.28) {
      batAngle = lerp(-40, 110, inv(p, 0.16, 0.28));
    } else {
      batAngle = lerp(110, 32, inv(p, 0.28, 0.6));
    }

    if (batRef.current) {
      batRef.current.setAttribute(
        "transform",
        `translate(156 130) rotate(${batAngle.toFixed(2)})`
      );
    }

    // Dynamic arms follow bat pivot
    if (armsRef.current) {
      const armRot = lerp(-12, 24, inv(p, 0.16, 0.5));
      armsRef.current.setAttribute(
        "transform",
        `rotate(${armRot.toFixed(2)} 142 120)`
      );
    }

    // ─────────────────────────────────────────────────────────────
    // 2. BALL PHYSICS & TRAJECTORY (Incoming -> Impact -> Flight)
    // ─────────────────────────────────────────────────────────────
    let ballX = 0;
    let ballY = 0;
    let ballOpacity = 0;
    let flightT = 0;

    if (p < 0.12) {
      // Before bowler releases: hidden
      ballOpacity = 0;
    } else if (p < 0.28) {
      // Incoming delivery from bowler (bounces on pitch & rises to bat sweet spot)
      const inT = inv(p, 0.12, 0.28);
      ballOpacity = inv(p, 0.12, 0.16);
      if (inT < 0.52) {
        // Pitching towards ground
        const subT = inT / 0.52;
        ballX = lerp(490, 330, subT);
        ballY = lerp(130, 210, subT);
      } else {
        // Off pitch rising straight to bat sweet spot (222, 154)
        const subT = (inT - 0.52) / 0.48;
        ballX = lerp(330, P_START.x, subT);
        ballY = lerp(210, P_START.y, subT);
      }
    } else {
      // After impact: soaring parabolic six arc
      flightT = inv(p, 0.28, 0.88);
      const pos = getTrajectoryPos(flightT);
      ballX = pos.x;
      ballY = pos.y;
      ballOpacity = p > 0.85 ? 1 - inv(p, 0.85, 0.98) : 1;
    }

    // Position main ball
    if (ballRef.current) {
      ballRef.current.setAttribute(
        "transform",
        `translate(${ballX.toFixed(1)} ${ballY.toFixed(1)})`
      );
      ballRef.current.style.opacity = ballOpacity.toFixed(2);
    }

    // ─────────────────────────────────────────────────────────────
    // 3. CURVE-FOLLOWING TRAIL GHOSTS (Sampled on actual flight path)
    // ─────────────────────────────────────────────────────────────
    if (flightT > 0.02 && p <= 0.95) {
      const t1 = Math.max(0, flightT - 0.04);
      const t2 = Math.max(0, flightT - 0.08);
      const t3 = Math.max(0, flightT - 0.12);

      const pos1 = getTrajectoryPos(t1);
      const pos2 = getTrajectoryPos(t2);
      const pos3 = getTrajectoryPos(t3);

      if (trail1Ref.current) {
        trail1Ref.current.setAttribute(
          "transform",
          `translate(${pos1.x.toFixed(1)} ${pos1.y.toFixed(1)})`
        );
        trail1Ref.current.style.opacity = `${(0.65 * ballOpacity).toFixed(2)}`;
      }
      if (trail2Ref.current) {
        trail2Ref.current.setAttribute(
          "transform",
          `translate(${pos2.x.toFixed(1)} ${pos2.y.toFixed(1)})`
        );
        trail2Ref.current.style.opacity = `${(0.4 * ballOpacity).toFixed(2)}`;
      }
      if (trail3Ref.current) {
        trail3Ref.current.setAttribute(
          "transform",
          `translate(${pos3.x.toFixed(1)} ${pos3.y.toFixed(1)})`
        );
        trail3Ref.current.style.opacity = `${(0.2 * ballOpacity).toFixed(2)}`;
      }
    } else {
      if (trail1Ref.current) trail1Ref.current.style.opacity = "0";
      if (trail2Ref.current) trail2Ref.current.style.opacity = "0";
      if (trail3Ref.current) trail3Ref.current.style.opacity = "0";
    }

    // Traced dynamic path length
    if (trajectoryPathRef.current) {
      if (flightT > 0.05) {
        trajectoryPathRef.current.style.strokeDashoffset = `${(
          1 - flightT
        ).toFixed(3)}`;
        trajectoryPathRef.current.style.opacity = `${(0.85 * ballOpacity).toFixed(
          2
        )}`;
      } else {
        trajectoryPathRef.current.style.opacity = "0";
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. IMPACT SPARK BURST (Directly on sweet spot contact)
    // ─────────────────────────────────────────────────────────────
    if (sparkRef.current) {
      if (p >= 0.28 && p <= 0.40) {
        const sparkProgress = inv(p, 0.28, 0.40);
        const sparkScale = lerp(0.4, 1.3, sparkProgress);
        const sparkAlpha = 1 - sparkProgress;
        sparkRef.current.setAttribute(
          "transform",
          `translate(${P_START.x} ${P_START.y}) scale(${sparkScale.toFixed(2)})`
        );
        sparkRef.current.style.opacity = sparkAlpha.toFixed(2);
      } else {
        sparkRef.current.style.opacity = "0";
      }
    }

    // ─────────────────────────────────────────────────────────────
    // 5. "SIX!" TEXT
    // ─────────────────────────────────────────────────────────────
    if (sixRef.current) {
      const s = lerp(0.5, 1, inv(p, 0.46, 0.62));
      const so = p < 0.56 ? inv(p, 0.46, 0.56) : 1 - inv(p, 0.9, 0.99);
      sixRef.current.setAttribute(
        "transform",
        `translate(430 66) scale(${s.toFixed(3)})`
      );
      sixRef.current.style.opacity = `${clamp01(so).toFixed(2)}`;
    }
  };

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    pRef.current = v;
    if (!reduce && rafRef.current == null) {
      rafRef.current = requestAnimationFrame(apply);
    }
  });

  useEffect(() => {
    if (reduce) {
      // Reduced motion: static beautiful end-state
      batRef.current?.setAttribute(
        "transform",
        "translate(156 130) rotate(48)"
      );
      if (ballRef.current) {
        ballRef.current.setAttribute(
          "transform",
          `translate(${P_END.x} ${P_END.y})`
        );
        ballRef.current.style.opacity = "1";
      }
      if (sixRef.current) {
        sixRef.current.setAttribute(
          "transform",
          "translate(430 66) scale(1)"
        );
        sixRef.current.style.opacity = "1";
      }
      if (trajectoryPathRef.current) {
        trajectoryPathRef.current.style.strokeDashoffset = "0";
        trajectoryPathRef.current.style.opacity = "0.7";
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

        <div className="mx-auto mt-8 max-w-[680px]">
          <svg
            viewBox="0 0 580 250"
            className="w-full overflow-visible select-none"
            role="img"
            aria-label="A batsman cleanly launching a cricket ball for a towering straight six"
          >
            <defs>
              <linearGradient id="sixGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="50%" stopColor="#ff4e9b" />
                <stop offset="100%" stopColor="#845ec2" />
              </linearGradient>

              <linearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff6b6b" stopOpacity="0" />
                <stop offset="40%" stopColor="#ff4e9b" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffb347" stopOpacity="0.9" />
              </linearGradient>

              <radialGradient id="ballGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#ff5e57" />
                <stop offset="55%" stopColor="#d63031" />
                <stop offset="100%" stopColor="#800e0e" />
              </radialGradient>

              <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="50%" stopColor="#ffb347" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff4e9b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ── Pitch & ground markings ── */}
            <line
              x1="25"
              y1="216"
              x2="555"
              y2="216"
              stroke="var(--line-strong)"
              strokeWidth="2"
              strokeDasharray="4 4"
              opacity="0.45"
            />
            {/* Batting Crease */}
            <line
              x1="130"
              y1="204"
              x2="130"
              y2="228"
              stroke="var(--line-strong)"
              strokeWidth="2.5"
            />
            <line
              x1="180"
              y1="208"
              x2="180"
              y2="224"
              stroke="var(--line-strong)"
              strokeWidth="2"
              opacity="0.6"
            />
            {/* Soft ground shadows */}
            <ellipse
              cx="100"
              cy="217"
              rx="16"
              ry="4"
              fill="rgba(132,94,194,0.15)"
            />
            <ellipse
              cx="155"
              cy="218"
              rx="46"
              ry="7"
              fill="rgba(132,94,194,0.22)"
            />

            {/* ── Stumps & Bails ── */}
            <g id="stumps">
              <rect x="94" y="152" width="3.5" height="64" rx="1.5" fill="#caa269" />
              <rect x="100" y="152" width="3.5" height="64" rx="1.5" fill="#caa269" />
              <rect x="106" y="152" width="3.5" height="64" rx="1.5" fill="#caa269" />
              {/* Bails */}
              <rect x="92" y="149" width="10" height="3" rx="1" fill="#e3c089" />
              <rect x="101" y="149" width="10" height="3" rx="1" fill="#e3c089" />
            </g>

            {/* ── Parabolic Trajectory Guide Line (Revealed on flight) ── */}
            <path
              ref={trajectoryPathRef}
              d={`M ${P_START.x} ${P_START.y} Q ${P_APEX.x} ${P_APEX.y} ${P_END.x} ${P_END.y}`}
              fill="none"
              stroke="url(#trailGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="1"
              pathLength="1"
              style={{ strokeDashoffset: "1", opacity: 0 }}
            />

            {/* ── Batsman ── */}
            <g id="batsman">
              {/* Back Leg & Pad */}
              <rect
                x="134"
                y="152"
                width="14"
                height="62"
                rx="6"
                fill="#ede8f5"
                stroke="#4f3578"
                strokeWidth="1.5"
              />
              <line
                x1="135"
                y1="178"
                x2="147"
                y2="178"
                stroke="#4f3578"
                strokeWidth="1.5"
              />
              <ellipse cx="138" cy="216" rx="11" ry="5" fill="#2b1b3d" />

              {/* Front Leg & Pad (Stepping into the shot) */}
              <rect
                x="162"
                y="150"
                width="15"
                height="64"
                rx="6"
                fill="#ffffff"
                stroke="#845ec2"
                strokeWidth="1.5"
              />
              {/* Pad Knee Rolls */}
              <line
                x1="163"
                y1="174"
                x2="176"
                y2="174"
                stroke="#845ec2"
                strokeWidth="1.5"
              />
              <line
                x1="163"
                y1="179"
                x2="176"
                y2="179"
                stroke="#845ec2"
                strokeWidth="1.5"
              />
              <ellipse cx="168" cy="216" rx="12" ry="5.5" fill="#2b1b3d" />

              {/* Torso & Athletic Jersey */}
              <rect
                x="132"
                y="102"
                width="44"
                height="56"
                rx="14"
                fill="#ff4e9b"
              />
              {/* Jersey accent sash */}
              <path
                d="M 134 112 Q 154 130 174 120 L 174 132 Q 154 142 134 124 Z"
                fill="#845ec2"
                opacity="0.8"
              />

              {/* Connected Arms holding the bat */}
              <g ref={armsRef}>
                <path
                  d="M 142 114 Q 150 126 156 130 M 166 114 Q 160 126 156 130"
                  fill="none"
                  stroke="#ff4e9b"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
              </g>

              {/* Head & Cricket Helmet */}
              <g id="head">
                {/* Face */}
                <circle cx="154" cy="84" r="15" fill="#eeb98c" />
                {/* Helmet Dome */}
                <path
                  d="M 139 84 A 15 15 0 0 1 169 84 Z"
                  fill="#2b1b3d"
                />
                {/* Helmet Ear Guard */}
                <rect
                  x="142"
                  y="83"
                  width="10"
                  height="12"
                  rx="3"
                  fill="#2b1b3d"
                />
                {/* Helmet Peak/Visor pointing towards shot (Right) */}
                <polygon
                  points="165,77 176,82 165,84"
                  fill="#2b1b3d"
                />
                {/* Protective Metal Face Grille */}
                <g stroke="#e3c089" strokeWidth="1.3" opacity="0.95">
                  <line x1="158" y1="84" x2="171" y2="84" />
                  <line x1="156" y1="89" x2="170" y2="89" />
                  <line x1="158" y1="94" x2="168" y2="94" />
                  <line x1="168" y1="82" x2="168" y2="96" />
                </g>
              </g>
            </g>

            {/* ── Bat (Swings dynamically around the hands pivot) ── */}
            <g ref={batRef} transform="translate(156 130) rotate(-42)">
              {/* Batting Gloves */}
              <circle cx="0" cy="0" r="7.5" fill="#ffffff" stroke="#845ec2" strokeWidth="1.5" />
              <circle cx="0" cy="-7" r="6.5" fill="#ffffff" stroke="#845ec2" strokeWidth="1.5" />
              {/* Cane Handle & Rubber Grip */}
              <rect x="-4" y="-32" width="8" height="26" rx="3" fill="#2b1b3d" />
              {/* Bat Blade */}
              <rect x="-8" y="-108" width="16" height="78" rx="6" fill="#e3c089" />
              {/* Bat Spine / Ridge highlight */}
              <line x1="0" y1="-104" x2="0" y2="-34" stroke="#caa269" strokeWidth="2.2" />
              {/* Manufacturer Colored Sticker */}
              <rect x="-7" y="-72" width="14" height="20" rx="2" fill="#ff4e9b" opacity="0.9" />
            </g>

            {/* ── Contact Shockwave Spark ── */}
            <g
              ref={sparkRef}
              transform={`translate(${P_START.x} ${P_START.y}) scale(0)`}
              style={{ opacity: 0 }}
            >
              <circle cx="0" cy="0" r="22" fill="url(#sparkGlow)" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="-18" x2="0" y2="18" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-12" y1="-12" x2="12" y2="12" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" />
              <line x1="-12" y1="12" x2="12" y2="-12" stroke="#ffb347" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* ── Curve-following Trail Ghosts ── */}
            <g
              ref={trail3Ref}
              transform={`translate(${P_START.x} ${P_START.y})`}
              style={{ opacity: 0 }}
            >
              <circle cx="0" cy="0" r="4.5" fill="#ff6b6b" />
            </g>
            <g
              ref={trail2Ref}
              transform={`translate(${P_START.x} ${P_START.y})`}
              style={{ opacity: 0 }}
            >
              <circle cx="0" cy="0" r="6" fill="#ff4e9b" />
            </g>
            <g
              ref={trail1Ref}
              transform={`translate(${P_START.x} ${P_START.y})`}
              style={{ opacity: 0 }}
            >
              <circle cx="0" cy="0" r="7.5" fill="#ff5e57" />
            </g>

            {/* ── Main Cricket Ball ── */}
            <g
              ref={ballRef}
              transform={`translate(${P_START.x} ${P_START.y})`}
              style={{ opacity: 0 }}
            >
              <circle cx="0" cy="0" r="9" fill="url(#ballGrad)" />
              {/* White Cricket Seam */}
              <path
                d="M -7 -4 Q 0 0 7 4"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeDasharray="2 1.5"
                opacity="0.9"
              />
              <circle cx="-3" cy="-3" r="2.5" fill="#ffffff" opacity="0.4" />
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

