import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectArticleSection } from "@/components/composite/project-article/project-article-section";
import { ProjectArticleSkeleton } from "@/components/composite/project-article/project-article-skeleton";
import { getProject, getProjects } from "@/data/projects";

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
    return { title: "Projects" };
  }
  return {
    title: project.title,
    description: project.summary,
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectArticleSkeleton />}>
      <ProjectArticleSection params={params} />
    </Suspense>
  );
}
