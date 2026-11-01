import Link from "next/link";
import { formatDisplayDate } from "@/lib/headings";
import type { Post, Project } from "@/lib/content";
import { BrowserPreview } from "@/theme/covers";

const featuredSlugs = [
  "shared-publishing-templates",
  "laravel-comment-system",
  "event-ticket-sales-crm",
] as const;

export function HomeContent({
  projects,
  posts,
}: {
  projects: Project[];
  posts: Post[];
}) {
  const featured = featuredSlugs
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project));
  const [lead, ...rest] = featured;

  return (
    <div className="flex flex-col gap-16">
      {lead ? (
        <section className="flex flex-col gap-6">
          <h2 className="font-heading text-[clamp(2rem,3vw,2.75rem)] tracking-[-0.03em]">
            Selected work
          </h2>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <Link
              href={`/projects/${lead.slug}`}
              className="flex flex-col justify-between gap-8 rounded-xl bg-inverse p-6 text-inverse-foreground no-underline sm:p-8"
            >
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs text-inverse-muted">
                  {lead.kind ?? "Work"}
                  {lead.period ? ` · ${lead.period}` : ""}
                </p>
                <p className="font-heading text-4xl tracking-[-0.03em]">
                  {lead.title}
                </p>
                <p className="max-w-md text-sm leading-relaxed text-inverse-muted">
                  {lead.summary}
                </p>
              </div>
              <span className="text-sm text-primary">Read case study</span>
            </Link>
            <div className="overflow-hidden rounded-xl">
              <BrowserPreview title={lead.title} tone="dark" />
            </div>
          </div>
          {rest.length > 0 ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {rest.map((project) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="flex h-full flex-col gap-3 rounded-xl bg-card p-6 no-underline"
                  >
                    <p className="font-mono text-xs text-muted-foreground">
                      {project.kind ?? "Work"}
                      {project.period ? ` · ${project.period}` : ""}
                    </p>
                    <p className="font-heading text-2xl tracking-[-0.03em]">
                      {project.title}
                    </p>
                    <p className="text-sm leading-relaxed">{project.summary}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          <Link href="/projects" className="w-fit text-sm no-underline hover:text-primary">
            All projects
          </Link>
        </section>
      ) : null}

      <section className="flex flex-col gap-5">
        <h2 className="font-heading text-[clamp(2rem,3vw,2.75rem)] tracking-[-0.03em]">
          Latest writing
        </h2>
        {posts.length === 0 ? (
          <p>No notes published yet.</p>
        ) : (
          <ul className="flex flex-col">
            {posts.slice(0, 4).map((post) => (
              <li key={post.slug} className="border-t border-border">
                <Link
                  href={`/posts/${post.slug}`}
                  className="grid gap-2 py-5 no-underline sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8"
                >
                  <time
                    dateTime={post.date}
                    className="font-mono text-xs text-muted-foreground"
                  >
                    {formatDisplayDate(post.date)}
                  </time>
                  <span>
                    <span className="block text-lg">{post.title}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {post.summary}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
