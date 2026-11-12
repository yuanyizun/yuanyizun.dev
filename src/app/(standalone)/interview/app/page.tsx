import type { Metadata } from "next";
import { Suspense } from "react";
import { InterviewAppSection } from "@/components/composite/interview-app/interview-app-section";
import { InterviewAppSkeleton } from "@/components/composite/interview-app/interview-app-skeleton";
import { InterviewSw } from "@/components/composite/interview-app/interview-sw";

export const metadata: Metadata = {
  title: "Interview app",
};

export default function InterviewAppPage() {
  return (
    <>
      <Suspense fallback={<InterviewAppSkeleton />}>
        <InterviewAppSection />
      </Suspense>
      <InterviewSw />
    </>
  );
}
