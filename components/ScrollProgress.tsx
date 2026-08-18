"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Crisp scroll-progress indicator: a thin teal→bright gradient bar that fills
 * left→right with scroll, led by a glowing node. Replaces the ECG monitor —
 * clean and engineer-y rather than clinical. Hidden under prefers-reduced-motion.
 */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.3,
  });
  const width = useTransform(smooth, [0, 1], ["0%", "100%"]);

  if (reduce) return null;

  return (
    <div className="relative h-[3px] w-full bg-line/50" aria-hidden>
      <motion.div
        style={{ width }}
        className="relative h-full bg-gradient-to-r from-accent to-accent-bright"
      >
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-bright shadow-[0_0_8px_2px_rgba(20,184,166,0.7)]" />
      </motion.div>
    </div>
  );
}
