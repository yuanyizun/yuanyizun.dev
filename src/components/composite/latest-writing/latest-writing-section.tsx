import "server-only";
import { getPosts } from "@/data/posts";
import { LatestWriting } from "./latest-writing";

export async function LatestWritingSection() {
  const posts = await getPosts();
  return <LatestWriting posts={posts} />;
}
