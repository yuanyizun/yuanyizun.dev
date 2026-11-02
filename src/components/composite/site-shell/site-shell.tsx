import type { ReactNode } from "react";
import { NosyPointer } from "@/components/composite/nosy-pointer/nosy-pointer";
import { Position } from "@/components/composite/position/position";
import type { ModuleAssignment } from "@/theme/contracts";
import { sitePlacement } from "@/theme/placements/site";
import { assertPlacement } from "@/theme/resolve";

const fallbackHeader: ModuleAssignment = {
  id: "fallback-header",
  type: "SiteHeader",
  props: {},
};

const fallbackFooter: ModuleAssignment = {
  id: "fallback-footer",
  type: "SiteFooter",
  props: {},
};

export function SiteShell({ children }: { children: ReactNode }) {
  assertPlacement(sitePlacement);
  const header = sitePlacement.header?.length
    ? sitePlacement.header
    : [fallbackHeader];
  const footer = sitePlacement.footer?.length
    ? sitePlacement.footer
    : [fallbackFooter];

  return (
    <>
      <a
        href="#main-content"
        className="absolute top-[-4rem] left-4 z-[60] rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:top-4"
      >
        Skip to content
      </a>
      <NosyPointer />
      <Position name="before-header" assignments={sitePlacement["before-header"] ?? []} />
      <Position name="header" assignments={header} />
      {children}
      <Position name="before-footer" assignments={sitePlacement["before-footer"] ?? []} />
      <Position name="footer" assignments={footer} />
      <Position name="after-footer" assignments={sitePlacement["after-footer"] ?? []} />
    </>
  );
}
