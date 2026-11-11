import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isDraft, isListed, parseFrontmatter } from "@/data/internal/frontmatter";

export type MarkdownEntry = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  archived: boolean;
  data: Record<string, unknown>;
  content: string;
};

function readRoutableFiles(directory: string): MarkdownEntry[] {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => {
      const slug = filename.slice(0, -".md".length);
      const raw = fs.readFileSync(path.join(directory, filename), "utf8");
      const parsed = matter(raw);
      const frontmatter = parseFrontmatter(parsed.data, slug);
      if (isDraft(frontmatter)) {
        return [];
      }

      return [
        {
          slug,
          title: frontmatter.title,
          date: frontmatter.date,
          summary: frontmatter.summary,
          archived: frontmatter.archived,
          data: parsed.data as Record<string, unknown>,
          content: parsed.content.trim(),
        },
      ];
    });
}

/** Drafts are omitted. Archived entries stay so their URLs still resolve. */
export function readRoutableEntries(directory: string): MarkdownEntry[] {
  return readRoutableFiles(directory);
}

/** Drafts and archived entries are omitted from listings and the sitemap. */
export function readPublishedEntries(directory: string): MarkdownEntry[] {
  return readRoutableFiles(directory).filter((entry) =>
    isListed({ draft: false, archived: entry.archived }),
  );
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

export function byDateDescending(left: { date: string }, right: { date: string }) {
  if (left.date === right.date) return 0;
  return left.date < right.date ? 1 : -1;
}
