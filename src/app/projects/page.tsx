import type { Metadata } from "next";
import Link from "next/link";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="page-shell flex flex-col gap-12 py-12 sm:py-20">
      <header className="quiet-column flex flex-col gap-4">
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] tracking-[-0.04em]">
          Work
        </h1>
        <p className="text-[1.125rem] text-foreground">
          Selected systems from eleven years at one digital publisher, plus one
          personal project.
        </p>
      </header>
      <ul className="work-list quiet-column flex w-full flex-col">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/projects/${project.slug}`}
              className="work-row grid gap-1 py-4 no-underline sm:grid-cols-[minmax(0,1.4fr)_auto] sm:items-baseline sm:gap-8"
            >
              <span>
                <span className="block text-[1.05rem] tracking-[-0.01em]">
                  {project.title}
                </span>
                <span className="mt-1 block text-[0.9375rem] text-muted-foreground">
                  {project.summary}
                </span>
              </span>
              {project.period ? (
                <span className="text-[0.875rem] text-muted-foreground tabular-nums sm:text-right">
                  {project.period}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
