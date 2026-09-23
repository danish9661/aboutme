import { Link } from "next-view-transitions";
import type { ProjectData } from "@/lib/projects";
import Badge from "./Badge";
import Chip from "./Chip";

export default function ProjectCard({ project }: { project: ProjectData }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors duration-200 hover:border-accent/50 sm:p-8">
      {/* register address rail — solid violet, always visible */}
      <span
        className="absolute inset-y-0 left-0 w-1 bg-accent"
        aria-hidden
      />

      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-bg text-[20px]"
            aria-hidden
          >
            {project.glyph}
          </span>
          <h3
            style={{ viewTransitionName: `project-title-${project.id}` }}
            className="text-xl font-semibold tracking-tightest text-ink"
          >
            {project.title}
          </h3>
        </div>
        {project.badge && (
          <Badge
            label={project.badge.label}
            variant={project.badge.variant}
            pulse={project.badge.pulse}
          />
        )}
      </div>

      <p className="text-[15px] leading-relaxed text-ink-2">{project.description}</p>

      {project.callout && (
        <div className="mt-6 rounded-xl border border-accent/15 bg-accent-wash p-5">
          <p className="text-[14px] leading-relaxed text-ink">{project.callout}</p>
        </div>
      )}

      {project.why && (
        <p className="mt-4 text-[14px] leading-relaxed text-ink-3">{project.why}</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        {project.chips.map((chip) => (
          <Chip key={chip}>{chip}</Chip>
        ))}
      </div>

      {project.link && (
        <div className="mt-auto pt-6">
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
        </div>
      )}
    </article>
  );
}
