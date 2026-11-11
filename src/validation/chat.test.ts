import assert from "node:assert/strict";
import test from "node:test";
import { MAX_MESSAGES, MAX_TEXT, parseChatMessages } from "@/validation/chat";

function textMessage(role: string, text: string, id?: string) {
  return {
    id,
    role,
    parts: [{ type: "text", text }],
  };
}

test("a user text message is kept", () => {
  const messages = parseChatMessages({
    messages: [textMessage("user", "Hello", "m1")],
  });
  assert.ok(messages);
  assert.equal(messages.length, 1);
  assert.equal(messages[0]?.id, "m1");
  assert.equal(messages[0]?.role, "user");
  assert.deepEqual(messages[0]?.parts, [{ type: "text", text: "Hello" }]);
});

test("non-text parts and other roles are skipped", () => {
  const messages = parseChatMessages({
    messages: [
      { role: "system", parts: [{ type: "text", text: "ignore" }] },
      {
        role: "user",
        parts: [
          { type: "image", image: "nope" },
          { type: "text", text: "   " },
          { type: "text", text: "Question" },
        ],
      },
    ],
  });
  assert.ok(messages);
  assert.equal(messages.length, 1);
  assert.equal(messages[0]?.role, "user");
  assert.deepEqual(messages[0]?.parts, [{ type: "text", text: "Question" }]);
  assert.equal(typeof messages[0]?.id, "string");
  assert.ok(messages[0]?.id);
});

test("the envelope and the last user message are required", () => {
  assert.equal(parseChatMessages(null), null);
  assert.equal(parseChatMessages({ messages: [] }), null);
  assert.equal(
    parseChatMessages({
      messages: Array.from({ length: MAX_MESSAGES + 1 }, () =>
        textMessage("user", "Hi"),
      ),
    }),
    null,
  );
  assert.equal(
    parseChatMessages({
      messages: [textMessage("user", "a".repeat(MAX_TEXT + 1))],
    }),
    null,
  );
  assert.equal(
    parseChatMessages({
      messages: [textMessage("user", "Hi"), textMessage("assistant", "Answer")],
    }),
    null,
  );
});
