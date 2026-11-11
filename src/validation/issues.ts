import { z } from "zod";

/** First message for each field. Later issues on the same key are dropped. */
export function firstFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors = z.flattenError(
    error as z.ZodError<Record<string, unknown>>,
  ).fieldErrors;
  const errors: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const message = messages?.[0];
    if (message) {
      errors[key] = message;
    }
  }
  return errors;
}
