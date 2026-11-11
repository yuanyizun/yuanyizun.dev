import { notFound } from "next/navigation";
import { getPost, getPostParams } from "@/data/posts";
import { shareImage } from "@/utils/share-image";
import { siteName } from "@/utils/site-url";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getPostParams();
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return shareImage({
    title: post.title,
    summary: post.summary,
    width: size.width,
    height: size.height,
  });
}
