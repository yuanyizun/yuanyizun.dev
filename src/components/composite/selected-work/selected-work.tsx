import { Suspense } from "react";
import { ButtonLink } from "@/components/primitive/button/button";
import type { SelectedWorkFacets } from "@/utils/selected-work-query";
import { SelectedWorkBody } from "./selected-work-body";
import { SelectedWorkFilterFallback } from "./selected-work-filter-fallback";
import type { TimelineProject } from "./selected-work-timeline";

function SelectedWorkBodyFallback() {
  return (
    <>
      <SelectedWorkFilterFallback />
      <div
        className="flex min-h-28 flex-col gap-4 py-2"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading results…</span>
        <div className="h-24 rounded-md bg-card" aria-hidden />
        <div className="h-24 rounded-md bg-card" aria-hidden />
      </div>
    </>
  );
}

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
      <Suspense fallback={<SelectedWorkBodyFallback />}>
        <SelectedWorkBody projects={projects} facets={facets} />
      </Suspense>
      <div>
        <ButtonLink href="/projects" variant="outline">
          View all projects
        </ButtonLink>
      </div>
    </section>
  );
}
