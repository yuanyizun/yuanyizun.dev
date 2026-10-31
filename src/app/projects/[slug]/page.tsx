import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { getProject, getProjects } from "@/lib/content";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
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
    <article className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
      <p className="text-sm text-muted-foreground">
        <time dateTime={project.date}>{project.date}</time>
      </p>
      <p>{project.summary}</p>
      {project.url ? (
        <p>
          <a href={project.url}>{project.url}</a>
        </p>
      ) : null}
      <Markdown>{project.content}</Markdown>
    </article>
  );
}

export default function ProjectPage(props: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <ProjectArticle params={props.params} />
    </Suspense>
  );
}
