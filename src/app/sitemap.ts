import type { MetadataRoute } from "next";
import { getPosts } from "@/data/posts";
import { getProjects } from "@/data/projects";
import { siteUrl } from "@/utils/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getPosts(), getProjects()]);
  const base = siteUrl();
  const staticPaths = [
    "/",
    "/about",
    "/posts",
    "/projects",
    "/interview",
    "/interview/app",
    "/contact",
  ];

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path === "/" ? "" : path}` })),
    ...posts.map((post) => ({
      url: `${base}/posts/${post.slug}`,
      lastModified: post.date,
    })),
    ...projects.map((project) => ({
      url: `${base}/projects/${project.slug}`,
      lastModified: project.date,
    })),
  ];
}
