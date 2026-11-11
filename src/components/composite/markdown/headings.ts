export type HeadingLink = { id: string; title: string };

export function slugifyHeading(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug || "section";
}

export function stripInlineMarks(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractHeadings(markdown: string): HeadingLink[] {
  const seen = new Map<string, number>();
  const headings: HeadingLink[] = [];
  let fenced = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      fenced = !fenced;
      continue;
    }
    if (fenced || !line.startsWith("## ")) continue;

    const title = stripInlineMarks(line.slice(3).trim());
    const base = slugifyHeading(title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    headings.push({
      id: count === 0 ? base : `${base}-${count + 1}`,
      title,
    });
  }

  return headings;
}

export function showContents(headings: HeadingLink[]) {
  return headings.length >= 2;
}

export function remarkHeadingIds(headings: HeadingLink[]) {
  return () => (tree: MdastNode) => {
    let index = 0;

    function visit(node: MdastNode) {
      if (node.type === "heading" && node.depth === 2) {
        const id = headings[index]?.id;
        index += 1;
        if (id) {
          node.data = { hProperties: { id } };
        }
      }
      for (const child of node.children ?? []) {
        visit(child);
      }
    }

    visit(tree);
  };
}

type MdastNode = {
  type: string;
  depth?: number;
  children?: MdastNode[];
  data?: { hProperties?: { id?: string } };
};
