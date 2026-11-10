import assert from "node:assert/strict";
import test from "node:test";
import { reconcileProfileCache } from "./reconcile-session";

const cache = {
  sub: "user-1",
  username: "alice",
  role: "member",
};

test("signed_out clears even when a cache cookie exists", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "signed_out" },
      cache,
      stale: false,
    }),
    "clear",
  );
});

test("unavailable keeps the previous cache as a transient soften", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "unavailable" },
      cache,
      stale: true,
    }),
    "keep",
  );
});

test("verified with a fresh matching cache keeps", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "verified", sub: "user-1" },
      cache,
      stale: false,
    }),
    "keep",
  );
});

test("verified with no cache reloads", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "verified", sub: "user-1" },
      cache: null,
      stale: true,
    }),
    "reload",
  );
});

test("verified with a subject mismatch reloads", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "verified", sub: "user-2" },
      cache,
      stale: false,
    }),
    "reload",
  );
});

test("verified with a missing role reloads", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "verified", sub: "user-1" },
      cache: { ...cache, role: "" },
      stale: false,
    }),
    "reload",
  );
});

test("verified with stale iat reloads", () => {
  assert.equal(
    reconcileProfileCache({
      auth: { status: "verified", sub: "user-1" },
      cache,
      stale: true,
    }),
    "reload",
  );
});
