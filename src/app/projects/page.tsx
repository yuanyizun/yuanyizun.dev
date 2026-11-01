import type { Metadata } from "next";
import { Suspense } from "react";
import { ProjectArchive } from "@/features/project-archive";
import { getProjects } from "@/lib/content";
import { PageFrame } from "@/theme/PageFrame";

export const metadata: Metadata = {
  title: "Projects",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function ProjectsResults({
  searchParams,
}: {
  searchParams: PageProps<"/projects">["searchParams"];
}) {
  const params = await searchParams;
  const kind = firstParam(params.kind) ?? "";
  const projects = await getProjects();
  return <ProjectArchive projects={projects} kind={kind} />;
}

export default function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  return (
    <PageFrame template="projects">
      <Suspense fallback={<p>Loading projects…</p>}>
        <ProjectsResults searchParams={searchParams} />
      </Suspense>
    </PageFrame>
  );
}
