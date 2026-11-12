import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";

describe("interview passcode token", () => {
  it("is stable for a given passcode", () => {
    const code = "yuanyizun";
    const a = createHmac("sha256", code).update("interview-unlocked").digest("hex");
    const b = createHmac("sha256", code).update("interview-unlocked").digest("hex");
    assert.equal(a, b);
    assert.notEqual(
      a,
      createHmac("sha256", "other").update("interview-unlocked").digest("hex"),
    );
  });
});
