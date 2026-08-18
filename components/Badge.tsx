import PulseDot from "./PulseDot";

type BadgeVariant = "live" | "wash" | "warm" | "candy" | "muted";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Show a pulsing accent dot (used for the "Live" badge). */
  pulse?: boolean;
}

export default function Badge({ label, variant = "wash", pulse = false }: BadgeProps) {
  const styles: Record<BadgeVariant, string> = {
    live: "bg-accent-wash text-accent border-transparent",
    wash: "bg-accent-wash text-accent border-transparent",
    warm: "bg-accent-2-wash text-accent-2 border-transparent",
    candy: "bg-candy text-white border-transparent",
    muted: "bg-surface/70 text-ink-3 border-line",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] ${styles[variant]}`}
    >
      {pulse && <PulseDot />}
      {label}
    </span>
  );
}
