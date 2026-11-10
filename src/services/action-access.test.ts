import assert from "node:assert/strict";
import test from "node:test";
import {
  actionAccess,
  actionAuthorizationFor,
  isActionAuthorized,
  parseActionAccess,
  type ActionAccess,
} from "./action-access";

const access: ActionAccess = {
  authorize: [
    { action: "createRole", roles: ["admin"] },
    { action: "viewRegisteredUsers", roles: ["admin", "member"] },
  ],
};

test("the live config gates the five privileged dashboard actions to admin", () => {
  assert.deepEqual(actionAuthorizationFor("viewRegisteredUsers", actionAccess)?.roles, [
    "admin",
  ]);
  assert.deepEqual(actionAuthorizationFor("manageRoles", actionAccess)?.roles, [
    "admin",
  ]);
  assert.deepEqual(actionAuthorizationFor("createRole", actionAccess)?.roles, [
    "admin",
  ]);
  assert.deepEqual(
    actionAuthorizationFor("deleteRegisteredUser", actionAccess)?.roles,
    ["admin"],
  );
  assert.deepEqual(
    actionAuthorizationFor("updateRegisteredUserRole", actionAccess)?.roles,
    ["admin"],
  );
  assert.equal(isActionAuthorized("createRole", { roleKey: "admin" }), true);
  assert.equal(isActionAuthorized("createRole", { roleKey: "member" }), false);
});

test("unlisted actions stay open at the JSON layer", () => {
  assert.equal(actionAuthorizationFor("updateProfile", access), null);
  assert.equal(isActionAuthorized("updateProfile", { roleKey: "member" }, access), true);
  assert.equal(isActionAuthorized("updateProfile", null, access), true);
});

test("listed actions fail closed without a matching roleKey", () => {
  assert.equal(isActionAuthorized("createRole", { roleKey: "member" }, access), false);
  assert.equal(isActionAuthorized("createRole", { roleKey: "admin" }, access), true);
  assert.equal(isActionAuthorized("createRole", { roleKey: null }, access), false);
  assert.equal(isActionAuthorized("createRole", null, access), false);
  assert.equal(
    isActionAuthorized("viewRegisteredUsers", { roleKey: "member" }, access),
    true,
  );
});

test("parse rejects empty roles, blank action, and duplicates", () => {
  assert.throws(() =>
    parseActionAccess({
      authorize: [{ action: "createRole", roles: [] }],
    }),
  );
  assert.throws(() =>
    parseActionAccess({
      authorize: [{ action: "", roles: ["admin"] }],
    }),
  );
  assert.throws(() =>
    parseActionAccess({
      authorize: [
        { action: "createRole", roles: ["admin"] },
        { action: "createRole", roles: ["member"] },
      ],
    }),
  );
  assert.throws(() => parseActionAccess({ authorize: "nope" }));
  assert.throws(() => parseActionAccess(null));
});
