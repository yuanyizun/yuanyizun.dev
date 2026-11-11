import assert from "node:assert/strict";
import test from "node:test";
import { parseUserId } from "@/validation/user";

test("user ids are lowercase UUIDs", () => {
  assert.equal(
    parseUserId("550E8400-E29B-41D4-A716-446655440000 "),
    "550e8400-e29b-41d4-a716-446655440000",
  );
  assert.equal(parseUserId("not-a-uuid"), null);
  assert.equal(parseUserId(550), null);
  assert.equal(parseUserId(""), null);
});
