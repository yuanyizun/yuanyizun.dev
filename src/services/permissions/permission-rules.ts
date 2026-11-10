import permissionsJson from "@/configs/permissions.json" with { type: "json" };
import rolePermissionsJson from "@/configs/role-permissions.json" with { type: "json" };

const BASIC_PERMISSION = "basic";

export type PermissionActor = {
  roleKey: string;
};

export type RoleGrant = "*" | readonly string[];

type RouteContext = {
  params: Promise<Record<string, string | string[] | undefined>>;
};

type RouteHandler = (
  request: Request,
  context: RouteContext,
) => Promise<Response> | Response;

type ActorLoader = () => Promise<PermissionActor | null>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parsePermissionId(value: unknown, label: string): string {
  if (typeof value !== "string" || !value.trim() || value !== value.trim()) {
    throw new Error(`${label} must be a non-empty permission id.`);
  }
  if (value === "*") {
    throw new Error(`${label} cannot be "*".`);
  }
  return value;
}

export function parsePermissionCatalog(input: unknown): ReadonlySet<string> {
  if (!isRecord(input)) {
    throw new Error("Permission catalog must be an object.");
  }

  const { permissions } = input;
  if (!Array.isArray(permissions) || permissions.length === 0) {
    throw new Error("permissions must be a non-empty array.");
  }

  const catalog = new Set<string>();
  permissions.forEach((entry, index) => {
    const id = parsePermissionId(entry, `permissions[${index}]`);
    if (catalog.has(id)) {
      throw new Error(`Duplicate permission: ${id}`);
    }
    catalog.add(id);
  });

  if (!catalog.has(BASIC_PERMISSION)) {
    throw new Error('Permission catalog must include "basic".');
  }

  return catalog;
}

export function parseRolePermissions(
  input: unknown,
  catalog: ReadonlySet<string>,
): ReadonlyMap<string, RoleGrant> {
  if (!isRecord(input)) {
    throw new Error("Role permissions must be an object.");
  }

  const { roles } = input;
  if (!isRecord(roles)) {
    throw new Error("roles must be an object.");
  }

  const grants = new Map<string, RoleGrant>();
  for (const [roleKey, grant] of Object.entries(roles)) {
    if (!roleKey.trim() || roleKey !== roleKey.trim()) {
      throw new Error("Role keys must be non-empty strings.");
    }

    if (grant === "*") {
      grants.set(roleKey, "*");
      continue;
    }

    if (!Array.isArray(grant)) {
      throw new Error(`${roleKey} grant must be "*" or an array of permission ids.`);
    }

    const ids: string[] = [];
    const seen = new Set<string>();
    grant.forEach((entry, index) => {
      if (entry === "*") {
        throw new Error(`${roleKey}[${index}] cannot be "*". Use "*" as the whole grant.`);
      }
      const id = parsePermissionId(entry, `${roleKey}[${index}]`);
      if (!catalog.has(id)) {
        throw new Error(`${roleKey} grants unknown permission: ${id}`);
      }
      if (seen.has(id)) {
        throw new Error(`${roleKey} lists ${id} more than once.`);
      }
      seen.add(id);
      ids.push(id);
    });
    grants.set(roleKey, ids);
  }

  return grants;
}

export const permissionCatalog = parsePermissionCatalog(permissionsJson);
export const roleGrants = parseRolePermissions(
  rolePermissionsJson,
  permissionCatalog,
);

export function permissionsForRole(
  roleKey: string | null | undefined,
  catalog: ReadonlySet<string> = permissionCatalog,
  grants: ReadonlyMap<string, RoleGrant> = roleGrants,
): ReadonlySet<string> {
  if (!roleKey) {
    return new Set();
  }

  const resolved = new Set<string>([BASIC_PERMISSION]);
  const grant = grants.get(roleKey);
  if (grant === "*") {
    for (const id of catalog) {
      resolved.add(id);
    }
    return resolved;
  }

  if (grant) {
    for (const id of grant) {
      resolved.add(id);
    }
  }

  return resolved;
}

export function permissionsForActor(
  actor: PermissionActor | null,
  catalog: ReadonlySet<string> = permissionCatalog,
  grants: ReadonlyMap<string, RoleGrant> = roleGrants,
): ReadonlySet<string> {
  if (!actor) {
    return new Set();
  }
  return permissionsForRole(actor.roleKey, catalog, grants);
}

export function hasPermission(
  permission: string,
  actor: PermissionActor | null,
  catalog: ReadonlySet<string> = permissionCatalog,
  grants: ReadonlyMap<string, RoleGrant> = roleGrants,
): boolean {
  if (!catalog.has(permission)) {
    throw new Error(`Unknown permission: ${permission}`);
  }
  return permissionsForActor(actor, catalog, grants).has(permission);
}

export class PermissionError extends Error {
  readonly code: "unauthenticated" | "forbidden";

  constructor(code: "unauthenticated" | "forbidden") {
    super(code === "unauthenticated" ? "Sign in required." : "Forbidden.");
    this.name = "PermissionError";
    this.code = code;
  }
}

export function assertPermission(
  permission: string,
  actor: PermissionActor | null,
): void {
  if (!permissionCatalog.has(permission)) {
    throw new Error(`Unknown permission: ${permission}`);
  }
  if (!actor) {
    throw new PermissionError("unauthenticated");
  }
  if (!hasPermission(permission, actor)) {
    throw new PermissionError("forbidden");
  }
}

function permissionDeniedResponse(error: PermissionError): Response {
  const status = error.code === "unauthenticated" ? 401 : 403;
  return Response.json({ error: error.message }, { status });
}

/**
 * Route-handler gate. The third argument overrides the actor lookup in tests.
 * Production callers omit it and use the database user.
 */
export function withPermission(
  permission: string,
  handler: RouteHandler,
  loadActor?: ActorLoader,
): RouteHandler {
  return async (request, context) => {
    const actor = loadActor
      ? await loadActor()
      : await import("@/data/users").then((users) => users.getCurrentUser());

    try {
      assertPermission(permission, actor);
    } catch (error) {
      if (error instanceof PermissionError) {
        return permissionDeniedResponse(error);
      }
      throw error;
    }

    return handler(request, context);
  };
}
