import matter from "gray-matter";
import { z } from "zod";

const frontmatterSchema = z.object({
  title: z.string().trim().min(1),
  order: z.number().int().positive(),
  label: z.string().trim().min(1).optional(),
  draft: z.boolean().optional(),
});

export type QuestionBlock = {
  heading: string;
  kind: "kicker" | "result";
  markdown: string;
};

export type QuestionNote = {
  slug: string;
  title: string;
  label: string;
  order: number;
  draft: boolean;
  question: string;
  lead: string | null;
  intro: string | null;
  blocks: QuestionBlock[];
  searchText: string;
};

function sectionBody(content: string, heading: "Question" | "Answer") {
  const startRe = new RegExp(`^## ${heading}[ \\t]*\\n`, "m");
  const startMatch = startRe.exec(content);
  if (!startMatch) {
    return null;
  }
  const bodyStart = startMatch.index + startMatch[0].length;
  const rest = content.slice(bodyStart);
  const next = /^## /m.exec(rest);
  const body = next ? rest.slice(0, next.index) : rest;
  return body.trim();
}

function firstParagraph(markdown: string) {
  const match = /^(?!#)(?!\s*[-*+] |\s*\d+\. )([\s\S]*?)(?:\n\n|\n(?=#{1,6} )|$)/.exec(
    markdown,
  );
  if (!match) {
    return null;
  }
  const text = match[1].trim();
  if (!text || text.startsWith("```")) {
    return null;
  }
  return { text, end: match[0].length };
}

function splitAnswer(answer: string): {
  lead: string | null;
  intro: string | null;
  blocks: QuestionBlock[];
} {
  const headingPattern = /^### (.+)$/gm;
  const headings: { heading: string; index: number; end: number }[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(answer)) !== null) {
    headings.push({
      heading: match[1].trim(),
      index: match.index,
      end: match.index + match[0].length,
    });
  }

  const preface =
    headings.length === 0 ? answer.trim() : answer.slice(0, headings[0].index).trim();

  let lead: string | null = null;
  let intro: string | null = null;

  if (preface) {
    const first = firstParagraph(preface);
    if (first && preface.startsWith(first.text)) {
      lead = first.text;
      const rest = preface.slice(first.end).trim();
      intro = rest.length > 0 ? rest : null;
    } else {
      intro = preface;
    }
  }

  const blocks: QuestionBlock[] = headings.map((item, index) => {
    const next = headings[index + 1];
    const markdown = answer.slice(item.end, next ? next.index : answer.length).trim();
    return {
      heading: item.heading,
      kind: item.heading === "Result" ? "result" : "kicker",
      markdown,
    };
  });

  return { lead, intro, blocks };
}

export function parseQuestionFile(raw: string, slug: string): QuestionNote | null {
  const parsed = matter(raw);
  const frontmatter = frontmatterSchema.safeParse(parsed.data);
  if (!frontmatter.success) {
    const key = frontmatter.error.issues[0]?.path[0];
    const field = typeof key === "string" ? key : "title";
    throw new Error(`${slug}.md is missing frontmatter field "${field}"`);
  }

  const draft = frontmatter.data.draft ?? false;
  if (draft) {
    return null;
  }

  const content = parsed.content.trim();
  if (!content.startsWith("## Question")) {
    throw new Error(`${slug}.md must start with "## Question"`);
  }

  const question = sectionBody(content, "Question");
  const answer = sectionBody(content, "Answer");
  if (question === null) {
    throw new Error(`${slug}.md is missing "## Question"`);
  }
  if (answer === null) {
    throw new Error(`${slug}.md is missing "## Answer"`);
  }
  if (question.length === 0) {
    throw new Error(`${slug}.md Question section is empty`);
  }
  if (question !== frontmatter.data.title) {
    throw new Error(
      `${slug}.md Question text must match title frontmatter`,
    );
  }

  const { lead, intro, blocks } = splitAnswer(answer);
  const label = frontmatter.data.label ?? frontmatter.data.title;
  const searchParts = [
    frontmatter.data.title,
    label,
    question,
    lead ?? "",
    intro ?? "",
    ...blocks.flatMap((block) => [block.heading, block.markdown]),
  ];

  return {
    slug,
    title: frontmatter.data.title,
    label,
    order: frontmatter.data.order,
    draft,
    question,
    lead,
    intro,
    blocks,
    searchText: searchParts.join("\n").toLowerCase(),
  };
}

export function sortAndValidateNotes(notes: QuestionNote[]): QuestionNote[] {
  const seen = new Set<number>();
  for (const note of notes) {
    if (seen.has(note.order)) {
      throw new Error(`Duplicate question order: ${note.order}`);
    }
    seen.add(note.order);
  }
  return [...notes].sort((left, right) => left.order - right.order);
}
