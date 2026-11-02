import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import "./selected-work-timeline.module.css";

export type TimelineProject = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  period?: string;
  kind?: string;
};

const staggerMs = 180;

function yearFromDate(date: string) {
  return date.slice(0, 4);
}

export function SelectedWorkTimeline({
  projects,
}: {
  projects: TimelineProject[];
}) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <ol className="m-0 list-none p-0">
      {projects.map((project, index) => {
        const year = yearFromDate(project.date);
        const delay = `${index * staggerMs}ms`;
        return (
          <li
            key={project.slug}
            className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3.5 pb-[22px] last:pb-0 sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:gap-x-6"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="group col-span-2 grid grid-cols-subgrid text-foreground no-underline"
            >
              <span className="relative flex justify-center">
                {index < projects.length - 1 ? (
                  <span
                    className="timelineRail"
                    style={{ animationDelay: delay }}
                    aria-hidden
                  />
                ) : null}
                <time
                  dateTime={project.date}
                  style={{ animationDelay: delay }}
                  className="timelineEnter timelineYear relative z-1 flex h-[38px] w-full items-center justify-center rounded-full border border-border bg-background font-mono text-[13px] leading-none text-foreground tabular-nums transition-[background,color,border-color] duration-[230ms] ease-out group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground group-focus-visible:border-transparent group-focus-visible:bg-primary group-focus-visible:text-primary-foreground"
                >
                  {year}
                </time>
              </span>
              <span
                style={{ animationDelay: delay }}
                className="timelineEnter timelineCard flex min-w-0 flex-col rounded-[9px] bg-card px-[17px] py-5 transition-[transform,background-color,box-shadow] duration-[230ms] ease-out group-hover:-translate-y-1 group-hover:bg-[color-mix(in_srgb,var(--foreground)_7%,var(--card))] group-hover:shadow-[0_8px_22px_rgb(36_40_35/0.07)] group-focus-visible:-translate-y-1 group-focus-visible:bg-[color-mix(in_srgb,var(--foreground)_7%,var(--card))] group-focus-visible:shadow-[0_8px_22px_rgb(36_40_35/0.07)] motion-reduce:translate-none! sm:px-6 sm:py-[22px]"
              >
                <span className="mb-[13px] font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  {project.kind ?? "Work"}
                  {project.period ? ` · ${project.period}` : ""}
                </span>
                <span className="mb-2.5 flex items-center justify-between gap-3.5 font-heading text-[1.125rem] leading-[1.3] tracking-[-0.4px] sm:text-[1.1875rem]">
                  {project.title}
                  <ArrowUpRight
                    aria-hidden
                    className="size-4 shrink-0 -translate-x-1 opacity-45 transition-[transform,opacity] duration-[230ms] ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:translate-x-0 motion-reduce:transition-none"
                  />
                </span>
                <span className="text-[13px] leading-[1.65] text-muted-foreground sm:text-sm">
                  {project.summary}
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
