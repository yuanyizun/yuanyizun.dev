import { Fragment, type ReactNode } from "react";
import { Position } from "@/components/composite/position/position";
import { SITE_POSITIONS } from "@/theme/contracts";
import { themeAllowed } from "@/theme/registry";
import { assertPlacement, sitePlacement } from "@/theme/resolve";

export function SiteShell({ children }: { children: ReactNode }) {
  assertPlacement(sitePlacement, "site", themeAllowed);

  return (
    <>
      <a
        href="#main-content"
        className="absolute top-[-4rem] left-4 z-[60] rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:top-4"
      >
        Skip to content
      </a>
      {SITE_POSITIONS.map((name) => (
        <Fragment key={name}>
          <Position name={name} entries={sitePlacement[name] ?? []} />
          {name === "header" ? children : null}
        </Fragment>
      ))}
    </>
  );
}
