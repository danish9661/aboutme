"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

/**
 * Register-fill scroll progress: a solid royal-violet bar that fills
 * left→right, led by a soft-violet live node. Bar = progress, node = live.
 * Hidden under prefers-reduced-motion.
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
      <motion.div style={{ width }} className="relative h-full bg-accent">
        <span className="absolute right-0 top-1/2 h-2 w-2 -translate-y-1/2 translate-x-1/2 rounded-full bg-accent-2 shadow-[0_0_8px_2px_rgba(124,58,237,0.55)]" />
      </motion.div>
    </div>
  );
}
