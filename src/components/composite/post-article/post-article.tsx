import { Markdown } from "@/components/composite/markdown/markdown";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import type { Placement } from "@/theme/contracts";
import { extractHeadings, readingMinutes } from "@/utils/markdown";

type PostBody = {
  title: string;
  date: string;
  summary: string;
  content: string;
  image: string;
  alt: string;
  credit?: string;
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
  const positions: Placement | undefined =
    headings.length === 0 ? { sidebar: [] } : undefined;

  return (
    <PageFrame
      template="post"
      positions={positions}
      props={{
        Breadcrumbs: {
          items: [
            { label: "Posts", href: "/posts" },
            { label: post.title },
          ],
        },
        ArticleHeader: {
          article: {
            title: post.title,
            date: post.date,
            summary: post.summary,
            minutes: readingMinutes(post.content),
          },
        },
        ArticleCover: {
          alt: post.alt,
          image: post.image,
          ...(post.credit ? { credit: post.credit } : {}),
        },
        SectionNav: { headings, label: "Contents" },
        RelatedList: { title: "Related notes", items: related },
      }}
    >
      <article id="article-body" className="w-full max-w-[47.5rem]">
        <Markdown>{post.content}</Markdown>
      </article>
    </PageFrame>
  );
}
