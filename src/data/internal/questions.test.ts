import assert from "node:assert/strict";
import test from "node:test";
import { parseQuestionFile, sortAndValidateNotes } from "./questions.ts";

function file(body: string, overrides?: { title?: string; order?: number; draft?: boolean }) {
  const title = overrides?.title ?? "Sample question";
  const order = overrides?.order ?? 1;
  const draft = overrides?.draft ? "\ndraft: true" : "";
  return `---
title: ${title}
order: ${order}${draft}
---

${body}
`;
}

test("missing Question throws", () => {
  assert.throws(
    () =>
      parseQuestionFile(
        file(`## Answer

An answer.`),
        "note",
      ),
    /note\.md must start with "## Question"/,
  );
});

test("missing Answer throws", () => {
  assert.throws(
    () =>
      parseQuestionFile(
        file(`## Question

Sample question`),
        "note",
      ),
    /note\.md is missing "## Answer"/,
  );
});

test("Question text that differs from title throws", () => {
  assert.throws(
    () =>
      parseQuestionFile(
        file(`## Question

Different text

## Answer

An answer.`),
        "note",
      ),
    /Question text must match title/,
  );
});

test("draft: true is absent", () => {
  const note = parseQuestionFile(
    file(
      `## Question

Sample question

## Answer

An answer.`,
      { draft: true },
    ),
    "draft-note",
  );
  assert.equal(note, null);
});

test("files sort by order", () => {
  const second = parseQuestionFile(
    file(
      `## Question

Sample question

## Answer

Second.`,
      { order: 2 },
    ),
    "second",
  );
  const first = parseQuestionFile(
    file(
      `## Question

Sample question

## Answer

First.`,
      { order: 1 },
    ),
    "first",
  );
  assert.ok(first);
  assert.ok(second);
  const sorted = sortAndValidateNotes([second, first]);
  assert.deepEqual(
    sorted.map((note) => note.slug),
    ["first", "second"],
  );
});

test("duplicate order throws", () => {
  const left = parseQuestionFile(
    file(
      `## Question

Sample question

## Answer

Left.`,
      { order: 1 },
    ),
    "left",
  );
  const right = parseQuestionFile(
    file(
      `## Question

Sample question

## Answer

Right.`,
      { order: 1 },
    ),
    "right",
  );
  assert.ok(left);
  assert.ok(right);
  assert.throws(() => sortAndValidateNotes([left, right]), /Duplicate question order: 1/);
});

test("a leading paragraph becomes lead", () => {
  const note = parseQuestionFile(
    file(`## Question

Sample question

## Answer

This is the lead paragraph.

More intro text.

### Action

- do the work

### Result

It worked.`),
    "lead-note",
  );
  assert.ok(note);
  assert.equal(note.lead, "This is the lead paragraph.");
  assert.equal(note.intro, "More intro text.");
  assert.equal(note.blocks.length, 2);
  assert.equal(note.blocks[0]?.kind, "kicker");
  assert.equal(note.blocks[0]?.heading, "Action");
  assert.equal(note.blocks[1]?.kind, "result");
  assert.equal(note.blocks[1]?.heading, "Result");
});

test("a list-first answer has no lead", () => {
  const note = parseQuestionFile(
    file(`## Question

Sample question

## Answer

1. First ask
2. Second ask`),
    "ask-note",
  );
  assert.ok(note);
  assert.equal(note.lead, null);
  assert.equal(note.intro, "1. First ask\n2. Second ask");
  assert.deepEqual(note.blocks, []);
});
