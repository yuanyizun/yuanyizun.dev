import assert from "node:assert/strict";
import test from "node:test";
import {
  assertPermission,
  hasPermission,
  parsePermissionCatalog,
  parseRolePermissions,
  PermissionError,
  permissionsForActor,
  permissionCatalog,
  roleGrants,
} from "@/authorization/permissions";

const catalog = parsePermissionCatalog({
  permissions: ["basic", "user_view", "user_delete"],
});

test("the live catalog grants admin every permission and members basic only", () => {
  assert.equal(permissionCatalog.has("basic"), true);
  assert.equal(permissionCatalog.has("user_delete"), true);
  assert.equal(roleGrants.get("admin"), "*");
  assert.deepEqual(roleGrants.get("member"), []);

  assert.equal(permissionsForActor(null).size, 0);

  assert.deepEqual([...permissionsForActor({ roleKey: "member" })].sort(), [
    "basic",
  ]);

  const admin = permissionsForActor({ roleKey: "admin" });
  assert.equal(admin.has("basic"), true);
  assert.equal(admin.has("user_view"), true);
  assert.equal(admin.has("user_delete"), true);
  assert.equal(admin.has("user_update_role"), true);
  assert.equal(admin.has("role_view"), true);
  assert.equal(admin.has("role_create"), true);
  assert.equal(admin.size, permissionCatalog.size);
});

test("an unknown role key receives basic only", () => {
  assert.deepEqual([...permissionsForActor({ roleKey: "editor" })].sort(), [
    "basic",
  ]);
});

test("hasPermission throws on unknown ids and denies missing actors", () => {
  assert.throws(() =>
    hasPermission("not_a_permission", { roleKey: "admin" }),
  );
  assert.equal(hasPermission("user_delete", { roleKey: "member" }), false);
  assert.equal(hasPermission("user_delete", null), false);
  assert.equal(hasPermission("basic", { roleKey: "member" }), true);
  assert.equal(hasPermission("user_delete", { roleKey: "admin" }), true);
});

test("parse rejects duplicate ids, unknown grants, empty role keys, and star in an array", () => {
  assert.throws(() =>
    parsePermissionCatalog({
      permissions: ["basic", "user_view", "user_view"],
    }),
  );
  assert.throws(() =>
    parsePermissionCatalog({
      permissions: ["basic", "*"],
    }),
  );
  assert.throws(() => parsePermissionCatalog({ permissions: [] }));
  assert.throws(() => parsePermissionCatalog(null));

  assert.throws(() =>
    parseRolePermissions(
      { roles: { editor: ["missing"] } },
      catalog,
    ),
  );
  assert.throws(() =>
    parseRolePermissions(
      { roles: { "": [] } },
      catalog,
    ),
  );
  assert.throws(() =>
    parseRolePermissions(
      { roles: { editor: ["user_view", "*"] } },
      catalog,
    ),
  );
  assert.throws(() =>
    parseRolePermissions(
      { roles: { editor: "all" } },
      catalog,
    ),
  );
  assert.throws(() => parseRolePermissions({ roles: [] }, catalog));
});

test("assertPermission denies anonymous callers and members, and allows admin", () => {
  assert.throws(
    () => assertPermission("user_delete", null),
    (error: unknown) =>
      error instanceof PermissionError && error.code === "unauthenticated",
  );
  assert.throws(
    () => assertPermission("user_delete", { roleKey: "member" }),
    (error: unknown) =>
      error instanceof PermissionError && error.code === "forbidden",
  );
  assert.doesNotThrow(() =>
    assertPermission("user_delete", { roleKey: "admin" }),
  );
});
