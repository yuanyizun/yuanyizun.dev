import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/composite/project-article/project-article";
import { getProject, getProjects } from "@/data/projects";
import { getProjectPage } from "@/services/project-page";

export const instant = false;

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

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const article = await getProjectPage(slug);
  if (!article) {
    notFound();
  }
  return <ProjectArticle project={article.project} related={article.related} />;
}
