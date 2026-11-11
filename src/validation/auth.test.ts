import assert from "node:assert/strict";
import test from "node:test";
import {
  PASSWORD_MIN,
  USERNAME_HINT,
  parseLogin,
  parseRegister,
  parseUpdateProfile,
  parseUsername,
} from "@/validation/auth";

function form(entries: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    data.set(key, value);
  }
  return data;
}

test("empty auth fields return only the required message", () => {
  const parsed = parseRegister(form({ username: "  ", email: "", password: "" }));
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.deepEqual(parsed.state.errors, {
    username: "Username is required.",
    email: "Email is required.",
    password: "Password is required.",
  });
  assert.equal(Object.keys(parsed.state.errors ?? {}).length, 3);
});

test("usernames follow the letter, number, and underscore allowlist", () => {
  for (const username of ["ab", "user_name", "a".repeat(32)]) {
    const parsed = parseUsername(form({ username }));
    assert.equal(parsed.ok, true, username);
    if (parsed.ok) assert.equal(parsed.value.username, username);
  }

  for (const username of ["a", "user-name", "user name", "a".repeat(33)]) {
    const parsed = parseUsername(form({ username }));
    assert.equal(parsed.ok, false, username);
    if (!parsed.ok) assert.equal(parsed.state.errors?.username, USERNAME_HINT);
  }
});

test("username and email are trimmed and password is not", () => {
  const parsed = parseLogin(
    form({ email: "  m@example.com  ", password: "        " }),
  );
  assert.equal(parsed.ok, true);
  if (parsed.ok) {
    assert.equal(parsed.value.email, "m@example.com");
    assert.equal(parsed.value.password, "        ");
    assert.equal(parsed.value.password.length, PASSWORD_MIN);
  }

  const short = parseLogin(form({ email: "m@example.com", password: "       " }));
  assert.equal(short.ok, false);
  if (!short.ok) {
    assert.equal(
      short.state.errors?.password,
      `Password must be at least ${PASSWORD_MIN} characters.`,
    );
  }
});

test("email uses the HTML5 rule", () => {
  for (const email of ["m@example.com", "a@b.c"]) {
    const parsed = parseLogin(form({ email, password: "longenough" }));
    assert.equal(parsed.ok, true, email);
  }

  for (const email of ["a@", "@b.com", "not-an-email"]) {
    const parsed = parseLogin(form({ email, password: "longenough" }));
    assert.equal(parsed.ok, false, email);
    if (!parsed.ok) assert.equal(parsed.state.errors?.email, "Enter a valid email.");
  }
});

test("register reports every invalid field together", () => {
  const parsed = parseRegister(
    form({ username: "a", email: "not-an-email", password: "short" }),
  );
  assert.equal(parsed.ok, false);
  if (parsed.ok) return;
  assert.equal(parsed.state.errors?.username, USERNAME_HINT);
  assert.equal(parsed.state.errors?.email, "Enter a valid email.");
  assert.equal(
    parsed.state.errors?.password,
    `Password must be at least ${PASSWORD_MIN} characters.`,
  );
});

test("profile update reads username and drops other fields", () => {
  const data = form({
    username: "  user_name  ",
    email: "other@example.com",
    role: "admin",
    id: "550e8400-e29b-41d4-a716-446655440000",
  });
  const parsed = parseUpdateProfile(data);
  assert.equal(parsed.ok, true);
  if (parsed.ok) assert.deepEqual(parsed.value, { username: "user_name" });
});
