import Link from "next/link";
import { formatDisplayDate } from "@/lib/headings";
import type { Post, Project } from "@/lib/content";
import { SelectedWorkTimeline } from "@/modules/selected-work-timeline";

const featuredSlugs = [
  "laravel-comment-system",
  "event-ticket-sales-crm",
  "salesforce-crm-middleware",
  "bigquery-data-pipeline",
  "shared-publishing-templates",
  "aws-hosting-restructure",
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
    .filter((project): project is Project => Boolean(project))
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex flex-col gap-16">
      <SelectedWorkTimeline
        projects={featured.map((project) => ({
          slug: project.slug,
          title: project.title,
          date: project.date,
          summary: project.summary,
          period: project.period,
          kind: project.kind,
        }))}
      />

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
