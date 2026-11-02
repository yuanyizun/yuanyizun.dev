import type { Metadata } from "next";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { PostArchive } from "@/components/composite/post-archive/post-archive";
import { getPosts } from "@/data/posts";
import { firstSearchParam } from "@/utils/search-params";

export const instant = false;

export const metadata: Metadata = {
  title: "Posts",
};

export default async function PostsPage({ searchParams }: PageProps<"/posts">) {
  const params = await searchParams;
  const query = firstSearchParam(params.q) ?? "";
  const page = Number(firstSearchParam(params.page) ?? "1") || 1;
  const posts = await getPosts();

  return (
    <PageFrame template="posts">
      <PostArchive posts={posts} query={query} page={page} />
    </PageFrame>
  );
}
