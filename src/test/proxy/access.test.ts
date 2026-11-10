import assert from "node:assert/strict";
import test from "node:test";
import {
  isLoginAllowed,
  parseAccess,
  pathMatches,
  pathnameRequiresLogin,
} from "@/proxy/support/access";

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
  assert.equal(isLoginAllowed("/dashboard", false), false);
  assert.equal(isLoginAllowed("/dashboard", true), true);
  assert.equal(isLoginAllowed("/about", false), true);
});

test("login path cannot require a session", () => {
  assert.throws(() =>
    parseAccess({
      loginPath: "/login",
      requireLogin: [{ path: "/login", match: "exact" }],
    }),
  );
});
