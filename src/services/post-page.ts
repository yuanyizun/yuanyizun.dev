import "server-only";
import { getPost, getPosts } from "@/data/posts";
import { formatDisplayDate } from "@/utils/date";

export async function getPostPage(slug: string) {
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);
  if (!post) return null;

  const related = posts
    .filter((item) => item.slug !== post.slug)
    .slice(0, 2)
    .map((item) => ({
      href: `/posts/${item.slug}`,
      title: item.title,
      summary: item.summary,
      meta: formatDisplayDate(item.date),
    }));

  return { post, related };
}
