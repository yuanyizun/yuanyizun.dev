import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { getPost, getPosts } from "@/lib/content";

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
    return { title: "Notes" };
  }
  return {
    title: post.title,
    description: post.summary,
  };
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
    <article className="page-shell flex max-w-3xl flex-col gap-6 py-12 sm:py-20">
      <Link
        href="/posts"
        className="w-fit text-[0.9375rem] font-semibold text-muted-foreground no-underline hover:text-accent"
      >
        Notes
      </Link>
      <h1 className="font-heading text-[clamp(2.4rem,6vw,4.25rem)] tracking-[-0.05em]">
        {post.title}
      </h1>
      <p className="text-[0.9375rem] text-muted-foreground">
        <time dateTime={post.date}>{post.date}</time>
      </p>
      <p className="text-[1.15rem] text-muted-foreground">{post.summary}</p>
      <div className="flex flex-col gap-4 text-[1.05rem] leading-relaxed">
        <Markdown>{post.content}</Markdown>
      </div>
    </article>
  );
}

export default function PostPage(props: PageProps<"/posts/[slug]">) {
  return (
    <Suspense fallback={<p className="page-shell py-12">Loading…</p>}>
      <PostArticle params={props.params} />
    </Suspense>
  );
}
