import accessJson from "@/configs/proxy.json" with { type: "json" };

export type PathMatch = "exact" | "prefix";

export type PathRule = {
  path: string;
  match: PathMatch;
};

export type RouteAccess = {
  loginPath: string;
  requireLogin: readonly PathRule[];
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

export function parseAccess(input: unknown): RouteAccess {
  if (!isRecord(input)) {
    throw new Error("Route access config must be an object.");
  }

  const { loginPath, requireLogin } = input;
  if (typeof loginPath !== "string" || !isPathname(loginPath)) {
    throw new Error("loginPath must be an absolute pathname.");
  }
  if (!Array.isArray(requireLogin)) {
    throw new Error("requireLogin must be an array.");
  }

  const access: RouteAccess = {
    loginPath,
    requireLogin: requireLogin.map((rule, index) =>
      parsePathRule(rule, `requireLogin[${index}]`),
    ),
  };

  if (pathnameRequiresLogin(loginPath, access)) {
    throw new Error("loginPath must stay reachable without a session.");
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
  loggedIn: boolean,
  access: RouteAccess = routeAccess,
): boolean {
  if (!pathnameRequiresLogin(pathname, access)) {
    return true;
  }
  return loggedIn;
}

export const routeAccess = parseAccess(accessJson);
