import type { Metadata } from "next";
import { NotFoundContent } from "@/components/composite/not-found-content/not-found-content";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { SiteShell } from "@/components/composite/site-shell/site-shell";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <SiteShell>
      <PageFrame template="not-found">
        <NotFoundContent />
      </PageFrame>
    </SiteShell>
  );
}
