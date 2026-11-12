"use server";

import {
  unlockInterview,
  type InterviewPasscodeState,
} from "@/services/domain/interview-passcode";

export async function unlockInterviewAction(
  _state: InterviewPasscodeState,
  formData: FormData,
): Promise<InterviewPasscodeState> {
  const code = String(formData.get("code") ?? "");
  return unlockInterview(code);
}
