import assert from "node:assert/strict";
import test from "node:test";
import type { AllowedPositions, Placement } from "./contracts";
import { assertPlacement, resolvePlacement } from "./resolve";

const allowed: AllowedPositions = {
  PageIntro: ["main-before"],
  IntroHero: ["main-before"],
  ArticleCover: ["main-middle"],
  SectionNav: ["sidebar"],
  AuthorBio: ["main-after"],
  RelatedList: ["main-after"],
  SiteHeader: ["header"],
};

const base: Placement = {
  "main-before": ["PageIntro"],
  sidebar: ["SectionNav"],
  "main-after": ["AuthorBio", "RelatedList"],
};

test("omitted positions inherit and missing positions stay empty", () => {
  const resolved = resolvePlacement(base, { "main-before": ["IntroHero"] });

  assert.deepEqual(resolved["main-before"], ["IntroHero"]);
  assert.deepEqual(resolved.sidebar, ["SectionNav"]);
  assert.deepEqual(resolved["after-header"], []);
  assert.deepEqual(resolved["main-after"], ["AuthorBio", "RelatedList"]);
});

test("an empty array clears an inherited position", () => {
  const resolved = resolvePlacement(base, { sidebar: [] });

  assert.deepEqual(resolved.sidebar, []);
  assert.deepEqual(resolved["main-before"], ["PageIntro"]);
});

test("array order survives the merge", () => {
  const resolved = resolvePlacement(base, {
    "main-after": [{ id: "notes", component: "RelatedList" }, "AuthorBio"],
  });

  assert.deepEqual(resolved["main-after"], [
    { id: "notes", component: "RelatedList" },
    "AuthorBio",
  ]);
});

test("a site position on a template is rejected", () => {
  assert.throws(() => assertPlacement({ header: ["SiteHeader"] }, "route", allowed));
});

test("a route position on the site is rejected", () => {
  assert.throws(() => assertPlacement({ sidebar: ["SectionNav"] }, "site", allowed));
});

test("an unknown component is rejected", () => {
  assert.throws(() => assertPlacement({ "main-before": ["Missing"] }, "route", allowed));
});

test("a component in a position it does not allow is rejected", () => {
  assert.throws(() => assertPlacement({ "main-middle": ["PageIntro"] }, "route", allowed));
});

test("an unknown position is rejected", () => {
  assert.throws(() =>
    assertPlacement({ nope: ["PageIntro"] } as Placement, "route", allowed),
  );
});

test("a duplicate id is rejected, including an object-form entry", () => {
  assert.throws(() =>
    assertPlacement(
      {
        "main-before": ["PageIntro"],
        "main-middle": [{ id: "PageIntro", component: "ArticleCover" }],
      },
      "route",
      allowed,
    ),
  );
});

test("a legal placement passes", () => {
  assert.doesNotThrow(() =>
    assertPlacement(
      {
        "main-before": ["PageIntro"],
        "main-middle": [{ id: "cover", component: "ArticleCover" }],
        "main-after": ["AuthorBio", "RelatedList"],
      },
      "route",
      allowed,
    ),
  );
});
