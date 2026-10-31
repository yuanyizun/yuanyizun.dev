import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteMotion } from "@/components/site-motion";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Yizun Yuan",
    template: "%s · Yizun Yuan",
  },
  description:
    "Senior full stack engineer in Sydney. Production systems for a digital media business.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <SiteMotion />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
