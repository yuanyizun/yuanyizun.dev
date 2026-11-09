import Link from "next/link";

type ArchiveProject = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  kind?: string;
  period?: string;
  context?: string;
  group?: "work" | "personal";
};

const priority = [
  "shared-publishing-templates",
  "laravel-comment-system",
  "event-ticket-sales-crm",
  "bigquery-data-pipeline",
  "aws-hosting-restructure",
  "salesforce-crm-middleware",
];

function ordered(projects: ArchiveProject[]) {
  return [...projects].sort((left, right) => {
    const leftIndex = priority.indexOf(left.slug);
    const rightIndex = priority.indexOf(right.slug);
    const leftRank = leftIndex === -1 ? priority.length : leftIndex;
    const rightRank = rightIndex === -1 ? priority.length : rightIndex;
    if (leftRank !== rightRank) return leftRank - rightRank;
    return left.date < right.date ? 1 : -1;
  });
}

export function ProjectArchive({
  projects,
  kind,
}: {
  projects: ArchiveProject[];
  kind: string;
}) {
  const kinds = [
    ...new Set(projects.map((project) => project.kind).filter(Boolean)),
  ] as string[];
  const filtered = kind
    ? projects.filter((project) => project.kind === kind)
    : projects;
  const work = ordered(filtered.filter((project) => project.group !== "personal"));
  const personal = ordered(filtered.filter((project) => project.group === "personal"));
  const [featured, ...rest] = work;

  return (
    <div className="flex flex-col gap-10">
      <nav aria-label="Project kinds" className="flex flex-wrap gap-2">
        <Link
          href="/projects"
          aria-current={kind ? undefined : "page"}
          className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm no-underline ${
            kind ? "bg-card" : "bg-primary text-primary-foreground"
          }`}
        >
          All
        </Link>
        {kinds.map((item) => (
          <Link
            key={item}
            href={`/projects?kind=${encodeURIComponent(item)}`}
            aria-current={kind === item ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-md px-3 text-sm no-underline ${
              kind === item ? "bg-primary text-primary-foreground" : "bg-card"
            }`}
          >
            {item}
          </Link>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-card p-6">
          <p>No projects in that group.</p>
          <Link href="/projects" className="mt-3 inline-flex text-sm no-underline hover:text-primary">
            Show all projects
          </Link>
        </div>
      ) : (
        <>
          {featured ? (
            <article className="flex flex-col justify-between gap-6 overflow-hidden rounded-xl bg-inverse p-6 text-inverse-foreground sm:p-8">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-inverse-muted">
                  {featured.context ?? featured.kind}
                  {featured.period ? ` · ${featured.period}` : ""}
                </p>
                <h2 className="font-heading text-4xl tracking-heading">
                  {featured.title}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-inverse-muted">
                  {featured.summary}
                </p>
              </div>
              <Link
                href={`/projects/${featured.slug}`}
                prefetch={false}
                className="inline-flex min-h-11 w-fit items-center rounded-md bg-primary px-4 text-sm text-primary-foreground no-underline"
              >
                Read case study
              </Link>
            </article>
          ) : null}

          {rest.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {rest.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    prefetch={false}
                    className="flex h-full flex-col gap-3 rounded-xl bg-card p-6 no-underline"
                  >
                    <p className="font-mono text-xs text-muted-foreground">
                      {project.kind}
                      {project.period ? ` · ${project.period}` : ""}
                    </p>
                    <p className="font-heading text-2xl tracking-heading">
                      {project.title}
                    </p>
                    <p className="text-sm leading-relaxed">{project.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {personal.length > 0 ? (
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-3xl tracking-heading">
                Personal project
              </h2>
              <ul className="grid gap-4 md:grid-cols-2">
                {personal.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/projects/${project.slug}`}
                      prefetch={false}
                      className="flex h-full flex-col gap-3 rounded-xl bg-card p-6 no-underline"
                    >
                      <p className="font-mono text-xs text-muted-foreground">
                        {project.period}
                      </p>
                      <p className="font-heading text-2xl tracking-heading">
                        {project.title}
                      </p>
                      <p className="text-sm leading-relaxed">{project.summary}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}
