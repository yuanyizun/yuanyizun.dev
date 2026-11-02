import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type MarkdownEntry = {
  slug: string;
  data: Record<string, unknown>;
  content: string;
};

export function formatFrontmatterDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === "string") {
    return value;
  }
  return "";
}

export function requireText(data: Record<string, unknown>, key: string, slug: string) {
  const value = data[key];
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${slug}.md is missing frontmatter field "${key}"`);
  }
  return value;
}

export function optionalText(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  return undefined;
}

export function optionalList(data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (!Array.isArray(value)) {
    return undefined;
  }
  const items = value.filter(
    (item): item is string => typeof item === "string" && item.length > 0,
  );
  return items.length > 0 ? items : undefined;
}

export function readPublishedEntries(directory: string): MarkdownEntry[] {
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
    })
    .filter((entry) => entry.data.draft !== true);
}

export function byDateDescending(left: { date: string }, right: { date: string }) {
  if (left.date === right.date) return 0;
  return left.date < right.date ? 1 : -1;
}
