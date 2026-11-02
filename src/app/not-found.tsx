import type { Metadata } from "next";
import { NotFoundContent } from "@/components/composite/not-found-content/not-found-content";
import { PageFrame } from "@/components/composite/page-frame/page-frame";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <PageFrame template="not-found">
      <NotFoundContent />
    </PageFrame>
  );
}
