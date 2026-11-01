"use client";

import { useId, useState } from "react";
import type { HeadingLink } from "@/theme/contracts";

export function SectionNav({
  headings,
  label = "Contents",
}: {
  headings: HeadingLink[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav aria-label={label} className="section-nav">
      <button
        type="button"
        className="section-nav-toggle flex min-h-11 w-full items-center justify-between rounded-md bg-card px-4 text-left text-sm"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {label}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <ol id={panelId} className={open ? "section-nav-list is-open" : "section-nav-list"}>
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className="block py-1.5 no-underline hover:text-primary">
              {heading.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
