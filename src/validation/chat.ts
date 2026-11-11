import type { UIMessage } from "ai";
import { z } from "zod";

export const MAX_MESSAGES = 20;
export const MAX_TEXT = 2000;

type TextPart = { type: "text"; text: string };

const chatEnvelopeSchema = z.object({
  messages: z
    .array(
      z.object({
        id: z.unknown().optional(),
        role: z.unknown().optional(),
        parts: z.unknown().optional(),
      }),
    )
    .min(1)
    .max(MAX_MESSAGES),
});

const textPartSchema = z.object({
  type: z.literal("text"),
  text: z.string().max(MAX_TEXT),
});

function textParts(value: unknown): TextPart[] | null {
  const list = z.array(z.unknown()).safeParse(value);
  if (!list.success) return null;

  const parts: TextPart[] = [];

  for (const part of list.data) {
    if (!part || typeof part !== "object") return null;
    if ((part as { type?: unknown }).type !== "text") continue;

    const parsed = textPartSchema.safeParse(part);
    if (!parsed.success) return null;
    if (parsed.data.text.trim().length === 0) continue;
    parts.push({ type: "text", text: parsed.data.text });
  }

  return parts;
}

export function parseChatMessages(body: unknown): UIMessage[] | null {
  const envelope = chatEnvelopeSchema.safeParse(body);
  if (!envelope.success) return null;

  const messages: UIMessage[] = [];

  for (const candidate of envelope.data.messages) {
    if (candidate.role !== "user" && candidate.role !== "assistant") continue;

    const parts = textParts(candidate.parts);
    if (!parts || parts.length === 0) continue;

    messages.push({
      id:
        typeof candidate.id === "string" && candidate.id
          ? candidate.id
          : crypto.randomUUID(),
      role: candidate.role,
      parts,
    });
  }

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return null;
  }

  return messages;
}
