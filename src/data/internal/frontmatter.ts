import { z } from "zod";

const frontmatterSchema = z.object({
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  date: z.union([z.string(), z.date()]),
  draft: z.boolean().optional(),
  archived: z.boolean().optional(),
});

export type Frontmatter = {
  title: string;
  summary: string;
  date: string;
  draft: boolean;
  archived: boolean;
};

function calendarDay(value: string | Date): string | null {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    return value.toISOString().slice(0, 10);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.toISOString().slice(0, 10) !== value) return null;
  return value;
}

export function parseFrontmatter(data: unknown, slug: string): Frontmatter {
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const key = parsed.error.issues[0]?.path[0];
    const field = typeof key === "string" ? key : "title";
    throw new Error(`${slug}.md is missing frontmatter field "${field}"`);
  }

  const date = calendarDay(parsed.data.date);
  if (!date) {
    throw new Error(`${slug}.md is missing frontmatter field "date"`);
  }

  return {
    title: parsed.data.title,
    summary: parsed.data.summary,
    date,
    draft: parsed.data.draft ?? false,
    archived: parsed.data.archived ?? false,
  };
}

export function isDraft(frontmatter: { draft: boolean }) {
  return frontmatter.draft;
}

/** Published entries that belong in listings and the sitemap. */
export function isListed(frontmatter: { draft: boolean; archived: boolean }) {
  return !frontmatter.draft && !frontmatter.archived;
}
