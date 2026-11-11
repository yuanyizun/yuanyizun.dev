import { z } from "zod";

const userIdSchema = z
  .string()
  .trim()
  .pipe(z.uuid())
  .transform((value) => value.toLowerCase());

/** Untrusted ids from bind / action args — allowlist UUID only. */
export function parseUserId(id: unknown): string | null {
  const parsed = userIdSchema.safeParse(id);
  return parsed.success ? parsed.data : null;
}
