"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { usePathname } from "next/navigation";
import { Button } from "@/components/primitive/button/button";

const prompts = [
  "What have you built?",
  "Where have you worked?",
  "What are you using now?",
] as const;

function hiddenPath(pathname: string) {
  return (
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/register" ||
    pathname.startsWith("/register/") ||
    pathname === "/auth" ||
    pathname.startsWith("/auth/")
  );
}

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function errorText(error: Error) {
  const raw = error.message.trim();

  try {
    const parsed = JSON.parse(raw) as { error?: unknown };
    if (typeof parsed.error === "string" && parsed.error.length < 180) {
      return parsed.error;
    }
  } catch {
    // The SDK may pass a plain sentence.
  }

  if (raw === "An error occurred.") {
    return "The chat could not answer. Try again.";
  }

  if (raw.length > 0 && raw.length < 180 && !raw.toLowerCase().includes("api key")) {
    return raw;
  }

  return "The chat could not answer. Try again.";
}

function ChatMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children: nodes }) => <p className="mb-2 font-heading text-xl">{nodes}</p>,
        h2: ({ children: nodes }) => <p className="mb-2 font-heading text-xl">{nodes}</p>,
        h3: ({ children: nodes }) => <p className="mb-2 font-heading text-lg">{nodes}</p>,
        h4: ({ children: nodes }) => <p className="mb-2">{nodes}</p>,
        h5: ({ children: nodes }) => <p className="mb-2">{nodes}</p>,
        h6: ({ children: nodes }) => <p className="mb-2">{nodes}</p>,
        p: ({ children: nodes }) => <p className="mb-2 last:mb-0">{nodes}</p>,
        ul: ({ children: nodes }) => (
          <ul className="mb-2 list-disc pl-5 last:mb-0">{nodes}</ul>
        ),
        ol: ({ children: nodes }) => (
          <ol className="mb-2 list-decimal pl-5 last:mb-0">{nodes}</ol>
        ),
        a: ({ href, children: nodes }) => {
          if (!href || !/^(https?:|\/)/.test(href)) {
            return <span>{nodes}</span>;
          }

          const external = href.startsWith("http");
          return (
            <a
              href={href}
              className="underline underline-offset-4"
              {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {nodes}
            </a>
          );
        },
      }}
    >
      {children}
    </ReactMarkdown>
  );
}

export function ProfileChat() {
  const pathname = usePathname();
  if (hiddenPath(pathname)) return null;
  return <ProfileChatPanel />;
}

function ProfileChatPanel() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [transport] = useState(() => new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, error } = useChat({ transport });
  const pending = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) launcherRef.current?.focus();
      return;
    }

    wasOpen.current = true;
    fieldRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    log.scrollTop = log.scrollHeight;
  }, [messages, status, open]);

  function submit(text: string) {
    const question = text.trim();
    if (!question || pending || question.length > 2000) return;
    setDraft("");
    void sendMessage({ text: question });
  }

  return (
    <div className="fixed right-4 bottom-4 z-30 flex w-[min(26rem,calc(100vw-2rem))] flex-col items-end gap-3">
      {open ? (
        <div
          ref={panelRef}
          role="dialog"
          aria-labelledby="profile-chat-title"
          className="flex h-[min(36rem,calc(100dvh-6.5rem))] w-full flex-col overflow-hidden rounded-xl bg-card text-card-foreground shadow-lg"
        >
          <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div className="flex flex-col gap-2">
              <h2
                id="profile-chat-title"
                className="font-heading text-2xl tracking-[-0.03em]"
              >
                Ask about Yizun
              </h2>
              <p className="text-base leading-snug">
                Questions about the work and the years at Momentum Media.
              </p>
            </div>
            <button
              type="button"
              className="min-h-11 shrink-0 px-1 text-base underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <div ref={logRef} className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-5">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="min-h-11 rounded-md bg-background px-3 text-left text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    onClick={() => submit(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((message) => {
                const text = messageText(message);
                if (!text) return null;

                if (message.role === "user") {
                  return (
                    <p
                      key={message.id}
                      className="max-w-[85%] self-end rounded-md bg-inverse px-3 py-2 text-base text-inverse-foreground"
                    >
                      {text}
                    </p>
                  );
                }

                return (
                  <div key={message.id} className="text-base leading-relaxed">
                    <ChatMarkdown>{text}</ChatMarkdown>
                  </div>
                );
              })
            )}
            {pending && messages.at(-1)?.role !== "assistant" ? (
              <p className="text-base" role="status">
                Answering…
              </p>
            ) : null}
            {error ? (
              <p className="text-base text-destructive" role="alert">
                {errorText(error)}
              </p>
            ) : null}
          </div>

          <form
            className="flex flex-col gap-3 bg-background px-5 py-4"
            onSubmit={(event) => {
              event.preventDefault();
              submit(draft);
            }}
          >
            <label htmlFor="profile-chat-question" className="text-base">
              Question
            </label>
            <textarea
              ref={fieldRef}
              id="profile-chat-question"
              name="question"
              rows={3}
              maxLength={2000}
              value={draft}
              placeholder="Ask about the work"
              className="min-h-24 w-full resize-none bg-card px-3 py-3 text-base text-foreground outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  submit(draft);
                }
              }}
            />
            <Button
              type="submit"
              className="self-end"
              disabled={pending || draft.trim().length === 0}
              aria-busy={pending || undefined}
            >
              {pending ? "Sending…" : "Send"}
            </Button>
          </form>
        </div>
      ) : null}

      <Button
        ref={launcherRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? "profile-chat-title" : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        Ask about Yizun
      </Button>
    </div>
  );
}
