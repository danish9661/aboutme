"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Scroll-reveal: fade + 18px rise, once only, driven by IntersectionObserver.
 * Fail-safe: if IntersectionObserver is unavailable (so the observer could
 * never fire), content is shown immediately rather than left hidden. Final
 * state also shows immediately under prefers-reduced-motion.
 */
export default function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [noObserver, setNoObserver] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") setNoObserver(true);
  }, []);

  const show = reduce || noObserver || inView;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: show ? 1 : 0, y: show ? 0 : 18 }}
      transition={{ duration: 0.6, delay: reduce ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
