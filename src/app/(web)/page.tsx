import { Suspense } from "react";
import { LatestWritingSection } from "@/components/composite/latest-writing/latest-writing-section";
import { LatestWritingSkeleton } from "@/components/composite/latest-writing/latest-writing-skeleton";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { SelectedWorkSection } from "@/components/composite/selected-work/selected-work-section";
import { SelectedWorkSkeleton } from "@/components/composite/selected-work/selected-work-skeleton";

export default function HomePage({ searchParams }: PageProps<"/">) {
  return (
    <PageFrame
      template="home"
      props={{
        IntroHero: {
          title: "Senior full stack & platform engineer.",
          summary:
            "11 years delivering publishing platforms, business applications, integrations, and cloud infrastructure.",
        },
      }}
    >
      <div className="flex flex-col gap-16">
        <Suspense fallback={<SelectedWorkSkeleton />}>
          <SelectedWorkSection searchParams={searchParams} />
        </Suspense>
        <Suspense fallback={<LatestWritingSkeleton />}>
          <LatestWritingSection />
        </Suspense>
      </div>
    </PageFrame>
  );
}
