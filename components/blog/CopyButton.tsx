"use client";

import { useState } from "react";

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="absolute right-3 top-3 z-10 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[11px] text-white/80 opacity-0 transition-all hover:bg-white/20 focus-visible:opacity-100 group-hover:opacity-100"
    >
      {copied ? "Copied ✓" : "Copy"}
    </button>
  );
}
