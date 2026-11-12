"use client";

import {
  useEffect,
  useRef,
  useState,
  type TouchEvent,
} from "react";
import type { PublicQuestionNote } from "@/data/internal/questions-public";
import { cn } from "@/utils/class-names";
import { InterviewMarkdown } from "@/components/composite/interview-sheet/interview-markdown";
import "./interview-app.module.css";

const coveredKey = "interview-covered";
const installKey = "interview-app-install-dismissed";
const swipeThreshold = 56;

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function isStandalone() {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const apple = "standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
  return media || apple;
}

function isIosSafariHint() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad/i.test(navigator.userAgent);
}

export function InterviewApp({ notes }: { notes: PublicQuestionNote[] }) {
  const answerRef = useRef<HTMLElement>(null);
  const swipeRef = useRef<{
    x: number;
    y: number;
    locked: "none" | "x" | "y";
  } | null>(null);

  const [index, setIndex] = useState(0);
  const [covered, setCovered] = useState<Record<string, boolean>>({});
  const [indexOpen, setIndexOpen] = useState(false);
  const [showInstall, setShowInstall] = useState(false);

  const note = notes[index] ?? notes[0];
  const total = notes.length;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(coveredKey);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      if (parsed && typeof parsed === "object") {
        setCovered(parsed);
      }
    } catch {
      // Ignore bad storage.
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function applyHash() {
      const hash = window.location.hash.slice(1);
      const found = notes.findIndex((item) => item.slug === hash);
      setIndex(found >= 0 ? found : 0);
    }

    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [notes]);

  useEffect(() => {
    try {
      if (localStorage.getItem(installKey)) return;
    } catch {
      return;
    }
    if (!isIosSafariHint() || isStandalone()) return;
    setShowInstall(true);
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";

      if (indexOpen) {
        if (event.key === "Escape") {
          setIndexOpen(false);
        }
        return;
      }

      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(index - 1);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, indexOpen, notes]);

  function go(nextIndex: number) {
    if (nextIndex < 0 || nextIndex >= notes.length) return;
    const next = notes[nextIndex];
    if (!next) return;
    setIndex(nextIndex);
    answerRef.current?.scrollTo({ top: 0 });
    try {
      history.replaceState(null, "", `#${next.slug}`);
    } catch {
      // Ignore history failures.
    }
  }

  function openNote(slug: string) {
    const nextIndex = notes.findIndex((item) => item.slug === slug);
    if (nextIndex < 0) return;
    go(nextIndex);
    setIndexOpen(false);
  }

  function toggleCovered(slug: string) {
    setCovered((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem(coveredKey, JSON.stringify(next));
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  }

  function dismissInstall() {
    setShowInstall(false);
    try {
      localStorage.setItem(installKey, "1");
    } catch {
      // Ignore storage failures.
    }
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    const target = event.target as HTMLElement | null;
    if (
      target?.closest("button") ||
      target?.closest("a") ||
      target?.tagName === "INPUT" ||
      target?.tagName === "TEXTAREA"
    ) {
      swipeRef.current = null;
      return;
    }
    const touch = event.touches[0];
    if (!touch) return;
    swipeRef.current = { x: touch.clientX, y: touch.clientY, locked: "none" };
  }

  function onTouchMove(event: TouchEvent<HTMLElement>) {
    const state = swipeRef.current;
    const touch = event.touches[0];
    if (!state || !touch) return;
    const dx = touch.clientX - state.x;
    const dy = touch.clientY - state.y;
    if (state.locked === "none") {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      state.locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    const state = swipeRef.current;
    const touch = event.changedTouches[0];
    swipeRef.current = null;
    if (!state || !touch || state.locked !== "x") return;
    const dx = touch.clientX - state.x;
    if (Math.abs(dx) < swipeThreshold) return;
    if (dx < 0) go(index + 1);
    else go(index - 1);
  }

  if (!note) {
    return <p className="interviewAppEmpty">No interview notes yet.</p>;
  }

  const isAsk = note.slug === "ask";
  const isDone = Boolean(covered[note.slug]);

  return (
    <div className="interviewApp">
      {showInstall ? (
        <div className="interviewAppInstall">
          <p>In Safari, tap Share, then Add to Home Screen.</p>
          <button
            type="button"
            className="interviewAppInstallDismiss"
            aria-label="Dismiss install tip"
            onClick={dismissInstall}
          >
            Done
          </button>
        </div>
      ) : null}

      <header className="interviewAppTop">
        <span className="interviewAppCount">
          {padIndex(index)} / {String(total).padStart(2, "0")}
        </span>
        <p className="interviewAppLabel">{note.label}</p>
        <button
          type="button"
          className={cn("interviewAppIconButton", "interviewAppMark")}
          aria-label="Mark covered"
          aria-pressed={isDone}
          onClick={() => toggleCovered(note.slug)}
        >
          {isDone ? "Asked" : "Mark"}
        </button>
      </header>

      <section
        ref={answerRef}
        id="interview-answer"
        className="interviewAppAnswer"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <h1 className="interviewAppTitle">{note.question}</h1>
        <div className="interviewAppBody">
          {note.lead ? (
            <InterviewMarkdown className="interviewAppLead">{note.lead}</InterviewMarkdown>
          ) : null}
          {note.intro ? (
            <InterviewMarkdown className={isAsk ? "interviewAppAskList" : undefined}>
              {note.intro}
            </InterviewMarkdown>
          ) : null}
          {note.blocks.map((block) => (
            <div
              key={`${note.slug}-${block.heading}`}
              className={cn(
                "interviewAppBlock",
                block.kind === "result" && "interviewAppBlockResult",
              )}
            >
              <p
                className={cn(
                  "interviewAppKicker",
                  block.kind === "result" && "interviewAppKickerResult",
                )}
              >
                {block.heading}
              </p>
              <InterviewMarkdown>{block.markdown}</InterviewMarkdown>
            </div>
          ))}
        </div>
      </section>

      <footer className="interviewAppBottom">
        <button
          type="button"
          className="interviewAppNavButton"
          disabled={index <= 0}
          onClick={() => go(index - 1)}
        >
          Previous
        </button>
        <button
          type="button"
          className="interviewAppNavButton"
          disabled={index >= total - 1}
          onClick={() => go(index + 1)}
        >
          Next
        </button>
      </footer>

      {!indexOpen ? (
        <button
          type="button"
          className="interviewAppIndexFab"
          aria-label="Open question index"
          onClick={() => setIndexOpen(true)}
        >
          Index
        </button>
      ) : null}

      {indexOpen ? (
        <div
          className="interviewAppSearch"
          role="dialog"
          aria-modal="true"
          aria-label="Question index"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIndexOpen(false);
            }
          }}
        >
          <div className="interviewAppSearchPanel">
            <div className="interviewAppSearchHeader">
              <p className="interviewAppSearchHeading">Questions</p>
              <button
                type="button"
                className="interviewAppSearchClose"
                onClick={() => setIndexOpen(false)}
              >
                Close
              </button>
            </div>
            <div className="interviewAppSearchList">
              {notes.map((item, itemIndex) => {
                const current = item.slug === note.slug;
                return (
                  <button
                    key={item.slug}
                    type="button"
                    className={cn(
                      "interviewAppSearchRow",
                      current && "interviewAppSearchRowCurrent",
                    )}
                    aria-current={current ? "true" : undefined}
                    onClick={() => openNote(item.slug)}
                  >
                    <span className="interviewAppSearchNum">{padIndex(itemIndex)}</span>
                    <span className="interviewAppSearchCopy">
                      <span className="interviewAppSearchTitle">{item.question}</span>
                      {item.label && item.label !== item.question ? (
                        <span className="interviewAppSearchMeta">{item.label}</span>
                      ) : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
