import type { Metadata } from "next";
import { Suspense } from "react";
import { PostArchive } from "@/features/post-archive";
import { getPosts } from "@/lib/content";
import { PageFrame } from "@/theme/PageFrame";

export const metadata: Metadata = {
  title: "Posts",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function PostsResults({
  searchParams,
}: {
  searchParams: PageProps<"/posts">["searchParams"];
}) {
  const params = await searchParams;
  const query = firstParam(params.q) ?? "";
  const page = Number(firstParam(params.page) ?? "1") || 1;
  const posts = await getPosts();
  return <PostArchive posts={posts} query={query} page={page} />;
}

export default function PostsPage({ searchParams }: PageProps<"/posts">) {
  return (
    <PageFrame template="posts">
      <Suspense fallback={<p>Loading notes…</p>}>
        <PostsResults searchParams={searchParams} />
      </Suspense>
    </PageFrame>
  );
}
