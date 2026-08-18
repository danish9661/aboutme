const RINGS = Array.from({ length: 10 });

/**
 * Spiral-bound notebook with handwritten "field notes" — a personal touch
 * (inspired by danielsun.space). Uses the handwriting font and a yellow
 * highlighter to bring in the warm accent.
 */
export default function Notebook() {
  return (
    <div className="relative mx-auto max-w-md rotate-[-1.6deg]">
      {/* spiral binding */}
      <div className="absolute -top-2.5 left-7 right-7 z-10 flex justify-between" aria-hidden>
        {RINGS.map((_, i) => (
          <span
            key={i}
            className="block h-5 w-3.5 rounded-full border-2 border-ink/30 bg-bg shadow-[inset_0_-2px_2px_rgba(0,0,0,0.12)]"
          />
        ))}
      </div>

      {/* a bit of "tape" */}
      <span
        className="absolute -right-3 -top-3 z-20 h-8 w-16 rotate-12 rounded-sm bg-accent-3/40 backdrop-blur-sm"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface px-9 pb-9 pt-10 shadow-[0_34px_70px_-28px_rgba(132,94,194,0.5)]">
        {/* ruled lines */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent 0 35px, rgba(132,94,194,0.12) 35px 36px)",
          }}
          aria-hidden
        />
        {/* margin line */}
        <div className="pointer-events-none absolute bottom-0 left-14 top-0 w-px bg-accent/25" aria-hidden />

        <div className="relative font-hand text-ink">
          <p className="text-[30px] font-bold leading-none">how i build —</p>

          <ul className="mt-5 space-y-[11px] text-[23px] leading-snug">
            <li>
              1. find what actually{" "}
              <mark className="rounded bg-accent-3/60 px-1" style={{ color: "#241733" }}>
                matters
              </mark>
            </li>
            <li>2. ship the smallest thing that actually works</li>
            <li>3. put it in front of real users, fast</li>
            <li>4. measure → fix → repeat</li>
          </ul>

          <div className="mt-5 flex items-center gap-3 text-[22px] text-accent">
            <span>so far, so good</span>
            <span className="text-accent-2" aria-hidden>
              ∿∿∿
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
