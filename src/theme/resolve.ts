import placementsJson from "./placements.json" with { type: "json" };
import {
  ROUTE_POSITIONS,
  type AllowedPositions,
  type Placement,
  type PlacementEntry,
  type PlacementRegion,
  type PositionName,
  validatePlacement,
} from "./contracts";

function hasOwn(record: object, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

const ROUTE_SET = new Set<string>(ROUTE_POSITIONS);

export const sitePlacement = placementsJson.site as Placement;

export type TemplateKey = keyof typeof placementsJson.templates;

export function templatePlacement(template: TemplateKey): Placement {
  return placementsJson.templates[template] as Placement;
}

export function resolvePlacement(base: Placement, override?: Placement): Placement {
  const resolved = {} as Record<PositionName, PlacementEntry[]>;

  for (const name of ROUTE_POSITIONS) {
    if (override && hasOwn(override, name)) {
      resolved[name] = override[name] ?? [];
    } else {
      resolved[name] = base[name] ?? [];
    }
  }

  if (override) {
    for (const [name, entries] of Object.entries(override)) {
      if (!ROUTE_SET.has(name)) {
        resolved[name as PositionName] = entries ?? [];
      }
    }
  }

  return resolved;
}

export function assertPlacement(
  placement: Placement,
  region: PlacementRegion,
  allowed: AllowedPositions,
) {
  const errors = validatePlacement(placement, region, allowed);
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
