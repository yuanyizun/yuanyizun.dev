import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import {
  parseQuestionFile,
  sortAndValidateNotes,
  type QuestionNote,
} from "@/data/internal/questions";

export type { QuestionBlock, QuestionNote } from "@/data/internal/questions";

const questionsDirectory = path.join(process.cwd(), "content", "questions");

function readQuestionNotes(): QuestionNote[] {
  if (!fs.existsSync(questionsDirectory)) {
    return [];
  }

  const notes = fs
    .readdirSync(questionsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .flatMap((filename) => {
      const slug = filename.slice(0, -".md".length);
      const raw = fs.readFileSync(path.join(questionsDirectory, filename), "utf8");
      const note = parseQuestionFile(raw, slug);
      return note ? [note] : [];
    });

  return sortAndValidateNotes(notes);
}

export async function getQuestions(): Promise<QuestionNote[]> {
  "use cache";
  cacheLife("days");
  cacheTag("questions");
  return readQuestionNotes();
}
