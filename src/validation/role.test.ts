import assert from "node:assert/strict";
import test from "node:test";
import {
  ROLE_DESCRIPTION_MAX,
  ROLE_NAME_HINT,
  ROLE_NAME_MAX,
  parseCreateRole,
  parseRoleKey,
  slugifyRoleKey,
} from "@/validation/role";

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

test("an empty role name returns only the required message", () => {
  const parsed = parseCreateRole(form({ name: "   ", description: "" }));
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.deepEqual(parsed.state.errors, { name: "Name is required." });
});

test("a readable role name slugifies and an empty description is null", () => {
  const parsed = parseCreateRole(form({ name: "  A 1  ", description: "   " }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.deepEqual(parsed.value, {
    key: "a-1",
    label: "A 1",
    description: null,
  });
});

test("role name and description limits use the field messages", () => {
  const longName = parseCreateRole(
    form({ name: "a".repeat(ROLE_NAME_MAX + 1), description: "" }),
  );
  assert.equal(longName.ok, false);
  if (!longName.ok) {
    assert.equal(
      longName.state.errors?.name,
      `Name must be at most ${ROLE_NAME_MAX} characters.`,
    );
  }

  const badName = parseCreateRole(form({ name: "---", description: "" }));
  assert.equal(badName.ok, false);
  if (!badName.ok) assert.equal(badName.state.errors?.name, ROLE_NAME_HINT);

  const longDescription = parseCreateRole(
    form({ name: "Editor", description: "a".repeat(ROLE_DESCRIPTION_MAX + 1) }),
  );
  assert.equal(longDescription.ok, false);
  if (!longDescription.ok) {
    assert.equal(
      longDescription.state.errors?.description,
      `Description must be at most ${ROLE_DESCRIPTION_MAX} characters.`,
    );
  }
});

test("a pattern-valid name still slugifies to a key", () => {
  assert.equal(slugifyRoleKey("---"), "");
  assert.equal(slugifyRoleKey("A 1"), "a-1");
});

test("role keys are lowercase slugs", () => {
  assert.equal(parseRoleKey(" Member "), "member");
  assert.equal(parseRoleKey("Role-Key"), "role-key");
  assert.equal(parseRoleKey(""), null);
  assert.equal(parseRoleKey("   "), null);
  assert.equal(parseRoleKey("-member"), null);
  assert.equal(parseRoleKey("a".repeat(65)), null);
  assert.equal(parseRoleKey(12), null);
});
