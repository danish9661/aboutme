/**
 * Full-bleed gradient hairline used between sections — softer and more vibrant
 * than a flat border, with a small centered signal tick.
 */
export default function Divider() {
  return (
    <div className="relative h-px w-full" aria-hidden>
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent/35 to-transparent" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg px-3 font-mono text-[10px] text-accent-2/70">
        ∿
      </span>
    </div>
  );
}
