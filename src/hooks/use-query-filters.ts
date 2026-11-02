"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { QueryFilterPatch } from "@/utils/query-params";

export type { QueryFilterPatch, QueryFilterValue } from "@/utils/query-params";

function queryEntries(params: URLSearchParams) {
  return [...params.entries()].map(([key, value]) => `${key}=${value}`).sort();
}

function sameQuery(left: URLSearchParams, right: URLSearchParams) {
  const leftEntries = queryEntries(left);
  const rightEntries = queryEntries(right);
  return (
    leftEntries.length === rightEntries.length &&
    leftEntries.every((entry, index) => entry === rightEntries[index])
  );
}

function applyPatch(params: URLSearchParams, patch: QueryFilterPatch) {
  const next = new URLSearchParams(params);
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) continue;
    next.delete(key);
    if (value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        next.append(key, item);
      }
    } else {
      next.set(key, value);
    }
  }
  return next;
}

function toHref(pathname: string, params: URLSearchParams, hash: string) {
  const query = params.toString();
  const path = query ? `${pathname}?${query}` : pathname;
  return hash ? `${path}${hash}` : path;
}

/**
 * Shared URL filter coordinator. Use one instance per page region that owns
 * filters. Multiple independent filter bars on one page need a shared provider;
 * a ref local to separate hook instances does not coordinate across controls.
 */
export function useQueryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchParamsRef = useRef(searchParams);
  const intendedRef = useRef<URLSearchParams | null>(null);

  useEffect(() => {
    searchParamsRef.current = searchParams;
    if (intendedRef.current && sameQuery(intendedRef.current, searchParams)) {
      intendedRef.current = null;
    }
  }, [searchParams]);

  const updateFilters = useCallback(
    (patch: QueryFilterPatch) => {
      const base =
        intendedRef.current ??
        new URLSearchParams(searchParamsRef.current.toString());
      const next = applyPatch(base, patch);
      const currentUrl = new URLSearchParams(searchParamsRef.current.toString());
      if (sameQuery(currentUrl, next)) {
        intendedRef.current = null;
        return;
      }

      intendedRef.current = next;
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      const href = toHref(pathname, next, hash);
      startTransition(() => {
        router.replace(href, { scroll: false });
      });
    },
    [pathname, router],
  );

  return { updateFilters, isPending };
}
