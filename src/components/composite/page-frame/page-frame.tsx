import type { ReactNode } from "react";
import { Container } from "@/components/primitive/container/container";
import { Position } from "@/components/composite/position/position";
import type { Placement } from "@/theme/contracts";
import type { PlacementProps } from "@/theme/registry";
import { themeAllowed } from "@/theme/registry";
import {
  assertPlacement,
  resolvePlacement,
  templatePlacement,
  type TemplateKey,
} from "@/theme/resolve";
import "./page-frame.module.css";

export function PageFrame({
  template,
  positions,
  props,
  children,
}: {
  template: TemplateKey;
  positions?: Placement;
  props?: PlacementProps;
  children: ReactNode;
}) {
  const resolved = resolvePlacement(templatePlacement(template), positions);
  assertPlacement(resolved, "route", themeAllowed);
  const hasSidebar = (resolved.sidebar?.length ?? 0) > 0;

  return (
    <>
      <Position name="after-header" entries={resolved["after-header"] ?? []} props={props} />
      <Container
        as="main"
        id="main-content"
        className="flex flex-col gap-12 py-8 sm:gap-16 sm:py-12"
      >
        <Position name="main-before" entries={resolved["main-before"] ?? []} props={props} />
        <Position name="main-middle" entries={resolved["main-middle"] ?? []} props={props} />
        <div className={hasSidebar ? "readingGrid" : "flex flex-col gap-12"}>
          <Position name="sidebar" entries={resolved.sidebar ?? []} props={props} />
          <div data-position="component" className="min-w-0">
            {children}
          </div>
        </div>
        <Position name="main-after" entries={resolved["main-after"] ?? []} props={props} />
      </Container>
    </>
  );
}
