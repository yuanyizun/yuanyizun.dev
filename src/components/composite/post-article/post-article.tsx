import { Markdown } from "@/components/composite/markdown/markdown";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import type { Placement } from "@/theme/contracts";
import { extractHeadings, readingMinutes } from "@/utils/markdown";

type PostBody = {
  title: string;
  date: string;
  summary: string;
  content: string;
};

type RelatedLink = {
  href: string;
  title: string;
  summary: string;
  meta: string;
};

export function PostArticle({
  post,
  related,
}: {
  post: PostBody;
  related: RelatedLink[];
}) {
  const headings = extractHeadings(post.content);
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
      <article id="article-body" className="w-full max-w-[47.5rem]">
        <Markdown>{post.content}</Markdown>
      </article>
    </PageFrame>
  );
}
