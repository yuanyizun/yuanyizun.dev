import "server-only";
import path from "node:path";
import {
  byDateDescending,
  formatFrontmatterDate,
  readPublishedEntries,
  requireText,
  type MarkdownEntry,
} from "@/data/internal/markdown";
import type { ContentRecord } from "@/data/internal/types";

export type Post = ContentRecord;

const postsDirectory = path.join(process.cwd(), "content", "posts");

function toPost(entry: MarkdownEntry): Post {
  const date = formatFrontmatterDate(entry.data.date);
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

export async function getPosts(): Promise<Post[]> {
  "use cache";
  return readPublishedEntries(postsDirectory).map(toPost).sort(byDateDescending);
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  const posts = readPublishedEntries(postsDirectory).map(toPost);
  return posts.find((post) => post.slug === slug) ?? null;
}
