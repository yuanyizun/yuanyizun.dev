import { connection } from "next/server";
import {
  allowChatRequest,
  chatAvailable,
  sameOrigin,
  streamProfileChat,
} from "@/services/chat";
import { parseChatMessages } from "@/validation/chat";

export const maxDuration = 30;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  await connection();

  if (!sameOrigin(request)) {
    return jsonError("This chat only answers on this site.", 403);
  }

  if (!allowChatRequest(request)) {
    return jsonError("Too many questions. Try again in a few minutes.", 429);
  }

  if (!chatAvailable()) {
    return jsonError("Chat is unavailable.", 503);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Send a short question.", 400);
  }

  const messages = parseChatMessages(body);
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
