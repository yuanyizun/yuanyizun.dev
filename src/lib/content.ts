import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  content: string;
};

export type Project = Post & {
  url?: string;
  period?: string;
  kind?: string;
  context?: string;
  role?: string;
  stack?: string[];
  stages?: string[];
  group?: "work" | "personal";
};

const postsDirectory = path.join(process.cwd(), "content", "posts");
const projectsDirectory = path.join(process.cwd(), "content", "projects");

type Entry = {
  slug: string;
  data: Record<string, unknown>;
  content: string;
};

function formatDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
}

function readEntries(directory: string): Entry[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.slice(0, -".md".length);
      const raw = fs.readFileSync(path.join(directory, filename), "utf8");
      const parsed = matter(raw);
      return {
        slug,
        data: parsed.data as Record<string, unknown>,
        content: parsed.content.trim(),
      };
    });
}

function requireText(data: Record<string, unknown>, key: string, slug: string) {
  const value = data[key];
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${slug}.md is missing frontmatter field "${key}"`);
  }
  return value;
}

function optionalText(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return undefined;
}

function optionalList(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
  return items.length > 0 ? items : undefined;
}

function toPost(entry: Entry): Post {
  const date = formatDate(entry.data.date);
  if (!date) {
    throw new Error(`${entry.slug}.md is missing frontmatter field "date"`);
  }

  return {
    slug: entry.slug,
    title: requireText(entry.data, "title", entry.slug),
    date,
    summary: requireText(entry.data, "summary", entry.slug),
    content: entry.content,
  };
}

function toProject(entry: Entry): Project {
  const url = entry.data.url;
  const group = entry.data.group;
  return {
    ...toPost(entry),
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

function publishedEntries(directory: string) {
  return readEntries(directory).filter((entry) => entry.data.draft !== true);
}

function byDateDescending(left: { date: string }, right: { date: string }) {
  if (left.date === right.date) return 0;
  return left.date < right.date ? 1 : -1;
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  return publishedEntries(postsDirectory).map(toPost).sort(byDateDescending);
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  const posts = publishedEntries(postsDirectory).map(toPost);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  return publishedEntries(projectsDirectory)
    .map(toProject)
    .sort(byDateDescending);
}

export async function getProject(slug: string): Promise<Project | null> {
  "use cache";
  const projects = publishedEntries(projectsDirectory).map(toProject);
  return projects.find((project) => project.slug === slug) ?? null;
}
