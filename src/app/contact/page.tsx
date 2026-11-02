import type { Metadata } from "next";
import { ContactLinks } from "@/components/composite/contact-links/contact-links";
import { PageFrame } from "@/components/composite/page-frame/page-frame";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <PageFrame template="contact">
      <ContactLinks />
    </PageFrame>
  );
}
