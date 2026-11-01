import type { Metadata } from "next";
import { AboutContent } from "@/features/about-content";
import { PageFrame } from "@/theme/PageFrame";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageFrame template="about">
      <AboutContent />
    </PageFrame>
  );
}
