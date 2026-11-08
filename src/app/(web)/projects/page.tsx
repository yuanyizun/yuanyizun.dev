import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { ProjectArchiveSection } from "@/components/composite/project-archive/project-archive-section";
import { ProjectArchiveSkeleton } from "@/components/composite/project-archive/project-archive-skeleton";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage({ searchParams }: PageProps<"/projects">) {
  return (
    <PageFrame
      template="projects"
      props={{
        PageIntro: {
          title: "Production systems. Practical outcomes.",
          summary:
            "Selected systems from eleven years at one digital publisher, plus one personal project.",
        },
      }}
    >
      <Suspense fallback={<ProjectArchiveSkeleton />}>
        <ProjectArchiveSection searchParams={searchParams} />
      </Suspense>
    </PageFrame>
  );
}
