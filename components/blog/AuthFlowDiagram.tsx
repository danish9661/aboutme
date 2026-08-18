export interface FlowStep {
  from: string;
  to: string;
  label: string;
  note?: string;
  highlight?: "danger" | "success";
  /** Corner pill text on a highlighted step; falls back to a sensible default. */
  tag?: string;
}

/** Actor → colour, drawn from the Gradient Candy palette. "Browser" is the
 * neutral actor and uses the theme-aware ink token so it stays legible in
 * both light and dark. */
const ACTOR_COLOR: Record<string, string> = {
  Browser: "var(--ink-2)",
  Google: "#d98324",
  Backend: "#845ec2",
  Frontend: "#ff4e9b",
};

const HL = {
  danger: {
    bg: "rgba(255,107,107,0.12)",
    border: "rgba(226,86,59,0.42)",
    color: "#e2563b",
    tag: "exposed",
  },
  success: {
    bg: "rgba(47,158,88,0.13)",
    border: "rgba(47,158,88,0.45)",
    color: "#2f9e58",
    tag: "safe",
  },
} as const;

function actorColor(name: string) {
  return ACTOR_COLOR[name] ?? "var(--ink-2)";
}

/**
 * A lightweight, dependency-free stand-in for a Mermaid sequence diagram:
 * a vertical, numbered flow between actors, with individual hops that can be
 * flagged danger (red) or success (green). Built from div/span only so the
 * blog's `.prose-blog` element rules never touch it. Responsive by design —
 * reads top-to-bottom on any width.
 */
export default function AuthFlowDiagram({
  caption,
  steps,
}: {
  caption?: string;
  steps: FlowStep[];
}) {
  const actors = Array.from(new Set(steps.flatMap((s) => [s.from, s.to])));

  return (
    <div className="my-9 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_50px_-24px_rgba(132,94,194,0.35)]">
      <div className="bg-candy h-1.5 w-full" aria-hidden />
      <div className="p-5 sm:p-6">
        {caption && (
          <div className="mb-5 text-[13px] italic leading-relaxed text-ink-2">
            {caption}
          </div>
        )}

        {/* actor legend */}
        <div className="mb-6 flex flex-wrap gap-x-4 gap-y-2">
          {actors.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em]"
              style={{ color: actorColor(a) }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: actorColor(a) }}
                aria-hidden
              />
              {a}
            </span>
          ))}
        </div>

        {/* steps */}
        <div className="relative">
          {/* connector rail behind the number badges */}
          <span
            className="absolute bottom-3 left-3 top-3 w-px bg-line-strong"
            aria-hidden
          />
          <div className="relative space-y-2.5">
            {steps.map((s, i) => {
              const hl = s.highlight ? HL[s.highlight] : null;
              const isSelf = s.from === s.to;
              return (
                <div key={i} className="flex gap-3">
                  <span
                    className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-medium text-white shadow-sm"
                    style={{ background: hl ? hl.color : "var(--accent-2)" }}
                    aria-hidden
                  >
                    {i + 1}
                  </span>
                  <div
                    className={`flex-1 ${hl ? "rounded-xl border p-3" : "pt-0.5"}`}
                    style={
                      hl
                        ? { background: hl.bg, borderColor: hl.border }
                        : undefined
                    }
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-[0.06em]">
                        <span style={{ color: actorColor(s.from) }}>{s.from}</span>
                        <span className="mx-1 text-ink-3" aria-hidden>
                          {isSelf ? "↻" : "→"}
                        </span>
                        <span style={{ color: actorColor(s.to) }}>{s.to}</span>
                      </span>
                      {hl && (
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 font-mono text-[9.5px] font-medium uppercase tracking-[0.08em] text-white"
                          style={{ background: hl.color }}
                        >
                          {s.tag ?? hl.tag}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-[13.5px] leading-snug text-ink">
                      {s.label}
                    </div>
                    {s.note && (
                      <div className="mt-1.5 text-[12.5px] leading-snug text-ink-2">
                        {s.note}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
