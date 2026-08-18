import PulseDot from "./PulseDot";

const BARS = [42, 58, 34, 72, 50, 88, 64, 76];

/**
 * Floating phone mockup showing a realistic ArbFlow analytics dashboard.
 * The screen uses a true phone aspect ratio (~9:19.3) so proportions read
 * correctly. Float is disabled under prefers-reduced-motion.
 */
export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[252px] max-w-full sm:w-[280px]">
      {/* glow */}
      <div
        className="absolute inset-0 -z-10 scale-95 rounded-[3.2rem] bg-[radial-gradient(circle_at_50%_30%,var(--accent-wash),var(--accent-2-wash)_55%,transparent_72%)] blur-3xl"
        aria-hidden
      />

      <div className="animate-float relative rounded-[2.9rem] border-[3px] border-[#2a2a2e] bg-[#0e0e10] p-[6px] shadow-[0_40px_80px_-30px_rgba(132,94,194,0.6)]">
        {/* side buttons */}
        <span className="absolute -left-[5px] top-24 h-11 w-[3px] rounded-l bg-[#2a2a2e]" aria-hidden />
        <span className="absolute -left-[5px] top-[150px] h-11 w-[3px] rounded-l bg-[#2a2a2e]" aria-hidden />
        <span className="absolute -right-[5px] top-32 h-16 w-[3px] rounded-r bg-[#2a2a2e]" aria-hidden />

        {/* screen — true phone aspect ratio */}
        <div className="relative flex aspect-[9/19.3] flex-col overflow-hidden rounded-[2.4rem] bg-surface">
          {/* dynamic island */}
          <div className="absolute left-1/2 top-2.5 z-20 h-6 w-[5.5rem] -translate-x-1/2 rounded-full bg-black" aria-hidden />

          {/* status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3 text-ink">
            <span className="font-mono text-[11px] font-semibold">9:41</span>
            <span className="flex items-center gap-1" aria-hidden>
              <span className="text-[8px] tracking-tighter">●●●</span>
              <span className="ml-0.5 inline-block h-2.5 w-4 rounded-[3px] border border-ink/60" />
            </span>
          </div>

          {/* app header */}
          <div className="bg-candy px-5 py-3 text-white">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[14px] font-semibold">ArbFlow</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2 py-0.5 font-mono text-[10px]">
                <PulseDot />
                live
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-white/80">
              workspace · acme-co
            </p>
          </div>

          {/* body fills the remaining height */}
          <div className="flex flex-1 flex-col justify-between px-5 py-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-3">
                Active users · 7d
              </p>
              <div className="mt-1 flex items-end gap-2">
                <span className="text-[30px] font-semibold tracking-tightest text-ink">
                  12,480
                </span>
                <span className="mb-1.5 font-mono text-[11px] text-accent">▲ 8.2%</span>
              </div>
            </div>

            {/* bar chart */}
            <div>
              <div className="flex h-28 items-end justify-between gap-1.5">
                {BARS.map((h, i) => (
                  <div
                    key={i}
                    className="w-full rounded-t-md bg-candy"
                    style={{ height: `${h}%`, opacity: 0.5 + (i % 3) * 0.2 }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[8px] text-ink-3">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>

            {/* stat tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-line bg-bg px-3 py-2.5">
                <p className="font-mono text-[8px] uppercase tracking-wide text-ink-3">
                  Tenants
                </p>
                <p className="text-[16px] font-semibold text-ink">24</p>
              </div>
              <div className="rounded-xl border border-line bg-bg px-3 py-2.5">
                <p className="font-mono text-[8px] uppercase tracking-wide text-ink-3">
                  Uptime
                </p>
                <p className="text-[16px] font-semibold text-ink">99.9%</p>
              </div>
            </div>
          </div>

          {/* home indicator */}
          <div className="flex justify-center pb-2">
            <span className="h-1 w-24 rounded-full bg-ink/25" aria-hidden />
          </div>
        </div>
      </div>

      {/* understated label so the figures read as an illustration, not real metrics */}
      <p className="mt-3 text-center font-mono text-[11px] text-ink-3">
        Sample workspace · UI preview
      </p>
    </div>
  );
}
