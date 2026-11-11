import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import {
  byDateDescending,
  readPublishedEntries,
  readRoutableEntries,
  requireText,
  type MarkdownEntry,
} from "@/data/internal/markdown";
import type { ContentRecord, ContentSummary } from "@/data/internal/types";

export type PostSummary = ContentSummary & {
  image: string;
  alt: string;
  credit?: string;
};

export type Post = ContentRecord & {
  image: string;
  alt: string;
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

  return {
    image: value,
    alt: requireText(data, "alt", slug),
    credit: creditForFilename(filename),
  };
}

function toPost(entry: MarkdownEntry): Post {
  const { image, alt, credit } = requireImage(entry.data, entry.slug);

  return {
    slug: entry.slug,
    title: entry.title,
    date: entry.date,
    summary: entry.summary,
    content: entry.content,
    archived: entry.archived,
    image,
    alt,
    ...(credit ? { credit } : {}),
  };
}

function toSummary(post: Post): PostSummary {
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    summary: post.summary,
    image: post.image,
    alt: post.alt,
    ...(post.credit ? { credit: post.credit } : {}),
  };
}

export async function getPosts(): Promise<PostSummary[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");
  return readPublishedEntries(postsDirectory).map(toPost).sort(byDateDescending).map(toSummary);
}

export async function getPostArchive(): Promise<Post[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");
  return readPublishedEntries(postsDirectory).map(toPost).sort(byDateDescending);
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("days");
  cacheTag("posts", `post:${slug}`);
  const posts = readRoutableEntries(postsDirectory).map(toPost);
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getPostParams(): Promise<{ slug: string }[]> {
  "use cache";
  cacheLife("days");
  cacheTag("posts");
  return readRoutableEntries(postsDirectory).map((entry) => ({ slug: entry.slug }));
}
