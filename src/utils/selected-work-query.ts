export type SelectedWorkFacets = {
  minYear: number;
  maxYear: number;
  types: string[];
};

export const selectedWorkParams = {
  from: "from",
  to: "to",
  type: "type",
} as const;

export type SelectedWorkSelection = {
  fromYear: number;
  toYear: number;
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
  const to = yearInSpan(parseYear(readValues(source, selectedWorkParams.to)[0]), facets);
  let fromYear = from === undefined ? facets.minYear : from;
  let toYear = to === undefined ? facets.maxYear : to;

  if (fromYear > toYear) {
    const swap = fromYear;
    fromYear = toYear;
    toYear = swap;
  }

  const known = new Set(facets.types);
  const requested = readValues(source, selectedWorkParams.type).filter((type) =>
    known.has(type),
  );
  const unique = facets.types.filter((type) => requested.includes(type));
  const types = unique.length === facets.types.length ? [] : unique;

  return { fromYear, toYear, types };
}

export function buildSelectedWorkHref(
  current: URLSearchParams,
  selection: SelectedWorkSelection,
  facets: SelectedWorkFacets,
  pathname = "/",
) {
  const next = new URLSearchParams(current);
  next.delete(selectedWorkParams.from);
  next.delete(selectedWorkParams.to);
  next.delete(selectedWorkParams.type);

  let fromYear = clampYear(selection.fromYear, facets);
  let toYear = clampYear(selection.toYear, facets);
  if (fromYear > toYear) {
    const swap = fromYear;
    fromYear = toYear;
    toYear = swap;
  }

  if (fromYear !== facets.minYear) {
    next.set(selectedWorkParams.from, String(fromYear));
  }
  if (toYear !== facets.maxYear) {
    next.set(selectedWorkParams.to, String(toYear));
  }

  const chosen = new Set(selection.types);
  const types = facets.types.filter((type) => chosen.has(type));
  if (types.length > 0 && types.length < facets.types.length) {
    for (const type of types) {
      next.append(selectedWorkParams.type, type);
    }
  }

  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}
