import "server-only";
import { notFound } from "next/navigation";
import { getProjectPage } from "@/services/project-page";
import { ProjectArticle } from "./project-article";

export async function ProjectArticleSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getProjectPage(slug);
  if (!article) {
    notFound();
  }
  return <ProjectArticle project={article.project} related={article.related} />;
}
