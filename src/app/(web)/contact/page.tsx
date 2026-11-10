import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactLinks } from "@/components/composite/contact-links/contact-links";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import {
  PermissionPlaceholder,
  PermissionPlaceholderFallback,
  WithPermission,
} from "@/components/composite/with-permission/with-permission";

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
      <Suspense fallback={<PermissionPlaceholderFallback />}>
        <WithPermission
          permission="basic"
          placeholder={
            <PermissionPlaceholder message="Sign in to peek at the contact details." />
          }
        >
          <ContactLinks />
        </WithPermission>
      </Suspense>
    </PageFrame>
  );
}
