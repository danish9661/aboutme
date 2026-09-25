"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link } from "next-view-transitions";
import type { ProjectData } from "@/lib/projects";
import Badge from "./Badge";
import Chip from "./Chip";

/** Shorten a URL to `host/path` for the readout; relative hrefs pass through. */
function hostPath(href: string): string {
  try {
    const u = new URL(href);
    return `${u.hostname}${u.pathname}`.replace(/\/$/, "");
  } catch {
    return href;
  }
}

interface ProjectCardProps {
  project: ProjectData;
}

/**
 * Project card — a register entry.
 *
 * Collapsed shows the monogram + full title (never truncated), the one-line
 * tag, and chips. Clicking anywhere on the card opens a small floating
 * dialog with the full readout: description, why-it-matters, the
 * id/demo/source registers, and the demo/source actions. The demo/source
 * links stop propagation so they fire directly without opening the dialog.
 */
export default function ProjectCard({ project }: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const detailsId = `project-details-${project.id}`;
  const isInternal = project.link?.href.startsWith("/") ?? false;
  const reduce = useReducedMotion();

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  // Escape closes; body scroll locks while the floating card is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDialog();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeDialog]);

  return (
    <>
      <article
        onClick={openDialog}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openDialog();
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`Open details for ${project.title}`}
        className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors duration-200 hover:border-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:p-8"
      >
        {/* register address rail — solid violet, always visible */}
        <span
          className="absolute inset-y-0 left-0 w-1 bg-accent"
          aria-hidden
        />

        <div className="mb-4 flex items-start gap-4">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-bg font-mono text-[13px] font-semibold tracking-tight text-accent"
            aria-hidden
          >
            {project.glyph}
          </span>
          <span className="min-w-0">
            <span
              style={{ viewTransitionName: `project-title-${project.id}` }}
              className="block text-xl font-semibold leading-snug tracking-tightest text-ink"
            >
              {project.title}
            </span>
            <span className="mt-1 block font-mono text-[11px] text-ink-3 transition-colors group-hover:text-accent">
              open readout +
            </span>
          </span>
        </div>

        <p className="font-mono text-[12px] leading-relaxed text-ink-2">
          {project.tag}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.chips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>

        {(project.link || project.sourceUrl) && (
          <div
            className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {project.link && (
              <Link
                href={project.link.href}
                className="inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-accent transition-colors hover:text-accent-bright"
              >
                {project.link.label.replace(/\s*→\s*$/, "")}
                <span
                  aria-hidden
                  className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none"
                >
                  →
                </span>
              </Link>
            )}
            {project.sourceUrl && (
              <a
                href={project.sourceUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-mono text-[12px] text-ink-3 underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
              >
                Source
              </a>
            )}
          </div>
        )}
      </article>

      {/* floating readout dialog */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-hidden
              tabIndex={-1}
              onClick={closeDialog}
              className="fixed inset-0 z-40 cursor-default bg-black/30 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${detailsId}-title`}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={closeDialog}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-line bg-surface p-7 shadow-2xl sm:p-8"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
              >
                <span
                  className="absolute inset-y-0 left-0 w-1 bg-accent"
                  aria-hidden
                />
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-bg font-mono text-[13px] font-semibold tracking-tight text-accent"
                      aria-hidden
                    >
                      {project.glyph}
                    </span>
                    <h3
                      id={`${detailsId}-title`}
                      className="text-xl font-semibold leading-snug tracking-tightest text-ink"
                    >
                      {project.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeDialog}
                    autoFocus={!reduce}
                    aria-label={`Close details for ${project.title}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-bg text-ink-2 transition-colors hover:border-accent hover:text-accent"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M3 3l8 8M11 3l-8 8"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 font-mono text-[12px] leading-relaxed text-ink-2">
                  {project.tag}
                </p>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
                  {project.description}
                </p>

                {(project.callout || project.why) && (
                  <div className="mt-5 rounded-xl border border-line bg-bg p-5">
                    {project.callout && (
                      <p className="text-[14px] leading-relaxed text-ink">
                        {project.callout}
                      </p>
                    )}
                    {project.why && (
                      <div className={project.callout ? "mt-3" : ""}>
                        <p className="font-mono text-[11px] text-ink-3">
                          why it matters
                        </p>
                        <p className="mt-1 text-[14px] leading-relaxed text-ink-2">
                          {project.why}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <dl className="mt-5 space-y-2 border-t border-line pt-5 font-mono text-[12px]">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="shrink-0 text-ink-3">id</dt>
                    <dd className="truncate text-ink-2">{project.id}</dd>
                  </div>
                  {project.link && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="shrink-0 text-ink-3">
                        {isInternal ? "case study" : "demo"}
                      </dt>
                      <dd
                        className="truncate text-ink-2"
                        title={project.link.href}
                      >
                        {hostPath(project.link.href)}
                      </dd>
                    </div>
                  )}
                  {project.sourceUrl && (
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="shrink-0 text-ink-3">source</dt>
                      <dd
                        className="truncate text-ink-2"
                        title={project.sourceUrl}
                      >
                        {hostPath(project.sourceUrl)}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="mt-6 flex flex-wrap gap-2">
                  {project.chips.map((chip) => (
                    <Chip key={chip}>{chip}</Chip>
                  ))}
                </div>

                {(project.link || project.sourceUrl) && (
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                    {project.link && (
                      <Link
                        href={project.link.href}
                        className="inline-flex items-center gap-1.5 font-mono text-[13px] font-medium text-accent transition-colors hover:text-accent-bright"
                      >
                        {project.link.label.replace(/\s*→\s*$/, "")}
                        <span aria-hidden>→</span>
                      </Link>
                    )}
                    {project.sourceUrl && (
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="font-mono text-[12px] text-ink-3 underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent"
                      >
                        Source
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
