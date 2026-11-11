import assert from "node:assert/strict";
import test from "node:test";
import { access } from "@/authorization/access";
import { canCreateRole } from "@/authorization/roles";
import {
  canDeleteRegisteredUser,
  canUpdateRegisteredUserRole,
} from "@/authorization/users";

const IDS = [
  "user_view",
  "user_delete",
  "user_update_role",
  "role_view",
  "role_create",
] as const;

test("the live catalog has the five ids and not basic", () => {
  assert.equal(access.catalog.size, 5);
  assert.equal(access.catalog.has("basic"), false);
  for (const id of IDS) {
    assert.equal(access.catalog.has(id), true);
  }
});

test("admin has every id; member, an unknown role, and null have none", () => {
  for (const id of IDS) {
    assert.equal(access.has(id, { roleKey: "admin" }), true);
    assert.equal(access.has(id, { roleKey: "member" }), false);
    assert.equal(access.has(id, { roleKey: "editor" }), false);
    assert.equal(access.has(id, null), false);
  }
  assert.equal(access.permissionsFor({ roleKey: "member" }).size, 0);
  assert.equal(access.permissionsFor({ roleKey: "editor" }).size, 0);
  assert.equal(access.permissionsFor(null).size, 0);
});

test("access.has throws on an unknown permission id", () => {
  assert.throws(() => access.has("not_a_permission", { roleKey: "admin" }));
  assert.throws(() => access.has("basic", null));
});

test("delete and role update stay false when the target id is empty", () => {
  const admin = { roleKey: "admin" };
  assert.equal(canDeleteRegisteredUser(admin, { id: "" }), false);
  assert.equal(canUpdateRegisteredUserRole(admin, { id: "" }), false);
  assert.equal(canDeleteRegisteredUser(admin, { id: "user-1" }), true);
  assert.equal(canUpdateRegisteredUserRole(admin, { id: "user-1" }), true);
  assert.equal(
    canDeleteRegisteredUser({ roleKey: "member" }, { id: "user-1" }),
    false,
  );
  assert.equal(
    canUpdateRegisteredUserRole({ roleKey: "member" }, { id: "user-1" }),
    false,
  );
  assert.equal(canCreateRole({ roleKey: "member" }), false);
  assert.equal(canCreateRole({ roleKey: "admin" }), true);
});
