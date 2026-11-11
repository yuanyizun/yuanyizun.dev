import "server-only";
import { getProject, getProjects, type Project, type ProjectSummary } from "@/data/projects";

function relatedProjects(projects: ProjectSummary[], current: Project) {
  const others = projects.filter((project) => project.slug !== current.slug);
  const sameKind = others.filter(
    (project) => project.kind && project.kind === current.kind,
  );
  const rest = others.filter((project) => project.kind !== current.kind);
  return [...sameKind, ...rest].slice(0, 2).map((project) => ({
    href: `/projects/${project.slug}`,
    title: project.title,
    summary: project.summary,
    meta: [project.kind, project.period].filter(Boolean).join(" · "),
  }));
}

export async function getProjectPage(slug: string) {
  const [project, projects] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) return null;
  return { project, related: relatedProjects(projects, project) };
}
