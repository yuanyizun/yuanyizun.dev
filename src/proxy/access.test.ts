import assert from "node:assert/strict";
import test from "node:test";
import {
  authorizationFor,
  isAuthorized,
  isLoginAllowed,
  parseAccess,
  pathMatches,
  pathnameRequiresLogin,
  routeAccess,
  type RouteAccess,
} from "./access";

const access: RouteAccess = {
  loginPath: "/login",
  denyPath: "/",
  requireLogin: [{ path: "/dashboard", match: "prefix" }],
  authorize: [
    { path: "/dashboard", match: "prefix", roles: ["member", "admin"] },
    { path: "/dashboard/admin", match: "prefix", roles: ["admin"] },
  ],
};

test("prefix rules include the path and its children only", () => {
  const rule = { path: "/dashboard", match: "prefix" as const };

  assert.equal(pathMatches("/dashboard", rule), true);
  assert.equal(pathMatches("/dashboard/settings", rule), true);
  assert.equal(pathMatches("/dashboard-archive", rule), false);
  assert.equal(pathMatches("/about", rule), false);
});

test("exact rules ignore children", () => {
  const rule = { path: "/dashboard", match: "exact" as const };

  assert.equal(pathMatches("/dashboard", rule), true);
  assert.equal(pathMatches("/dashboard/settings", rule), false);
});

test("the live config blocks the dashboard and leaves public pages open", () => {
  assert.equal(pathnameRequiresLogin("/dashboard"), true);
  assert.equal(pathnameRequiresLogin("/dashboard/settings"), true);
  assert.equal(pathnameRequiresLogin("/about"), false);
  assert.equal(pathnameRequiresLogin("/login"), false);
  assert.equal(isLoginAllowed("/dashboard", null), false);
  assert.equal(isLoginAllowed("/dashboard", { sub: "user" }), true);
  assert.equal(isLoginAllowed("/about", null), true);
  assert.equal(authorizationFor("/dashboard", routeAccess), null);
});

test("the longest authorize rule wins", () => {
  assert.deepEqual(authorizationFor("/dashboard", access)?.roles, [
    "member",
    "admin",
  ]);
  assert.deepEqual(authorizationFor("/dashboard/admin/roles", access)?.roles, [
    "admin",
  ]);
  assert.equal(isAuthorized("/dashboard", { role: "member" }, access), true);
  assert.equal(
    isAuthorized("/dashboard/admin", { role: "member" }, access),
    false,
  );
  assert.equal(isAuthorized("/dashboard/admin", { role: "admin" }, access), true);
  assert.equal(isAuthorized("/about", null, access), true);
});

test("login and deny paths cannot require a session", () => {
  assert.throws(() =>
    parseAccess({
      loginPath: "/login",
      denyPath: "/",
      requireLogin: [{ path: "/login", match: "exact" }],
      authorize: [],
    }),
  );
});

test("an authorize rule needs at least one role", () => {
  assert.throws(() =>
    parseAccess({
      loginPath: "/login",
      denyPath: "/",
      requireLogin: [],
      authorize: [{ path: "/admin", match: "prefix", roles: [] }],
    }),
  );
});
