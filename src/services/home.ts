import "server-only";
import { getPosts } from "@/data/posts";
import { getSelectedWork } from "@/services/selected-work";

export async function getHomeContent(
  params: Record<string, string | string[] | undefined>,
) {
  const [posts, selected] = await Promise.all([getPosts(), getSelectedWork(params)]);
  return {
    posts,
    projects: selected.projects,
    facets: selected.facets,
  };
}
