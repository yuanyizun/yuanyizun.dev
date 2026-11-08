import type { Metadata } from "next";
import { Suspense } from "react";
import { PostArticleSection } from "@/components/composite/post-article/post-article-section";
import { PostArticleSkeleton } from "@/components/composite/post-article/post-article-skeleton";
import { getPost, getPosts } from "@/data/posts";

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

export default function PostPage({ params }: PageProps<"/posts/[slug]">) {
  return (
    <Suspense fallback={<PostArticleSkeleton />}>
      <PostArticleSection params={params} />
    </Suspense>
  );
}
