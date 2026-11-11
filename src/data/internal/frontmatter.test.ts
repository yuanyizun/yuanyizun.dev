import assert from "node:assert/strict";
import test from "node:test";
import { isDraft, isListed, parseFrontmatter } from "./frontmatter.ts";

const published = {
  title: "A title",
  summary: "A summary",
  date: "2026-11-02",
};

test("missing title throws", () => {
  assert.throws(
    () => parseFrontmatter({ summary: "A summary", date: "2026-11-02" }, "note"),
    /note\.md is missing frontmatter field "title"/,
  );
});

test("a Date and a YYYY-MM-DD string store the calendar day", () => {
  const fromDate = parseFrontmatter(
    { ...published, date: new Date("2026-11-02T00:00:00.000Z") },
    "note",
  );
  const fromString = parseFrontmatter(published, "note");
  assert.equal(fromDate.date, "2026-11-02");
  assert.equal(fromString.date, "2026-11-02");
});

test("a draft is absent from the single-entry reader and from listings", () => {
  const draft = parseFrontmatter({ ...published, draft: true }, "draft-note");
  assert.equal(isDraft(draft), true);
  assert.equal(isListed(draft), false);
});

test("an archived entry stays routable and stays out of listings", () => {
  const archived = parseFrontmatter({ ...published, archived: true }, "old-note");
  assert.equal(isDraft(archived), false);
  assert.equal(isListed(archived), false);
});

test("a file that is both draft and archived is a draft", () => {
  const both = parseFrontmatter(
    { ...published, draft: true, archived: true },
    "both",
  );
  assert.equal(isDraft(both), true);
  assert.equal(isListed(both), false);
});
