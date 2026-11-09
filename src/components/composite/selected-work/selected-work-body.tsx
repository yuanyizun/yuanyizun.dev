"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQueryFilters } from "@/hooks/use-query-filters";
import {
  parseSelectedWorkQuery,
  selectedWorkFilterPatch,
  type SelectedWorkFacets,
  type SelectedWorkSelection,
} from "@/utils/selected-work-query";
import { SelectedWorkTimeline, type TimelineProject } from "./selected-work-timeline";
import { TypeFilter } from "./type-filter";
import { YearFromFilter } from "./year-from-filter";

const throttleMs = 200;

function selectionKey(selection: SelectedWorkSelection) {
  return `${selection.fromYear}\0${selection.types.join("\0")}`;
}

export function SelectedWorkBody({
  projects,
  facets,
}: {
  projects: TimelineProject[];
  facets: SelectedWorkFacets;
}) {
  const searchParams = useSearchParams();
  const { updateFilters, isPending } = useQueryFilters();
  const parsed = parseSelectedWorkQuery(searchParams, facets);
  const urlKey = selectionKey(parsed);
  const [draft, setDraft] = useState<SelectedWorkSelection | null>(null);
  const displayed = draft ?? parsed;
  const timerRef = useRef<number | null>(null);
  const draftRef = useRef(displayed);

  useEffect(() => {
    if (timerRef.current !== null) return;
    draftRef.current = parseSelectedWorkQuery(searchParams, facets);
    setDraft(null);
  }, [urlKey, searchParams, facets]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function schedule(next: SelectedWorkSelection) {
    draftRef.current = next;
    setDraft(next);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      updateFilters(selectedWorkFilterPatch(draftRef.current, facets));
    }, throttleMs);
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <TypeFilter
          types={facets.types}
          selected={displayed.types}
          onChange={(types) => schedule({ ...draftRef.current, types })}
        />
        <YearFromFilter
          min={facets.minYear}
          max={facets.maxYear}
          value={displayed.fromYear}
          onChange={(fromYear) => schedule({ ...draftRef.current, fromYear })}
        />
      </div>
      <div
        aria-busy={isPending || undefined}
        className={
          isPending
            ? "opacity-60 transition-opacity duration-200"
            : "transition-opacity duration-200"
        }
      >
        {isPending ? <span className="sr-only">Updating results…</span> : null}
        {projects.length === 0 ? (
          <div className="flex min-h-28 flex-col gap-3 py-6">
            <p>No projects in that range.</p>
            <Link href="/" prefetch={false} className="inline-flex text-sm no-underline hover:text-primary">
              Show all selected work
            </Link>
          </div>
        ) : (
          <SelectedWorkTimeline projects={projects} />
        )}
      </div>
    </>
  );
}
