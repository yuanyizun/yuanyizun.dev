import type { Metadata } from "next";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { ProjectArchive } from "@/components/composite/project-archive/project-archive";
import { getProjects } from "@/data/projects";
import { firstSearchParam } from "@/utils/search-params";

export const instant = false;

export const metadata: Metadata = {
  title: "Projects",
};

export default async function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  const params = await searchParams;
  const kind = firstSearchParam(params.kind) ?? "";
  const projects = await getProjects();

  return (
    <PageFrame template="projects">
      <ProjectArchive projects={projects} kind={kind} />
    </PageFrame>
  );
}
