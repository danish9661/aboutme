import type { ReactNode } from "react";
import Divider from "./Divider";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section eyebrow: mono, 11px, uppercase, tracked, ink-3,
 * prefixed with the small teal "∿" signal tick.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
      <span className="text-accent" aria-hidden>
        ∿
      </span>
      {children}
    </p>
  );
}

export default function Section({ id, eyebrow, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-[120px] pb-20 sm:pb-28 ${className}`}>
      <Divider />
      <div className="mx-auto mt-20 w-full max-w-page px-6 sm:mt-28 sm:px-8">
        {eyebrow && (
          <div className="mb-8 sm:mb-12">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
