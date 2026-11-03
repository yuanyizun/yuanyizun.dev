import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import {
  byDateDescending,
  formatFrontmatterDate,
  readPublishedEntries,
  requireText,
  type MarkdownEntry,
} from "@/data/internal/markdown";
import type { ContentRecord } from "@/data/internal/types";

export type Post = ContentRecord & {
  image: string;
  credit?: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");
const imagesDirectory = path.join(process.cwd(), "public", "images");
const creditsPath = path.join(imagesDirectory, "credits.json");
const imagePattern = /^\/images\/([^/]+\.(?:jpe?g|png|webp|svg))$/i;

type CreditEntry = {
  file?: string;
  credit?: string;
};

function creditForFilename(filename: string): string | undefined {
  if (!fs.existsSync(creditsPath)) {
    return undefined;
  }

  const entries = JSON.parse(fs.readFileSync(creditsPath, "utf8")) as CreditEntry[];
  const match = entries.find((entry) => {
    if (typeof entry.file !== "string") {
      return false;
    }
    const base = path.basename(entry.file);
    return base === filename || entry.file.endsWith(`/${filename}`);
  });

  return typeof match?.credit === "string" && match.credit.length > 0
    ? match.credit
    : undefined;
}

function requireImage(data: Record<string, unknown>, slug: string) {
  const value = requireText(data, "image", slug);
  const match = imagePattern.exec(value);
  if (!match || value.includes("..") || value.includes("?")) {
    throw new Error(
      `${slug}.md image must be a local /images/<filename> path with jpg, jpeg, png, webp, or svg`,
    );
  }

  const filename = match[1];
  const absolute = path.join(imagesDirectory, filename);
  if (!fs.existsSync(absolute)) {
    throw new Error(`${slug}.md image file is missing: ${value}`);
  }

  return { image: value, credit: creditForFilename(filename) };
}

function toPost(entry: MarkdownEntry): Post {
  const date = formatFrontmatterDate(entry.data.date);
  if (!date) {
    throw new Error(`${entry.slug}.md is missing frontmatter field "date"`);
  }

  const { image, credit } = requireImage(entry.data, entry.slug);

  return {
    slug: entry.slug,
    title: requireText(entry.data, "title", entry.slug),
    date,
    summary: requireText(entry.data, "summary", entry.slug),
    content: entry.content,
    image,
    ...(credit ? { credit } : {}),
  };
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");
  return readPublishedEntries(postsDirectory).map(toPost).sort(byDateDescending);
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("days");
  cacheTag("posts", `post:${slug}`);
  const posts = readPublishedEntries(postsDirectory).map(toPost);
  return posts.find((post) => post.slug === slug) ?? null;
}
