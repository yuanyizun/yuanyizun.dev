import type { Metadata } from "next";
import { Suspense } from "react";
import { InterviewSection } from "@/components/composite/interview-sheet/interview-section";
import { InterviewSkeleton } from "@/components/composite/interview-sheet/interview-skeleton";
import { PageFrame } from "@/components/composite/page-frame/page-frame";

export const metadata: Metadata = {
  title: "Interview",
};

export default function InterviewPage() {
  return (
    <PageFrame template="interview">
      <Suspense fallback={<InterviewSkeleton />}>
        <InterviewSection />
      </Suspense>
    </PageFrame>
  );
}
