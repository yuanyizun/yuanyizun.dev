"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { QuestionNote } from "@/data/questions";
import { cn } from "@/utils/class-names";
import "./interview-sheet.module.css";

const storeKey = "interview-covered";

function padIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

function AnswerMarkdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

export function InterviewSheet({ notes }: { notes: QuestionNote[] }) {
  const findId = useId();
  const findRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState(notes[0]?.slug ?? "");
  const [covered, setCovered] = useState<Record<string, boolean>>({});

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((note) => note.searchText.includes(q));
  }, [notes, query]);

  const visibleIds = useMemo(() => new Set(visible.map((note) => note.slug)), [visible]);

  useEffect(() => {
    if (visible.length === 0) return;
    if (!visibleIds.has(current)) {
      setCurrent(visible[0].slug);
    }
  }, [visible, visibleIds, current]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
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
    const hash = window.location.hash.slice(1);
    if (hash && notes.some((note) => note.slug === hash)) {
      setCurrent(hash);
    }
  }, [notes]);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setCurrent(entry.target.id);
          }
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );
    for (const note of visible) {
      const node = document.getElementById(note.slug);
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target === findRef.current ||
        target?.isContentEditable ||
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA";

      if (event.key === "/" && !typing) {
        event.preventDefault();
        findRef.current?.focus();
        findRef.current?.select();
        return;
      }

      if (typing) {
        if (event.key === "Escape") {
          setQuery("");
          findRef.current?.blur();
        }
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const list = visible;
      const currentIndex = Math.max(
        0,
        list.findIndex((note) => note.slug === current),
      );

      if (event.key === "ArrowDown" || event.key === "j") {
        event.preventDefault();
        go(list[Math.min(list.length - 1, currentIndex + 1)]?.slug);
      } else if (event.key === "ArrowUp" || event.key === "k") {
        event.preventDefault();
        go(list[Math.max(0, currentIndex - 1)]?.slug);
      } else if (event.key >= "1" && event.key <= "9") {
        go(list[Number(event.key) - 1]?.slug);
      } else if (event.key === "0") {
        go(list[9]?.slug);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [current, visible]);

  function go(slug: string | undefined) {
    if (!slug) return;
    const node = document.getElementById(slug);
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    setCurrent(slug);
    try {
      history.replaceState(null, "", `#${slug}`);
    } catch {
      // Ignore history failures.
    }
  }

  function toggleCovered(slug: string) {
    setCovered((prev) => {
      const next = { ...prev, [slug]: !prev[slug] };
      try {
        localStorage.setItem(storeKey, JSON.stringify(next));
      } catch {
        // Ignore storage failures.
      }
      return next;
    });
  }

  return (
    <div className="interviewLayout">
      <aside className="interviewRail">
        <div className="interviewBrand">
          <h1>Interview quick peek</h1>
          <p>Every note from the crib sheet. Nothing is collapsed.</p>
        </div>
        <div className="interviewSearch">
          <input
            ref={findRef}
            id={findId}
            className="interviewSearchInput"
            type="search"
            placeholder="Search notes — press /"
            autoComplete="off"
            aria-label="Search questions and answers"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <nav className="interviewNav" aria-label="Questions">
          {notes.map((note, index) => {
            if (!visibleIds.has(note.slug)) return null;
            const isCurrent = current === note.slug;
            const isDone = Boolean(covered[note.slug]);
            return (
              <div
                key={note.slug}
                className={cn(
                  "interviewNavRow",
                  isCurrent && "interviewNavRowCurrent",
                  isDone && "interviewNavRowDone",
                )}
              >
                <a
                  href={`#${note.slug}`}
                  className="interviewNavLink"
                  onClick={(event) => {
                    event.preventDefault();
                    go(note.slug);
                  }}
                >
                  <span className="interviewNum">{padIndex(index)}</span>
                  <span>{note.label}</span>
                </a>
                <button
                  type="button"
                  className="interviewMark"
                  aria-label="Mark covered"
                  aria-pressed={isDone}
                  onClick={() => toggleCovered(note.slug)}
                />
              </div>
            );
          })}
        </nav>
        <div className="interviewKeys">
          <div>
            <kbd>↑</kbd> <kbd>↓</kbd> move · <kbd>1</kbd>–<kbd>9</kbd> <kbd>0</kbd> jump
          </div>
          <div>
            <kbd>/</kbd> search · ring = asked
          </div>
        </div>
      </aside>

      <div className="interviewMain">
        {visible.length === 0 ? (
          <p className="interviewEmpty">No note matches that search.</p>
        ) : null}
        {notes.map((note, index) => {
          if (!visibleIds.has(note.slug)) return null;
          const isAsk = note.slug === "ask";
          return (
            <article key={note.slug} id={note.slug} className="interviewCard">
              <header className="interviewCardHeader">
                <span className="interviewCardNum">{padIndex(index)}</span>
                <h2 className="interviewCardTitle">{note.title}</h2>
              </header>
              <div className="interviewAnswer">
                {note.lead ? (
                  <AnswerMarkdown className="interviewLead">{note.lead}</AnswerMarkdown>
                ) : null}
                {note.intro ? (
                  <AnswerMarkdown className={isAsk ? "interviewAskList" : undefined}>
                    {note.intro}
                  </AnswerMarkdown>
                ) : null}
                {note.blocks.map((block) => (
                  <div
                    key={`${note.slug}-${block.heading}`}
                    className={cn(
                      "interviewBlock",
                      block.kind === "result" && "interviewBlockResult",
                    )}
                  >
                    <p
                      className={cn(
                        "interviewKicker",
                        block.kind === "result" && "interviewKickerResult",
                      )}
                    >
                      {block.heading}
                    </p>
                    <AnswerMarkdown>{block.markdown}</AnswerMarkdown>
                  </div>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
