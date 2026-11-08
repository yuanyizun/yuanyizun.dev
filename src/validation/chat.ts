import type { UIMessage } from "ai";

export const MAX_MESSAGES = 20;
export const MAX_TEXT = 2000;

type TextPart = { type: "text"; text: string };

function textParts(value: unknown): TextPart[] | null {
  if (!Array.isArray(value)) return null;

  const parts: TextPart[] = [];

  for (const part of value) {
    if (!part || typeof part !== "object") return null;
    const candidate = part as { type?: unknown; text?: unknown };
    if (candidate.type !== "text") continue;
    if (typeof candidate.text !== "string") return null;
    if (candidate.text.length > MAX_TEXT) return null;
    if (candidate.text.trim().length === 0) continue;
    parts.push({ type: "text", text: candidate.text });
  }

  return parts;
}

export function parseChatMessages(body: unknown): UIMessage[] | null {
  if (!body || typeof body !== "object") return null;

  const incoming = (body as { messages?: unknown }).messages;
  if (
    !Array.isArray(incoming) ||
    incoming.length === 0 ||
    incoming.length > MAX_MESSAGES
  ) {
    return null;
  }

  const messages: UIMessage[] = [];

  for (const item of incoming) {
    if (!item || typeof item !== "object") return null;
    const candidate = item as { id?: unknown; role?: unknown; parts?: unknown };
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
