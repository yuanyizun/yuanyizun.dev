import type { Metadata } from "next";
import { AboutContent } from "@/components/composite/about-content/about-content";
import { PageFrame } from "@/components/composite/page-frame/page-frame";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <PageFrame
      template="about"
      props={{
        PageIntro: {
          title: "Full-stack ownership. Systems that last.",
          summary:
            "Full stack engineer with 11 years delivering and maintaining production applications for a digital media business.",
          mark: "profile",
        },
      }}
    >
      <AboutContent />
    </PageFrame>
  );
}
