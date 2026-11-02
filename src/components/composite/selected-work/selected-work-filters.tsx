"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  buildSelectedWorkHref,
  parseSelectedWorkQuery,
  type SelectedWorkFacets,
  type SelectedWorkSelection,
} from "@/utils/selected-work-query";
import { TypeFilter } from "./type-filter";
import { YearRangeFilter } from "./year-range-filter";

const throttleMs = 200;

function selectionKey(selection: SelectedWorkSelection) {
  return `${selection.fromYear}\0${selection.toYear}\0${selection.types.join("\0")}`;
}

function sameQuery(left: URLSearchParams, right: URLSearchParams) {
  const entries = (params: URLSearchParams) =>
    [...params.entries()].map(([key, value]) => `${key}=${value}`).sort();
  const leftEntries = entries(left);
  const rightEntries = entries(right);
  return (
    leftEntries.length === rightEntries.length &&
    leftEntries.every((entry, index) => entry === rightEntries[index])
  );
}

export function SelectedWorkFilters({ facets }: { facets: SelectedWorkFacets }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parsed = parseSelectedWorkQuery(searchParams, facets);
  const urlKey = selectionKey(parsed);
  const [draft, setDraft] = useState<SelectedWorkSelection | null>(null);
  const displayed = draft ?? parsed;
  const timerRef = useRef<number | null>(null);
  const draftRef = useRef(displayed);
  const searchParamsRef = useRef(searchParams);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

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
      const current = new URLSearchParams(searchParamsRef.current.toString());
      const href = buildSelectedWorkHref(current, next, facets);
      const nextParams = new URLSearchParams(href.split("?")[1] ?? "");
      if (sameQuery(current, nextParams)) return;
      router.replace(href, { scroll: false });
    }, throttleMs);
  }

  return (
    <div className="flex flex-col gap-6">
      <YearRangeFilter
        min={facets.minYear}
        max={facets.maxYear}
        from={displayed.fromYear}
        to={displayed.toYear}
        onChange={(fromYear, toYear) =>
          schedule({ ...draftRef.current, fromYear, toYear })
        }
      />
      <TypeFilter
        types={facets.types}
        selected={displayed.types}
        onChange={(types) => schedule({ ...draftRef.current, types })}
      />
    </div>
  );
}
