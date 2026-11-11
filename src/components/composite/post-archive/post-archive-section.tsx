import "server-only";
import { getPostArchive } from "@/data/posts";
import { firstSearchParam } from "@/utils/search-params";
import { PostArchive } from "./post-archive";

export async function PostArchiveSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const query = firstSearchParam(params.q) ?? "";
  const page = Number(firstSearchParam(params.page) ?? "1") || 1;
  const posts = await getPostArchive();
  return <PostArchive posts={posts} query={query} page={page} />;
}
