import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostArticle } from "@/components/composite/post-article/post-article";
import { getPost, getPosts } from "@/data/posts";
import { getPostPage } from "@/services/post-page";

export const instant = false;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return { title: "Posts" };
  }
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const article = await getPostPage(slug);
  if (!article) {
    notFound();
  }
  return <PostArticle post={article.post} related={article.related} />;
}
