"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Hello, I'm Yizun Yuan.",
  "I'm a full stack software engineer with a passion for building scalable and efficient systems.",
] as const;

const FULL_TEXT = LINES.join(" ");

type Mode = "static" | "typing";

export function HomeTyping() {
  const [mode, setMode] = useState<Mode>("static");
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const enableTyping = () => {
      if (media.matches) {
        setMode("static");
        return;
      }
      setMode("typing");
      setLineIndex(0);
      setCharIndex(0);
    };
    enableTyping();
    media.addEventListener("change", enableTyping);
    return () => media.removeEventListener("change", enableTyping);
  }, []);

  useEffect(() => {
    if (mode !== "typing") {
      return;
    }

    const current = LINES[lineIndex];
    if (!current) {
      return;
    }

    if (charIndex < current.length) {
      const timer = window.setTimeout(() => {
        setCharIndex((value) => value + 1);
      }, 28);
      return () => window.clearTimeout(timer);
    }

    if (lineIndex < LINES.length - 1) {
      const timer = window.setTimeout(() => {
        setLineIndex((value) => value + 1);
        setCharIndex(0);
      }, 420);
      return () => window.clearTimeout(timer);
    }
  }, [mode, lineIndex, charIndex]);

  const line1 =
    mode === "static"
      ? LINES[0]
      : LINES[0].slice(0, lineIndex === 0 ? charIndex : LINES[0].length);
  const line2 =
    mode === "static"
      ? LINES[1]
      : lineIndex === 0
        ? ""
        : LINES[1].slice(0, charIndex);
  const showCaretOnFirst = mode === "typing" && lineIndex === 0;
  const showCaretOnSecond =
    mode === "typing" &&
    lineIndex === 1 &&
    charIndex < LINES[1].length;

  return (
    <div className="flex flex-col gap-5" aria-live="polite" aria-atomic="true">
      <h1 className="font-heading text-[clamp(2.75rem,6.5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.03em] text-foreground">
        {line1}
        {showCaretOnFirst ? (
          <span className="typing-caret" aria-hidden="true" />
        ) : null}
      </h1>
      <p className="min-h-[4.5em] max-w-[34rem] text-[clamp(1.0625rem,1.1rem+0.25vw,1.1875rem)] leading-[1.5] text-foreground">
        <span className="sr-only">{mode === "typing" ? FULL_TEXT : null}</span>
        <span aria-hidden={mode === "typing" ? true : undefined}>
          {line2 || (mode === "typing" ? "\u00a0" : null)}
          {showCaretOnSecond ? (
            <span className="typing-caret" aria-hidden="true" />
          ) : null}
        </span>
      </p>
    </div>
  );
}
