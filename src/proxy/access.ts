import accessJson from "./access.json" with { type: "json" };

export type PathMatch = "exact" | "prefix";

export type PathRule = {
  path: string;
  match: PathMatch;
};

export type AuthorizeRule = PathRule & {
  roles: readonly string[];
};

export type RouteAccess = {
  loginPath: string;
  denyPath: string;
  requireLogin: readonly PathRule[];
  authorize: readonly AuthorizeRule[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPathname(path: string): boolean {
  return (
    path.startsWith("/") &&
    !path.includes("?") &&
    !path.includes("#") &&
    !path.includes(" ") &&
    (path === "/" || !path.endsWith("/"))
  );
}

function parsePathRule(value: unknown, label: string): PathRule {
  if (!isRecord(value)) {
    throw new Error(`${label} must be an object with "path" and "match".`);
  }

  const { path, match } = value;
  if (typeof path !== "string" || !isPathname(path)) {
    throw new Error(`${label} path must be an absolute pathname.`);
  }
  if (match !== "exact" && match !== "prefix") {
    throw new Error(`${label} match must be "exact" or "prefix".`);
  }

  return { path, match };
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

function parseAuthorizeRule(value: unknown, label: string): AuthorizeRule {
  const rule = parsePathRule(value, label);
  const roles = parseRoles(
    isRecord(value) ? value.roles : undefined,
    label,
  );
  return { ...rule, roles };
}

export function parseAccess(input: unknown): RouteAccess {
  if (!isRecord(input)) {
    throw new Error("Route access config must be an object.");
  }

  const { loginPath, denyPath, requireLogin, authorize } = input;
  if (typeof loginPath !== "string" || !isPathname(loginPath)) {
    throw new Error("loginPath must be an absolute pathname.");
  }
  if (typeof denyPath !== "string" || !isPathname(denyPath)) {
    throw new Error("denyPath must be an absolute pathname.");
  }
  if (!Array.isArray(requireLogin)) {
    throw new Error("requireLogin must be an array.");
  }
  if (!Array.isArray(authorize)) {
    throw new Error("authorize must be an array.");
  }

  const access: RouteAccess = {
    loginPath,
    denyPath,
    requireLogin: requireLogin.map((rule, index) =>
      parsePathRule(rule, `requireLogin[${index}]`),
    ),
    authorize: authorize.map((rule, index) =>
      parseAuthorizeRule(rule, `authorize[${index}]`),
    ),
  };

  if (pathnameRequiresLogin(loginPath, access) || pathnameRequiresLogin(denyPath, access)) {
    throw new Error("loginPath and denyPath must stay reachable without a session.");
  }
  if (authorizationFor(loginPath, access)) {
    throw new Error("loginPath must not be role-gated.");
  }

  return access;
}

export function pathMatches(pathname: string, rule: PathRule): boolean {
  if (rule.match === "exact") {
    return pathname === rule.path;
  }
  if (rule.path === "/") {
    return true;
  }
  return pathname === rule.path || pathname.startsWith(`${rule.path}/`);
}

export function pathnameRequiresLogin(
  pathname: string,
  access: RouteAccess = routeAccess,
): boolean {
  return access.requireLogin.some((rule) => pathMatches(pathname, rule));
}

export function isLoginAllowed(
  pathname: string,
  session: { sub: string } | null,
  access: RouteAccess = routeAccess,
): boolean {
  if (!pathnameRequiresLogin(pathname, access)) {
    return true;
  }
  return session !== null;
}

export function authorizationFor(
  pathname: string,
  access: RouteAccess = routeAccess,
): AuthorizeRule | null {
  let match: AuthorizeRule | null = null;
  for (const rule of access.authorize) {
    if (!pathMatches(pathname, rule)) {
      continue;
    }
    if (!match || rule.path.length > match.path.length) {
      match = rule;
    }
  }
  return match;
}

export function isAuthorized(
  pathname: string,
  session: { role?: string } | null,
  access: RouteAccess = routeAccess,
): boolean {
  const rule = authorizationFor(pathname, access);
  if (!rule) {
    return true;
  }
  return Boolean(session?.role && rule.roles.includes(session.role));
}

export const routeAccess = parseAccess(accessJson);
