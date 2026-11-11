import "server-only";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import {
  byDateDescending,
  optionalList,
  optionalText,
  readPublishedEntries,
  readRoutableEntries,
  type MarkdownEntry,
} from "@/data/internal/markdown";
import type { ContentRecord, ContentSummary } from "@/data/internal/types";

export type ProjectSummary = ContentSummary & {
  url?: string;
  period?: string;
  kind?: string;
  context?: string;
  role?: string;
  stack?: string[];
  stages?: string[];
  group?: "work" | "personal";
};

export type Project = ContentRecord & {
  url?: string;
  period?: string;
  kind?: string;
  context?: string;
  role?: string;
  stack?: string[];
  stages?: string[];
  group?: "work" | "personal";
};

const projectsDirectory = path.join(process.cwd(), "content", "projects");

function toProject(entry: MarkdownEntry): Project {
  const url = entry.data.url;
  const group = entry.data.group;
  return {
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    summary: entry.summary,
    content: entry.content,
    archived: entry.archived,
    url: typeof url === "string" && url.length > 0 ? url : undefined,
    period: optionalText(entry.data, "period"),
    kind: optionalText(entry.data, "kind"),
    context: optionalText(entry.data, "context"),
    role: optionalText(entry.data, "role"),
    stack: optionalList(entry.data, "stack"),
    stages: optionalList(entry.data, "stages"),
    group: group === "personal" ? "personal" : "work",
  };
}

function toSummary(project: Project): ProjectSummary {
  return {
    slug: project.slug,
    title: project.title,
    date: project.date,
    summary: project.summary,
    url: project.url,
    period: project.period,
    kind: project.kind,
    context: project.context,
    role: project.role,
    stack: project.stack,
    stages: project.stages,
    group: project.group,
  };
}

export async function getProjects(): Promise<ProjectSummary[]> {
  "use cache";
  cacheLife("days");
  cacheTag("projects");
  return readPublishedEntries(projectsDirectory)
    .map(toProject)
    .sort(byDateDescending)
    .map(toSummary);
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  cacheLife("days");
  cacheTag("projects", `project:${slug}`);
  const projects = readRoutableEntries(projectsDirectory).map(toProject);
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getProjectParams(): Promise<{ slug: string }[]> {
  "use cache";
  cacheLife("days");
  cacheTag("projects");
  return readRoutableEntries(projectsDirectory).map((entry) => ({ slug: entry.slug }));
}
