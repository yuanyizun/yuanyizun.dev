import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";

export const INTERVIEW_GATE_COOKIE = "interview-gate";

export type InterviewPasscodeState = {
  ok?: boolean;
  message?: string;
  errors?: { code?: string };
};

function configuredCode() {
  return process.env.INTERVIEW_PASSCODE?.trim() ?? "";
}

function unlockToken(code: string) {
  return createHmac("sha256", code).update("interview-unlocked").digest("hex");
}

export async function isInterviewUnlocked(): Promise<boolean> {
  const code = configuredCode();
  if (!code) return false;

  await connection();
  const value = (await cookies()).get(INTERVIEW_GATE_COOKIE)?.value;
  if (!value) return false;

  const expected = unlockToken(code);
  if (value.length !== expected.length) return false;

  try {
    return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function unlockInterview(
  submitted: string,
): Promise<InterviewPasscodeState> {
  const code = configuredCode();
  if (!code) {
    return { message: "Interview passcode is not configured." };
  }

  const trimmed = submitted.trim();
  if (!trimmed) {
    return { errors: { code: "Enter the passcode." } };
  }

  const expected = Buffer.from(code);
  const actual = Buffer.from(trimmed);
  const match =
    expected.length === actual.length &&
    timingSafeEqual(expected, actual);

  if (!match) {
    return { errors: { code: "That passcode is wrong." } };
  }

  await connection();
  const jar = await cookies();
  jar.set(INTERVIEW_GATE_COOKIE, unlockToken(code), {
    httpOnly: true,
    sameSite: "lax",
    secure: (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https"),
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return { ok: true };
}
