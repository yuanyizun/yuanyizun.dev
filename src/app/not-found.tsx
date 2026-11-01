import type { Metadata } from "next";
import { NotFoundContent } from "@/features/fallbacks";
import { PageFrame } from "@/theme/PageFrame";

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
