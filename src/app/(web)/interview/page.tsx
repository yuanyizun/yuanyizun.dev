import type { Metadata } from "next";
import { Suspense } from "react";
import { InterviewPasscodeGate } from "@/components/composite/interview-passcode/interview-passcode-gate";
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
        <InterviewPasscodeGate>
          <InterviewSection />
        </InterviewPasscodeGate>
      </Suspense>
    </PageFrame>
  );
}
