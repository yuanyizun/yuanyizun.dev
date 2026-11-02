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
    <nav aria-label={label}>
      <button
        type="button"
        className="flex min-h-11 w-full items-center justify-between rounded-md bg-card px-4 text-left text-sm min-[1200px]:hidden"
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
        className="mt-3 hidden list-none gap-[0.15rem] pl-0 data-[open=true]:grid min-[1200px]:mt-0 min-[1200px]:grid"
      >
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
