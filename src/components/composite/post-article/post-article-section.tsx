import "server-only";
import { notFound } from "next/navigation";
import { highlightFences } from "@/components/composite/markdown/highlight";
import { getPostPage } from "@/services/pages/post-page";
import { PostArticle } from "./post-article";

export async function PostArticleSection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPostPage(slug);
  if (!article) {
    notFound();
  }
  const highlighted = await highlightFences(article.post.content);
  return (
    <PostArticle
      post={article.post}
      related={article.related}
      highlighted={highlighted}
    />
  );
}
