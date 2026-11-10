import assert from "node:assert/strict";
import test from "node:test";
import { sessionAfterUserCheck } from "./update-session";

const verified = { status: "verified" as const, sub: "user-1" };

test("a verified user who still exists keeps the session", () => {
  const decision = sessionAfterUserCheck(verified, {
    user: { id: "user-1" },
    error: null,
  });

  assert.equal(decision.clearSession, false);
  assert.deepEqual(decision.auth, verified);
});

test("a deleted account clears the session", () => {
  const decision = sessionAfterUserCheck(verified, {
    user: null,
    error: { name: "AuthApiError" },
  });

  assert.equal(decision.clearSession, true);
  assert.deepEqual(decision.auth, { status: "signed_out" });
});

test("a missing session clears the session", () => {
  const decision = sessionAfterUserCheck(verified, {
    user: null,
    error: { name: "AuthSessionMissingError" },
  });

  assert.equal(decision.clearSession, true);
  assert.equal(decision.auth.status, "signed_out");
});

test("an auth outage keeps a verified session", () => {
  const decision = sessionAfterUserCheck(verified, {
    user: null,
    error: { name: "AuthRetryableFetchError" },
  });

  assert.equal(decision.clearSession, false);
  assert.deepEqual(decision.auth, verified);
});

test("a signed-out request is left alone", () => {
  const signedOut = { status: "signed_out" as const };
  const decision = sessionAfterUserCheck(signedOut, {
    user: null,
    error: { name: "AuthSessionMissingError" },
  });

  assert.equal(decision.clearSession, false);
  assert.equal(decision.auth, signedOut);
});
