import { HomeContent } from "@/components/composite/home-content/home-content";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { getHomeContent } from "@/services/home";

export const instant = false;

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const content = await getHomeContent(await searchParams);
  return (
    <PageFrame template="home">
      <HomeContent
        posts={content.posts}
        projects={content.projects}
        facets={content.facets}
      />
    </PageFrame>
  );
}
