import assert from "node:assert/strict";
import test from "node:test";
import { extractHeadings, showContents } from "./headings.ts";

const markdown = `
## Real heading

\`\`\`ts
## Not a heading
const value = 1
\`\`\`

## **Bold** and \`code\` and [a link](https://example.com)

## Real heading
`;

test("a heading inside a fence is ignored", () => {
  const titles = extractHeadings(markdown).map((heading) => heading.title);
  assert.equal(titles.includes("Not a heading"), false);
  assert.deepEqual(titles, [
    "Real heading",
    "Bold and code and a link",
    "Real heading",
  ]);
});

test("inline marks are stripped before slugifying", () => {
  const headings = extractHeadings(markdown);
  assert.equal(headings[1]?.id, "bold-and-code-and-a-link");
  assert.equal(headings[1]?.title, "Bold and code and a link");
});

test("two identical headings get distinct ids", () => {
  const headings = extractHeadings(markdown);
  assert.equal(headings[0]?.id, "real-heading");
  assert.equal(headings[2]?.id, "real-heading-2");
});

test("fewer than two headings does not show a contents list", () => {
  assert.equal(showContents(extractHeadings("## Only one")), false);
  assert.equal(showContents(extractHeadings(markdown)), true);
});
