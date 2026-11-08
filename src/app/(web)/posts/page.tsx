import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { PostArchiveSection } from "@/components/composite/post-archive/post-archive-section";
import { PostArchiveSkeleton } from "@/components/composite/post-archive/post-archive-skeleton";

export const metadata: Metadata = {
  title: "Posts",
};

export default function PostsPage({ searchParams }: PageProps<"/posts">) {
  return (
    <PageFrame template="posts">
      <Suspense fallback={<PostArchiveSkeleton />}>
        <PostArchiveSection searchParams={searchParams} />
      </Suspense>
    </PageFrame>
  );
}
