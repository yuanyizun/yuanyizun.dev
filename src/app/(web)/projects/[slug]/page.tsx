import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProjectArticleSection } from "@/components/composite/project-article/project-article-section";
import { ProjectArticleSkeleton } from "@/components/composite/project-article/project-article-skeleton";
import { getProject, getProjectParams } from "@/data/projects";

export async function generateStaticParams() {
  return getProjectParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    notFound();
  }
  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: path,
      publishedTime: project.date,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
    ...(project.archived ? { robots: { index: false, follow: false } } : {}),
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectArticleSkeleton />}>
      <ProjectArticleSection params={params} />
    </Suspense>
  );
}
