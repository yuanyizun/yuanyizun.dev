import assert from "node:assert/strict";
import test from "node:test";
import {
  hasPermission,
  parsePermissionCatalog,
  parseRolePermissions,
  permissionsForActor,
  permissionCatalog,
  roleGrants,
  withPermission,
} from "@/services/permissions/permission-rules";

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

test("withPermission returns 401, 403, then the handler", async () => {
  const context = { params: Promise.resolve({}) };
  const request = new Request("http://localhost/api/example");
  const handler = async () => Response.json({ ok: true });

  const anonymous = await withPermission("user_delete", handler, async () => null)(
    request,
    context,
  );
  assert.equal(anonymous.status, 401);

  const member = await withPermission(
    "user_delete",
    handler,
    async () => ({ roleKey: "member" }),
  )(request, context);
  assert.equal(member.status, 403);

  const admin = await withPermission(
    "user_delete",
    handler,
    async () => ({ roleKey: "admin" }),
  )(request, context);
  assert.equal(admin.status, 200);
  assert.deepEqual(await admin.json(), { ok: true });
});
