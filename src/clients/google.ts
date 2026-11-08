import "server-only";

import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

export function hasGoogleGenerativeAiKey(): boolean {
  return Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
}

export async function streamGeminiChat(input: {
  instructions: string;
  messages: UIMessage[];
}) {
  return streamText({
    model: google("gemini-3.5-flash-lite"),
    maxRetries: 0,
    maxOutputTokens: 400,
    instructions: input.instructions,
    messages: await convertToModelMessages(input.messages),
  });
}
