"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ButtonLink } from "@/components/ui/button";

export type TimelineProject = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  period?: string;
  kind?: string;
};

function yearFromDate(date: string) {
  return date.slice(0, 4);
}

export function SelectedWorkTimeline({
  projects,
}: {
  projects: TimelineProject[];
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clearStyles = () => {
      for (const item of itemRefs.current) {
        if (!item) continue;
        item.style.filter = "";
        item.style.opacity = "";
      }
    };

    const update = () => {
      if (media.matches) {
        clearStyles();
        return;
      }

      const center = window.innerHeight * 0.45;
      const maxDist = Math.max(window.innerHeight * 0.5, 1);

      for (const item of itemRefs.current) {
        if (!item) continue;
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const t = Math.min(Math.abs(itemCenter - center) / maxDist, 1);
        item.style.filter = `blur(${(t * 3.5).toFixed(2)}px)`;
        item.style.opacity = (1 - t * 0.5).toFixed(3);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    media.addEventListener("change", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      media.removeEventListener("change", onScroll);
      clearStyles();
    };
  }, [projects.length]);

  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-8">
      <h2 className="font-heading text-[clamp(2rem,3vw,2.75rem)] tracking-[-0.03em]">
        Selected work
      </h2>

      <ol ref={listRef} className="selected-work-timeline relative m-0 list-none p-0">
        <span
          className="pointer-events-none absolute top-2 bottom-2 left-[2.35rem] w-px bg-border sm:left-[3.1rem]"
          aria-hidden
        />
        {projects.map((project, index) => {
          const year = yearFromDate(project.date);
          return (
            <li
              key={project.slug}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              className="selected-work-timeline__item relative"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-5 no-underline sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
              >
                <span className="relative flex items-start justify-end pt-1">
                  <span
                    className="absolute top-2 right-[-0.55rem] size-2.5 rounded-full border-2 border-border bg-background sm:right-[-0.7rem]"
                    aria-hidden
                  />
                  <time
                    dateTime={project.date}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {year}
                  </time>
                </span>
                <span className="flex min-w-0 flex-col gap-2 pr-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    {project.kind ?? "Work"}
                    {project.period ? ` · ${project.period}` : ""}
                  </span>
                  <span className="font-heading text-[clamp(1.35rem,2.2vw,1.85rem)] tracking-[-0.03em]">
                    {project.title}
                  </span>
                  <span className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {project.summary}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <div>
        <ButtonLink href="/projects" variant="outline">
          View all projects
        </ButtonLink>
      </div>
    </section>
  );
}
