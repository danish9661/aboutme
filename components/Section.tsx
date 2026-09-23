import type { ReactNode } from "react";
import Divider from "./Divider";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section eyebrow: small mono register tag — `scope · name`.
 * Lowercase, single accent-2 tick; the tick marks a live register,
 * never decoration. No ALL-CAPS tracking, no centered ornament.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 font-mono text-[12px] text-ink-3">
      <span className="h-1.5 w-1.5 rounded-full bg-accent-2" aria-hidden />
      <span className="text-ink-2">~/</span>
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
