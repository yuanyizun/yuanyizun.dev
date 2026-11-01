import {
  POSITION_NAMES,
  type Placement,
  type PositionName,
  validatePlacement,
} from "./contracts";

function hasOwn(record: object, key: string) {
  return Object.prototype.hasOwnProperty.call(record, key);
}

export function resolvePlacement(
  base: Placement,
  override?: Placement,
): Placement {
  const resolved = {} as Record<PositionName, NonNullable<Placement[PositionName]>>;

  for (const name of POSITION_NAMES) {
    if (override && hasOwn(override, name)) {
      resolved[name] = override[name] ?? [];
    } else {
      resolved[name] = base[name] ?? [];
    }
  }

  return resolved;
}

export function assertPlacement(placement: Placement) {
  const errors = validatePlacement(placement);
  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
}
