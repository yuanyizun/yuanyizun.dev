import { getQuestions } from "@/data/questions";
import { InterviewSheet } from "./interview-sheet";

export async function InterviewSection() {
  const notes = await getQuestions();
  return <InterviewSheet notes={notes} />;
}
