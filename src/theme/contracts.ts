export const SITE_POSITIONS = [
  "before-header",
  "header",
  "before-footer",
  "footer",
  "after-footer",
] as const;

export const ROUTE_POSITIONS = [
  "after-header",
  "main-before",
  "main-middle",
  "sidebar",
  "main-after",
] as const;

export const POSITION_NAMES = [
  "before-header",
  "header",
  "after-header",
  "main-before",
  "main-middle",
  "sidebar",
  "main-after",
  "before-footer",
  "footer",
  "after-footer",
] as const;

export type PositionName = (typeof POSITION_NAMES)[number];

export type SitePosition = (typeof SITE_POSITIONS)[number];

export type RoutePosition = (typeof ROUTE_POSITIONS)[number];

export type PlacementEntry = string | { id: string; component: string };

export type Placement = Partial<Record<PositionName, PlacementEntry[]>>;

export type PlacementRegion = "site" | "route";

export type AllowedPositions = Readonly<Record<string, readonly PositionName[]>>;

const SITE_SET = new Set<string>(SITE_POSITIONS);
const ROUTE_SET = new Set<string>(ROUTE_POSITIONS);
const POSITION_SET = new Set<string>(POSITION_NAMES);

export function readPlacementEntry(entry: PlacementEntry): { id: string; component: string } | null {
  if (typeof entry === "string") {
    return entry.length > 0 ? { id: entry, component: entry } : null;
  }
  if (entry.id.length === 0 || entry.component.length === 0) {
    return null;
  }
  return { id: entry.id, component: entry.component };
}

export function validatePlacement(
  placement: Placement,
  region: PlacementRegion,
  allowed: AllowedPositions,
): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  const regionSet = region === "site" ? SITE_SET : ROUTE_SET;

  for (const [position, entries] of Object.entries(placement)) {
    if (!POSITION_SET.has(position)) {
      errors.push(`Unknown position "${position}"`);
      continue;
    }

    if (!regionSet.has(position)) {
      errors.push(
        region === "route"
          ? `Site position "${position}" cannot be set on a template`
          : `Route position "${position}" cannot be set on the site`,
      );
      continue;
    }

    for (const entry of entries ?? []) {
      const parsed = readPlacementEntry(entry);
      if (!parsed) {
        errors.push(`Invalid placement entry in "${position}"`);
        continue;
      }

      if (ids.has(parsed.id)) {
        errors.push(`Duplicate assignment id "${parsed.id}"`);
      }
      ids.add(parsed.id);

      const positions = allowed[parsed.component];
      if (!positions) {
        errors.push(`Unknown component "${parsed.component}"`);
        continue;
      }
      if (!positions.includes(position as PositionName)) {
        errors.push(`${parsed.component} cannot be placed in "${position}"`);
      }
    }
  }

  return errors;
}
