import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { getProject, getProjects } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return { title: "Work" };
  }
  return {
    title: project.title,
    description: project.summary,
  };
}

async function ProjectArticle({
  params,
}: {
  params: PageProps<"/projects/[slug]">["params"];
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }

  return (
    <article className="page-shell flex max-w-3xl flex-col gap-6 py-12 sm:py-20">
      <Link
        href="/projects"
        className="w-fit text-[0.9375rem] font-semibold text-muted-foreground no-underline hover:text-accent"
      >
        Work
      </Link>
      {project.period ? (
        <p className="text-[0.9375rem] font-semibold text-muted-foreground tabular-nums">
          {project.period}
        </p>
      ) : null}
      <h1 className="font-heading text-[clamp(2.4rem,6vw,4.25rem)] tracking-[-0.05em]">
        {project.title}
      </h1>
      <p className="text-[1.15rem] text-muted-foreground">{project.summary}</p>
      {project.url ? (
        <p>
          <a href={project.url}>{project.url}</a>
        </p>
      ) : null}
      <div className="prose-site flex flex-col gap-4 text-[1.05rem] leading-relaxed">
        <Markdown>{project.content}</Markdown>
      </div>
    </article>
  );
}

export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<p className="page-shell py-12">Loading…</p>}>
      <ProjectArticle params={props.params} />
    </Suspense>
  );
}
