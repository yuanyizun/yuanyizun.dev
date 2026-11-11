import "server-only";
import { notFound } from "next/navigation";
import { highlightFences } from "@/components/composite/markdown/highlight";
import { getProjectPage } from "@/services/pages/project-page";
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
  const highlighted = await highlightFences(article.project.content);
  return (
    <ProjectArticle
      project={article.project}
      related={article.related}
      highlighted={highlighted}
    />
  );
}
