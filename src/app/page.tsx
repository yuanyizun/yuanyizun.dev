import { Suspense } from "react";
import { HomeContent } from "@/features/home-content";
import { HomeContentFallback } from "@/features/loading-fallbacks";
import { getPosts, getProjects } from "@/lib/content";
import { PageFrame } from "@/theme/PageFrame";

async function HomeResults() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);
  return <HomeContent projects={projects} posts={posts} />;
}

export default function HomePage() {
  return (
    <PageFrame template="home">
      <Suspense fallback={<HomeContentFallback />}>
        <HomeResults />
      </Suspense>
    </PageFrame>
  );
}
