import { notFound } from "next/navigation";
import { getProject, getProjectParams } from "@/data/projects";
import { shareImage } from "@/utils/share-image";
import { siteName } from "@/utils/site-url";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getProjectParams();
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return shareImage({
    title: project.title,
    summary: project.summary,
    width: size.width,
    height: size.height,
  });
}
