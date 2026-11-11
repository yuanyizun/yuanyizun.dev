"use client";

import { useEffect, useId, useState } from "react";
import type { HeadingLink } from "@/components/composite/markdown/headings";
import { cn } from "@/utils/class-names";

export function SectionNav({
  headings,
  label = "Contents",
}: {
  headings: HeadingLink[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [currentId, setCurrentId] = useState(headings[0]?.id ?? "");
  const panelId = useId();

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const elements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) =>
              left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (visible[0]?.target.id) {
          setCurrentId(visible[0].target.id);
          return;
        }

        setCurrentId((previous) => previous || headings[0].id);
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 1],
      },
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label}>
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between rounded-md bg-card px-4 text-left text-sm reading:hidden"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <ol
        id={panelId}
        data-open={open ? "true" : "false"}
        className="relative mt-3 hidden list-none gap-[0.15rem] border-l border-border pl-4 data-[open=true]:grid reading:mt-0 reading:grid"
      >
        {headings.map((heading) => {
          const current = heading.id === currentId;
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "group relative block py-1.5 no-underline hover:text-primary focus-visible:text-primary",
                  current && "text-primary",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute top-2.5 left-0 size-2 -translate-x-[calc(50%+1rem+0.5px)] rounded-full border border-border bg-background transition-colors group-hover:border-primary group-hover:bg-primary group-focus-visible:border-primary group-focus-visible:bg-primary",
                    current && "border-primary bg-primary",
                  )}
                />
                {heading.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
