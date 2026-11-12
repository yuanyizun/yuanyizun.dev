import type { ReactNode } from "react";
import { unlockInterviewAction } from "@/services/actions/interview-actions";
import { isInterviewUnlocked } from "@/services/domain/interview-passcode";
import { InterviewPasscodeForm } from "./interview-passcode-form";

export async function InterviewPasscodeGate({
  children,
  variant = "sheet",
}: {
  children: ReactNode;
  variant?: "sheet" | "app";
}) {
  if (await isInterviewUnlocked()) {
    return children;
  }

  return (
    <InterviewPasscodeForm action={unlockInterviewAction} variant={variant} />
  );
}
