import type { ReactNode } from "react";
import type { ModuleAssignment } from "./contracts";
import { sitePlacement } from "./placements/site";
import { Position } from "./Position";
import { assertPlacement } from "./resolve";

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
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Position name="before-header" assignments={sitePlacement["before-header"] ?? []} />
      <Position name="header" assignments={header} />
      {children}
      <Position name="before-footer" assignments={sitePlacement["before-footer"] ?? []} />
      <Position name="footer" assignments={footer} />
      <Position name="after-footer" assignments={sitePlacement["after-footer"] ?? []} />
    </>
  );
}
