import "server-only";
import path from "node:path";
import {
  byDateDescending,
  formatFrontmatterDate,
  optionalList,
  optionalText,
  readPublishedEntries,
  requireText,
  type MarkdownEntry,
} from "@/data/internal/markdown";
import type { ContentRecord } from "@/data/internal/types";

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
  const date = formatFrontmatterDate(entry.data.date);
  if (!date) {
    throw new Error(`${entry.slug}.md is missing frontmatter field "date"`);
  }

  const url = entry.data.url;
  const group = entry.data.group;
  return {
    slug: entry.slug,
    title: requireText(entry.data, "title", entry.slug),
    date,
    summary: requireText(entry.data, "summary", entry.slug),
    content: entry.content,
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

export async function getProjects(): Promise<Project[]> {
  "use cache";
  return readPublishedEntries(projectsDirectory).map(toProject).sort(byDateDescending);
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  const projects = readPublishedEntries(projectsDirectory).map(toProject);
  return projects.find((project) => project.slug === slug) ?? null;
}
