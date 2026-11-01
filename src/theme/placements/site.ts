import type { Placement } from "../contracts";

export const sitePlacement: Placement = {
  "before-header": [],
  header: [{ id: "site-header", type: "SiteHeader", props: {} }],
  "before-footer": [
    { id: "site-contact", type: "ContactCTA", props: { variant: "full" } },
  ],
  footer: [{ id: "site-footer", type: "SiteFooter", props: {} }],
  "after-footer": [],
};
