"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from "framer-motion";

const MESSAGES = [
  "Hi, I'm Danish 👋",
  "wheee! 🌀",
  "spin me again!",
  "ship it 🚀",
  "still dizzy 😵‍💫",
  "okay, one more 😄",
];

/**
 * Articulated SVG avatar of Danish. Built from grouped parts so each limb
 * animates on its own joint: the body bobs, legs swing, the left arm sways,
 * the right arm waves, and an eye blinks (all CSS-driven, disabled under
 * prefers-reduced-motion).
 *
 * Interactive features:
 * - Eyes, head, and 3D body posture smoothly track the user's mouse across the screen.
 * - Clicking spins the avatar 360° and cycles through speech bubbles.
 */
export default function Avatar3D() {
  const reduce = useReducedMotion();
  const [clicks, setClicks] = useState(0);
  const message = MESSAGES[clicks % MESSAGES.length];
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw mouse coordinates relative to avatar center (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for fluid mouse following
  const springConfig = { damping: 22, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D body tilt transforms
  const tiltX = useTransform(smoothY, [-1, 1], [10, -10]);
  const tiltY = useTransform(smoothX, [-1, 1], [-14, 14]);

  // Head movement & rotation transforms
  const headX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const headY = useTransform(smoothY, [-1, 1], [-4, 4]);
  const headRotate = useTransform(smoothX, [-1, 1], [-5, 5]);

  // Eye gaze transforms
  const eyeX = useTransform(smoothX, [-1, 1], [-3.5, 3.5]);
  const eyeY = useTransform(smoothY, [-1, 1], [-2.5, 2.5]);

  useEffect(() => {
    if (reduce) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized distance from center (-1 to 1) clamped roughly to viewport
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseX.set(Math.max(-1, Math.min(1, dx)));
      mouseY.set(Math.max(-1, Math.min(1, dy)));
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reduce, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-[240px] max-w-full [perspective:900px] sm:w-[300px]"
    >
      {/* soft candy glow behind the character */}
      <div
        className="absolute inset-0 -z-10 scale-90 rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--accent-wash),var(--accent-2-wash)_55%,transparent_72%)] blur-2xl"
        aria-hidden
      />

      {/* speech bubble — sits by the waving hand (upper-left) */}
      <div className="absolute left-0 top-6 z-10 rounded-2xl rounded-bl-sm bg-candy px-3 py-1.5 shadow-lg pointer-events-none">
        <motion.span
          key={clicks}
          initial={reduce ? false : { scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="block font-mono text-[12px] font-medium text-white"
        >
          {message}
        </motion.span>
      </div>

      <motion.button
        type="button"
        onClick={() => setClicks((c) => c + 1)}
        aria-label="Wave back — click the avatar to make it spin"
        title="psst… click me"
        className="block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 [transform-style:preserve-3d]"
        animate={reduce ? undefined : { rotateY: clicks * 360 }}
        whileTap={reduce ? undefined : { scale: 0.93 }}
        transition={{ rotateY: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
      >
        <motion.div
          style={
            reduce
              ? undefined
              : {
                  rotateX: tiltX,
                  rotateY: tiltY,
                  transformStyle: "preserve-3d",
                }
          }
        >
          <svg
            viewBox="0 0 220 290"
            className="w-full"
            role="img"
            aria-label="Illustrated avatar of Danish, smiling and waving"
          >
            <defs>
              <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
              <linearGradient id="pantsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6f4aa8" />
                <stop offset="100%" stopColor="#1e3a5f" />
              </linearGradient>
              <radialGradient id="faceShade" cx="38%" cy="34%" r="75%">
                <stop offset="0%" stopColor="#ffd9b8" />
                <stop offset="100%" stopColor="#eeb98c" />
              </radialGradient>
            </defs>

            {/* ground shadow */}
            <ellipse cx="110" cy="280" rx="54" ry="8" fill="rgba(56,189,248,0.18)" />

            <g className="char-bob">
              {/* ── legs ── */}
              <g className="char-leg-l">
                <rect x="92" y="202" width="15" height="52" rx="7.5" fill="url(#pantsGrad)" />
                <ellipse cx="99" cy="256" rx="12" ry="7" fill="#0f1e33" />
              </g>
              <g className="char-leg-r">
                <rect x="113" y="202" width="15" height="52" rx="7.5" fill="url(#pantsGrad)" />
                <ellipse cx="121" cy="256" rx="12" ry="7" fill="#0f1e33" />
              </g>

              {/* ── left arm (sways) ── */}
              <g className="char-arm-l">
                <rect x="137" y="156" width="14" height="60" rx="7" fill="url(#shirtGrad)" />
                <circle cx="144" cy="216" r="9" fill="url(#faceShade)" />
              </g>

              {/* ── torso ── */}
              <path
                d="M82 156 q0 -14 14 -16 l28 0 q14 2 14 16 l0 44 q0 10 -12 11 l-32 0 q-12 -1 -12 -11 z"
                fill="url(#shirtGrad)"
              />
              {/* subtle 3-D shading on the torso */}
              <path
                d="M110 142 l30 0 q4 1 5 14 l0 44 q0 10 -12 11 l-23 0 z"
                fill="rgba(43,27,61,0.10)"
              />
              {/* collar + button placket */}
              <path d="M104 142 l6 9 l6 -9" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="2.4" strokeLinecap="round" />
              <line x1="110" y1="153" x2="110" y2="196" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" />

              {/* ── head group with mouse following (shifts & rotates slightly) ── */}
              <motion.g
                style={
                  reduce
                    ? undefined
                    : {
                        x: headX,
                        y: headY,
                        rotate: headRotate,
                        transformOrigin: "110px 135px",
                      }
                }
              >
                {/* ── neck ── */}
                <rect x="101" y="132" width="18" height="16" rx="6" fill="#eeb98c" />

                {/* ── ears & face ── */}
                <ellipse cx="72" cy="116" rx="7" ry="9" fill="#eeb98c" />
                <ellipse cx="148" cy="116" rx="7" ry="9" fill="#eeb98c" />
                <circle cx="110" cy="112" r="39" fill="url(#faceShade)" />

                {/* blush */}
                <ellipse cx="88" cy="126" rx="8" ry="5" fill="rgba(37,99,235,0.30)" />
                <ellipse cx="132" cy="126" rx="8" ry="5" fill="rgba(37,99,235,0.30)" />

                {/* hair */}
                <path
                  d="M73 110 q-4 -44 37 -47 q41 3 37 47 q-10 -16 -24 -16 q6 6 4 14 q-10 -14 -22 -12 q4 6 0 12 q-10 -12 -22 -2 q-4 4 -7 4 z"
                  fill="#3a2a22"
                />

                {/* glasses */}
                <g stroke="#0f1e33" strokeWidth="2.6" fill="rgba(255,255,255,0.18)">
                  <rect x="83" y="103" width="25" height="21" rx="9" />
                  <rect x="112" y="103" width="25" height="21" rx="9" />
                </g>
                <line x1="108" y1="111" x2="112" y2="111" stroke="#0f1e33" strokeWidth="2.6" />
                <line x1="71" y1="112" x2="83" y2="110" stroke="#0f1e33" strokeWidth="2.6" strokeLinecap="round" />
                <line x1="137" y1="110" x2="149" y2="112" stroke="#0f1e33" strokeWidth="2.6" strokeLinecap="round" />

                {/* eyes — tracking mouse cursor with CSS blinking animation preserved */}
                <motion.g style={reduce ? undefined : { x: eyeX, y: eyeY }}>
                  <circle className="char-blink" cx="95" cy="114" r="3.4" fill="#0f1e33" />
                </motion.g>
                <motion.g style={reduce ? undefined : { x: eyeX, y: eyeY }}>
                  <circle className="char-blink" cx="125" cy="114" r="3.4" fill="#0f1e33" />
                </motion.g>

                {/* smile */}
                <path d="M95 130 q15 16 30 0 q-15 7 -30 0 z" fill="#0f1e33" />
                <path d="M99 131 q11 6 22 0" fill="#ffffff" opacity="0.9" />
              </motion.g>

              {/* ── right arm (waves) — drawn last so the raised hand is in front of the head ── */}
              <g className="char-wave">
                <rect x="67" y="80" width="14" height="86" rx="7" fill="url(#shirtGrad)" />
                <circle cx="74" cy="80" r="9.5" fill="url(#faceShade)" />
              </g>
            </g>
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
}
