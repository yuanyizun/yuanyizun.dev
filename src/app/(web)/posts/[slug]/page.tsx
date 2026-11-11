import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PostArticleSection } from "@/components/composite/post-article/post-article-section";
import { PostArticleSkeleton } from "@/components/composite/post-article/post-article-skeleton";
import { getPost, getPostParams } from "@/data/posts";

export async function generateStaticParams() {
  return getPostParams();
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }
  const path = `/posts/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: path,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
    ...(post.archived ? { robots: { index: false, follow: false } } : {}),
  };
}

export default function PostPage({ params }: PageProps<"/posts/[slug]">) {
  return (
    <Suspense fallback={<PostArticleSkeleton />}>
      <PostArticleSection params={params} />
    </Suspense>
  );
}
