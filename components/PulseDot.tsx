/**
 * Small teal status dot with a soft pulsing ping halo.
 * The halo is purely decorative and is suppressed under prefers-reduced-motion.
 */
export default function PulseDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 ${className}`} aria-hidden>
      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 animate-ping-soft" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
    </span>
  );
}
