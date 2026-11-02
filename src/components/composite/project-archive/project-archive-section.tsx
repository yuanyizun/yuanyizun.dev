import "server-only";
import { getProjects } from "@/data/projects";
import { firstSearchParam } from "@/utils/search-params";
import { ProjectArchive } from "./project-archive";

export async function ProjectArchiveSection({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const kind = firstSearchParam(params.kind) ?? "";
  const projects = await getProjects();
  return <ProjectArchive projects={projects} kind={kind} />;
}
