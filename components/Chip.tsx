export default function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-line bg-bg px-2.5 py-1 font-mono text-[11px] text-ink-2">
      {children}
    </span>
  );
}
