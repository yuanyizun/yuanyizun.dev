import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { getPost, getPosts } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

async function PostArticle({
  params,
}: {
  params: PageProps<"/posts/[slug]">["params"];
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col gap-4">
      <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
      <p className="text-sm text-muted-foreground">
        <time dateTime={post.date}>{post.date}</time>
      </p>
      <p>{post.summary}</p>
      <Markdown>{post.content}</Markdown>
    </article>
  );
}

export default function PostPage(props: PageProps<"/posts/[slug]">) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <PostArticle params={props.params} />
    </Suspense>
  );
}
