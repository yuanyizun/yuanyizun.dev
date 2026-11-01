import { HomeContent } from "@/features/home-content";
import { getPosts, getProjects } from "@/lib/content";
import { PageFrame } from "@/theme/PageFrame";

export default async function HomePage() {
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  return (
    <PageFrame template="home">
      <HomeContent projects={projects} posts={posts} />
    </PageFrame>
  );
}
