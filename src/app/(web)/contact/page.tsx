import type { Metadata } from "next";
import { Suspense } from "react";
import {
  AuthGate,
  AuthGateFallback,
} from "@/components/composite/auth-gate/auth-gate";
import { ContactLinks } from "@/components/composite/contact-links/contact-links";
import { PageFrame } from "@/components/composite/page-frame/page-frame";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageFrame
      template="contact"
      props={{
        PageIntro: {
          title: "Contact",
          summary:
            "Write or call about production systems, platforms, and full stack work. Sydney, NSW, Australia.",
        },
      }}
    >
      <Suspense fallback={<AuthGateFallback />}>
        <AuthGate message="Sign in to peek at the contact details.">
          <ContactLinks />
        </AuthGate>
      </Suspense>
    </PageFrame>
  );
}
