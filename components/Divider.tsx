/**
 * Register rule between sections — a plain 1px line, left-anchored tick.
 * The tick marks the address of the section that follows; no centered
 * ornament, no gradient hairline.
 */
export default function Divider() {
  return (
    <div className="flex w-full items-center gap-3" aria-hidden>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2/60" />
      <div className="h-px w-full bg-line" />
    </div>
  );
}
