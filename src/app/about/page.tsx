import type { Metadata } from "next";
import { AboutContent } from "@/components/composite/about-content/about-content";
import { PageFrame } from "@/components/composite/page-frame/page-frame";

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
