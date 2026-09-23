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
    live: "bg-accent-2-wash text-accent-2 border-line",
    wash: "bg-accent-wash text-accent border-line",
    warm: "bg-accent-3-wash text-accent-3 border-line",
    candy: "bg-accent text-white border-transparent",
    muted: "bg-surface/70 text-ink-3 border-line",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] ${styles[variant]}`}
    >
      {pulse && <PulseDot />}
      {label}
    </span>
  );
}
