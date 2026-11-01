import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Markdown } from "@/components/markdown";
import { ArticleBodyFallback } from "@/features/loading-fallbacks";
import { formatDisplayDate, extractHeadings, readingMinutes } from "@/lib/headings";
import { getPost, getPosts } from "@/lib/content";
import type { Placement, RelatedItem } from "@/theme/contracts";
import { PageFrame } from "@/theme/PageFrame";

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

async function PostArticle({
  params,
}: {
  params: PageProps<"/posts/[slug]">["params"];
}) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);
  const related: RelatedItem[] = posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2)
    .map((item) => ({
      href: `/posts/${item.slug}`,
      title: item.title,
      summary: item.summary,
      meta: formatDisplayDate(item.date),
    }));

  const positions: Placement = {
    "after-header": [
      {
        id: "post-breadcrumbs",
        type: "Breadcrumbs",
        props: {
          items: [
            { label: "Posts", href: "/posts" },
            { label: post.title },
          ],
        },
      },
    ],
    "main-before": [
      {
        id: "post-title",
        type: "ArticleHeader",
        props: {
          article: {
            title: post.title,
            date: post.date,
            summary: post.summary,
            minutes: readingMinutes(post.content),
          },
        },
      },
    ],
    "main-middle": [
      { id: "post-cover", type: "ArticleCover", props: { title: post.title } },
    ],
    sidebar: headings.length
      ? [
          {
            id: "post-contents",
            type: "ArticleNavigation",
            props: { headings, label: "Contents" },
          },
        ]
      : [],
    "main-after": [
      { id: "post-author", type: "AuthorBio", props: {} },
      ...(related.length
        ? [
            {
              id: "post-related" as const,
              type: "RelatedPosts" as const,
              props: { items: related },
            },
          ]
        : []),
    ],
  };

  return (
    <PageFrame template="post" positions={positions}>
      <article id="article-body" className="reading-column">
        <Markdown>{post.content}</Markdown>
      </article>
    </PageFrame>
  );
}

export default function PostPage(props: PageProps<"/posts/[slug]">) {
  return (
    <Suspense
      fallback={
        <PageFrame template="post">
          <ArticleBodyFallback label="Loading note…" />
        </PageFrame>
      }
    >
      <PostArticle params={props.params} />
    </Suspense>
  );
}
