import assert from "node:assert/strict";
import test from "node:test";
import { highlightFences } from "./highlight.ts";

test("a fenced block is coloured on the server", async () => {
  const [html] = await highlightFences("```ts\nconst answer = 1\n```\n");
  assert.equal(typeof html, "string");
  assert.match(html ?? "", /<pre/);
  assert.match(html ?? "", /const/);
  assert.match(html ?? "", /answer/);
});
