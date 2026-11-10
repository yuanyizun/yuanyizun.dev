import actionAccessJson from "./action-access.json" with { type: "json" };

export type ActionAuthorizeRule = {
  action: string;
  roles: readonly string[];
};

export type ActionAccess = {
  authorize: readonly ActionAuthorizeRule[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseRoles(value: unknown, label: string): readonly string[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${label} roles must be a non-empty array of role keys.`);
  }

  const roles: string[] = [];
  for (const role of value) {
    if (typeof role !== "string" || !role.trim()) {
      throw new Error(`${label} roles must be non-empty strings.`);
    }
    roles.push(role);
  }
  return roles;
}

function parseAuthorizeRule(
  value: unknown,
  label: string,
): ActionAuthorizeRule {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object with "action" and "roles".`);
  }

  const { action, roles } = value;
  if (typeof action !== "string" || !action.trim()) {
    throw new Error(`${label} action must be a non-empty string.`);
  }

  return {
    action,
    roles: parseRoles(roles, label),
  };
}

export function parseActionAccess(input: unknown): ActionAccess {
  if (!isRecord(input)) {
    throw new Error("Action access config must be an object.");
  }

  const { authorize } = input;
  if (!Array.isArray(authorize)) {
    throw new Error("authorize must be an array.");
  }

  const rules = authorize.map((rule, index) =>
    parseAuthorizeRule(rule, `authorize[${index}]`),
  );

  const seen = new Set<string>();
  for (const rule of rules) {
    if (seen.has(rule.action)) {
      throw new Error(`Duplicate action authorization rule: ${rule.action}`);
    }
    seen.add(rule.action);
  }

  return { authorize: rules };
}

export function actionAuthorizationFor(
  action: string,
  access: ActionAccess = actionAccess,
): ActionAuthorizeRule | null {
  return access.authorize.find((rule) => rule.action === action) ?? null;
}

/**
 * JSON role gate for a stable action id.
 * Unlisted actions are open at this layer (auth/validation still apply in the service).
 * Listed actions fail closed when roleKey is missing or not allowlisted.
 * Never authorize from posted FormData role claims — pass trusted session roleKey only.
 */
export function isActionAuthorized(
  action: string,
  actor: { roleKey?: string | null } | null | undefined,
  access: ActionAccess = actionAccess,
): boolean {
  const rule = actionAuthorizationFor(action, access);
  if (!rule) {
    return true;
  }
  return Boolean(actor?.roleKey && rule.roles.includes(actor.roleKey));
}

export const actionAccess = parseActionAccess(actionAccessJson);
