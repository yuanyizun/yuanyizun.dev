import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "@/components/primitive/button/button";
import type { SelectedWorkFacets } from "@/utils/selected-work-query";
import { SelectedWorkFilterFallback } from "./selected-work-filter-fallback";
import { SelectedWorkFilters } from "./selected-work-filters";
import { SelectedWorkTimeline, type TimelineProject } from "./selected-work-timeline";

export function SelectedWork({
  projects,
  facets,
}: {
  projects: TimelineProject[];
  facets: SelectedWorkFacets;
}) {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="font-heading text-[clamp(2rem,3vw,2.75rem)] tracking-[-0.03em]">
        Selected work
      </h2>
      <Suspense fallback={<SelectedWorkFilterFallback />}>
        <SelectedWorkFilters facets={facets} />
      </Suspense>
      {projects.length === 0 ? (
        <div className="flex min-h-28 flex-col gap-3 py-6">
          <p>No projects in that range.</p>
          <Link href="/" className="inline-flex text-sm no-underline hover:text-primary">
            Show all selected work
          </Link>
        </div>
      ) : (
        <SelectedWorkTimeline projects={projects} />
      )}
      <div>
        <ButtonLink href="/projects" variant="outline">
          View all projects
        </ButtonLink>
      </div>
    </section>
  );
}
