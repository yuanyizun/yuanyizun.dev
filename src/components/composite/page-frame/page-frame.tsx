import type { ReactNode } from "react";
import { Container } from "@/components/primitive/container/container";
import { Position } from "@/components/composite/position/position";
import type { Placement, TemplateKey } from "@/theme/contracts";
import { templatePlacements, templateVariants } from "@/theme/placements/templates";
import { assertPlacement, resolvePlacement } from "@/theme/resolve";
import "./page-frame.module.css";

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
      <Container
        as="main"
        id="main-content"
        className="flex flex-col gap-12 py-8 sm:gap-16 sm:py-12"
        data-variant={variant}
      >
        <Position name="main-before" assignments={resolved["main-before"] ?? []} />
        <Position name="main-middle" assignments={resolved["main-middle"] ?? []} />
        <div className={hasSidebar ? "readingGrid" : "flex flex-col gap-12"}>
          <Position name="sidebar" assignments={resolved.sidebar ?? []} />
          <div data-position="component" className="min-w-0">
            {children}
          </div>
        </div>
        <Position name="main-after" assignments={resolved["main-after"] ?? []} />
      </Container>
    </>
  );
}
