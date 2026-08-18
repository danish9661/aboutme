"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
}

/**
 * Hamburger disclosure for the primary links on phones (they're hidden on
 * `sm+` where the inline list shows). Keeps the Blog pill, theme toggle, and
 * brand always visible in Nav; this only handles the section links on mobile.
 */
export default function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  // Close on Escape, and lock body scroll while the panel is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface/80 text-ink transition-colors hover:border-accent hover:text-accent"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
          {open ? (
            <path
              d="M4 4l10 10M14 4L4 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M2.5 5h13M2.5 9h13M2.5 13h13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* backdrop */}
            <motion.button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 top-14 z-40 bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            {/* panel — opaque surface (custom var() colors can't take an alpha modifier) */}
            <motion.div
              className="fixed inset-x-0 top-14 z-50 border-b border-line bg-surface shadow-xl"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <ul className="mx-auto flex max-w-page flex-col gap-1 px-6 py-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 font-mono text-[13px] uppercase tracking-[0.1em] text-ink-2 transition-colors hover:bg-accent-wash hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
