import type { QuestionBlock, QuestionNote } from "@/data/internal/questions";

export type PublicQuestionNote = {
  slug: string;
  title: string;
  label: string;
  order: number;
  question: string;
  lead: string | null;
  intro: string | null;
  blocks: QuestionBlock[];
};

export function toPublicNote(note: QuestionNote): PublicQuestionNote {
  return {
    slug: note.slug,
    title: note.title,
    label: note.label,
    order: note.order,
    question: note.question,
    lead: note.lead,
    intro: note.intro,
    blocks: note.blocks,
  };
}

export function findPublicNote(
  notes: QuestionNote[],
  slug: string,
): PublicQuestionNote | null {
  const note = notes.find((item) => item.slug === slug);
  return note ? toPublicNote(note) : null;
}

export function toPublicNotes(notes: QuestionNote[]): PublicQuestionNote[] {
  return notes.map(toPublicNote);
}
