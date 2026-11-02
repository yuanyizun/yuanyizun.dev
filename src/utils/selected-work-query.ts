import type { QueryFilterPatch } from "@/utils/query-params";

export type SelectedWorkFacets = {
  minYear: number;
  maxYear: number;
  types: string[];
};

export const selectedWorkParams = {
  from: "workFrom",
  to: "workTo",
  type: "workType",
} as const;

export type SelectedWorkSelection = {
  fromYear: number;
  types: string[];
};

type ParamSource = URLSearchParams | Record<string, string | string[] | undefined>;

function readValues(source: ParamSource, key: string) {
  if (source instanceof URLSearchParams) {
    return source.getAll(key).map((value) => value.trim()).filter(Boolean);
  }

  const value = source[key];
  if (Array.isArray(value)) {
    return value.map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function parseYear(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  return Number(value);
}

function clampYear(year: number, facets: SelectedWorkFacets) {
  return Math.min(facets.maxYear, Math.max(facets.minYear, year));
}

function yearInSpan(year: number | undefined, facets: SelectedWorkFacets) {
  if (year === undefined) return undefined;
  if (year < facets.minYear || year > facets.maxYear) return undefined;
  return year;
}

export function parseSelectedWorkQuery(
  source: ParamSource,
  facets: SelectedWorkFacets,
): SelectedWorkSelection {
  const from = yearInSpan(
    parseYear(readValues(source, selectedWorkParams.from)[0]),
    facets,
  );
  const fromYear = from === undefined ? facets.minYear : from;

  const known = new Set(facets.types);
  const requested = readValues(source, selectedWorkParams.type).filter((type) =>
    known.has(type),
  );
  const unique = facets.types.filter((type) => requested.includes(type));
  const types = unique.length === facets.types.length ? [] : unique;

  return { fromYear, types };
}

export function selectedWorkFilterPatch(
  selection: SelectedWorkSelection,
  facets: SelectedWorkFacets,
): QueryFilterPatch {
  const fromYear = clampYear(selection.fromYear, facets);

  const chosen = new Set(selection.types);
  const types = facets.types.filter((type) => chosen.has(type));
  const includeTypes = types.length > 0 && types.length < facets.types.length;

  return {
    [selectedWorkParams.from]:
      fromYear !== facets.minYear ? String(fromYear) : null,
    [selectedWorkParams.to]: null,
    [selectedWorkParams.type]: includeTypes ? types : null,
  };
}
