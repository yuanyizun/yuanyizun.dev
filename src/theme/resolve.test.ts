import assert from "node:assert/strict";
import test from "node:test";
import type { Placement } from "./contracts";
import { resolvePlacement, assertPlacement } from "./resolve";

const base: Placement = {
  "main-before": [
    {
      id: "intro",
      type: "PageIntro",
      props: { title: "Notes from the journey." },
    },
  ],
  sidebar: [
    {
      id: "contents",
      type: "ArticleNavigation",
      props: { headings: [{ id: "one", title: "One" }] },
    },
  ],
};

test("omitted positions inherit and missing positions stay empty", () => {
  const resolved = resolvePlacement(base, {
    "main-before": [
      {
        id: "replaced",
        type: "PageIntro",
        props: { title: "Replaced" },
      },
    ],
  });

  assert.equal(resolved["main-before"]?.[0]?.id, "replaced");
  assert.equal(resolved.sidebar?.[0]?.id, "contents");
  assert.deepEqual(resolved["after-header"], []);
});

test("an empty array clears an inherited position", () => {
  const resolved = resolvePlacement(base, { sidebar: [] });
  assert.deepEqual(resolved.sidebar, []);
  assert.equal(resolved["main-before"]?.[0]?.id, "intro");
});

test("unknown modules and illegal positions are rejected", () => {
  assert.throws(() =>
    assertPlacement({
      header: [{ id: "bad", type: "PageIntro", props: { title: "No" } }],
    }),
  );
});

test("duplicate assignment ids are rejected", () => {
  assert.throws(() =>
    assertPlacement({
      "main-before": [
        { id: "same", type: "PageIntro", props: { title: "A" } },
      ],
      "main-middle": [
        {
          id: "same",
          type: "ArticleCover",
          props: { title: "B" },
        },
      ],
    }),
  );
});

test("a legal placement passes", () => {
  assert.doesNotThrow(() => assertPlacement(resolvePlacement(base)));
});
