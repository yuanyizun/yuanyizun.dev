import { LatestWriting } from "@/components/composite/latest-writing/latest-writing";
import { SelectedWork } from "@/components/composite/selected-work/selected-work";
import type { SelectedWorkFacets } from "@/utils/selected-work-query";

type HomePost = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

type HomeProject = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  period?: string;
  kind?: string;
};

export function HomeContent({
  posts,
  projects,
  facets,
}: {
  posts: HomePost[];
  projects: HomeProject[];
  facets: SelectedWorkFacets;
}) {
  return (
    <div className="flex flex-col gap-16">
      <SelectedWork projects={projects} facets={facets} />
      <LatestWriting posts={posts} />
    </div>
  );
}
