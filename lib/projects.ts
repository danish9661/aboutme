import { PORTFOLIO_CONFIG, type ProjectData, type BadgeVariant } from "@/config/portfolio";

export type { ProjectData, BadgeVariant };

export const PROJECTS: ProjectData[] = PORTFOLIO_CONFIG.projects as ProjectData[];

export const PROJECTS_BY_ID: Record<string, ProjectData> = Object.fromEntries(
  PROJECTS.map((p) => [p.id, p]),
);
