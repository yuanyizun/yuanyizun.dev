import type { ReactNode } from "react";
import type { Placement, TemplateKey } from "./contracts";
import { templatePlacements, templateVariants } from "./placements/templates";
import { Position } from "./Position";
import { assertPlacement, resolvePlacement } from "./resolve";

export function PageFrame({
  template,
  positions,
  children,
}: {
  template: TemplateKey;
  positions?: Placement;
  children: ReactNode;
}) {
  const resolved = resolvePlacement(templatePlacements[template], positions);
  assertPlacement(resolved);
  const variant = templateVariants[template];
  const hasSidebar = (resolved.sidebar?.length ?? 0) > 0;

  return (
    <>
      <Position name="after-header" assignments={resolved["after-header"] ?? []} />
      <main id="main-content" className="theme-container flex flex-col gap-12 py-8 sm:gap-16 sm:py-12" data-variant={variant}>
        <Position name="main-before" assignments={resolved["main-before"] ?? []} />
        <Position name="main-middle" assignments={resolved["main-middle"] ?? []} />
        <div className={hasSidebar ? "reading-grid" : "flex flex-col gap-12"}>
          <Position name="sidebar" assignments={resolved.sidebar ?? []} />
          <div data-position="component" className="slot-component min-w-0">
            {children}
          </div>
        </div>
        <Position name="main-after" assignments={resolved["main-after"] ?? []} />
      </main>
    </>
  );
}
