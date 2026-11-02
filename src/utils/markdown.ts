export type HeadingLink = { id: string; title: string };

export function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "section";
}

export function extractHeadings(markdown: string): HeadingLink[] {
  const seen = new Map<string, number>();

  return markdown
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const title = line.slice(3).trim();
      const base = slugifyHeading(title);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return {
        id: count === 0 ? base : `${base}-${count + 1}`,
        title,
      };
    });
}

export function readingMinutes(markdown: string) {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
