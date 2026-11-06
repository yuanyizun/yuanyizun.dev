import { connection } from "next/server";
import { streamProfileChat } from "@/services/chat";
import type { UIMessage } from "ai";

export const maxDuration = 30;

const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 20;
const MAX_MESSAGES = 20;
const MAX_TEXT = 2000;

const buckets = new Map<string, number[]>();

type TextPart = { type: "text"; text: string };

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function requestHost(request: Request) {
  const forwarded = request.headers.get("x-forwarded-host");
  const value = forwarded ?? request.headers.get("host");
  return value?.split(",")[0]?.trim() ?? "";
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).host === requestHost(request);
  } catch {
    return false;
  }
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim();
  return ip || request.headers.get("x-real-ip") || "local";
}

function allowRequest(ip: string) {
  const now = Date.now();
  const recent = (buckets.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

  if (recent.length >= LIMIT) {
    buckets.set(ip, recent);
    return false;
  }

  recent.push(now);
  buckets.set(ip, recent);

  if (buckets.size > 500) {
    for (const [key, times] of buckets) {
      const fresh = times.filter((time) => now - time < WINDOW_MS);
      if (fresh.length === 0) buckets.delete(key);
      else buckets.set(key, fresh);
    }
  }

  return true;
}

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

function sanitizeMessages(body: unknown): UIMessage[] | null {
  if (!body || typeof body !== "object") return null;

  const incoming = (body as { messages?: unknown }).messages;
  if (!Array.isArray(incoming) || incoming.length === 0 || incoming.length > MAX_MESSAGES) {
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
      id: typeof candidate.id === "string" && candidate.id ? candidate.id : crypto.randomUUID(),
      role: candidate.role,
      parts,
    });
  }

  if (messages.length === 0 || messages[messages.length - 1]?.role !== "user") {
    return null;
  }

  return messages;
}

export async function POST(request: Request) {
  await connection();

  if (!sameOrigin(request)) {
    return jsonError("This chat only answers on this site.", 403);
  }

  if (!allowRequest(clientIp(request))) {
    return jsonError("Too many questions. Try again in a few minutes.", 429);
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return jsonError("Chat is unavailable.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Send a short question.", 400);
  }

  const messages = sanitizeMessages(body);
  if (!messages) {
    return jsonError("Send a short question.", 400);
  }

  try {
    const result = await streamProfileChat(messages);
    return result.toUIMessageStreamResponse();
  } catch {
    return jsonError("The chat could not answer. Try again.", 502);
  }
}
