import Link from "next/link";

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
  if (projects.length === 0) {
    return null;
  }

  return (
    <ol className="relative m-0 list-none p-0">
      <span
        className="pointer-events-none absolute top-2 bottom-2 left-[2.35rem] w-px bg-border sm:left-[3.1rem]"
        aria-hidden
      />
      {projects.map((project) => {
        const year = yearFromDate(project.date);
        return (
          <li key={project.slug} className="relative">
            <Link
              href={`/projects/${project.slug}`}
              className="group grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-5 no-underline sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
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
                <span className="font-heading text-[clamp(1.35rem,2.2vw,1.85rem)] tracking-[-0.03em] transition-colors group-hover:text-primary group-focus-visible:text-primary">
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
  );
}
