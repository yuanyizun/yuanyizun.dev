import assert from "node:assert/strict";
import test from "node:test";
import { parseQuestionFile, sortAndValidateNotes } from "./questions.ts";
import {
  findPublicNote,
  toPublicNote,
  toPublicNotes,
} from "./questions-public.ts";

function sampleNote(order: number, slug: string) {
  const note = parseQuestionFile(
    `---
title: Sample ${order}
order: ${order}
label: Label ${order}
---

## Question

Sample ${order}

## Answer

Lead paragraph.

### Action

Do the work.

### Result

It worked.
`,
    slug,
  );
  assert.ok(note);
  return note;
}

test("toPublicNote omits searchText and draft", () => {
  const note = sampleNote(1, "one");
  const publicNote = toPublicNote(note);
  assert.equal(publicNote.slug, "one");
  assert.equal(publicNote.title, "Sample 1");
  assert.equal(publicNote.label, "Label 1");
  assert.equal(publicNote.order, 1);
  assert.equal(publicNote.question, "Sample 1");
  assert.equal(publicNote.lead, "Lead paragraph.");
  assert.equal(publicNote.intro, null);
  assert.equal(publicNote.blocks.length, 2);
  assert.equal("searchText" in publicNote, false);
  assert.equal("draft" in publicNote, false);
});

test("toPublicNotes keeps sort order", () => {
  const notes = sortAndValidateNotes([sampleNote(2, "two"), sampleNote(1, "one")]);
  const publicNotes = toPublicNotes(notes);
  assert.deepEqual(
    publicNotes.map((note) => note.slug),
    ["one", "two"],
  );
});

test("findPublicNote returns a miss for an unknown slug", () => {
  const notes = sortAndValidateNotes([sampleNote(1, "one")]);
  assert.equal(findPublicNote(notes, "missing"), null);
  assert.equal(findPublicNote(notes, "one")?.slug, "one");
});
