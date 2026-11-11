import { extractHeadings, showContents } from "@/components/composite/markdown/headings";
import { Markdown } from "@/components/composite/markdown/markdown";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import type { Placement } from "@/theme/contracts";
import { readingMinutes } from "@/utils/markdown";

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
  highlighted,
}: {
  post: PostBody;
  related: RelatedLink[];
  highlighted: string[];
}) {
  const headings = extractHeadings(post.content);
  const contents = showContents(headings);
  const positions: Placement | undefined = contents ? undefined : { sidebar: [] };

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
        ...(contents ? { SectionNav: { headings, label: "Contents" } } : {}),
        RelatedList: { title: "Related notes", items: related },
      }}
    >
      <article id="article-body" className="w-full max-w-[47.5rem]">
        <Markdown headings={headings} highlighted={highlighted}>
          {post.content}
        </Markdown>
      </article>
    </PageFrame>
  );
}
