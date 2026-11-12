import { getQuestions } from "@/data/questions";
import { toPublicNotes } from "@/data/internal/questions-public";
import { InterviewApp } from "./interview-app";

export async function InterviewAppSection() {
  const notes = toPublicNotes(await getQuestions());
  return <InterviewApp notes={notes} />;
}
