import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono, Newsreader } from "next/font/google";
import { GoogleAnalytics } from "@/components/composite/google-analytics/google-analytics";
import { SiteShell } from "@/components/composite/site-shell/site-shell";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Code, dates, and meta labels on most routes, including the ticker on the first screen.
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: "500",
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

// Script wordmark in the first paint of every route. The header is a client component, so this call stays here.
const caveat = Caveat({
  subsets: ["latin"],
  weight: "600",
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Yizun Yuan",
    template: "%s · Yizun Yuan",
  },
  description:
    "Senior full stack and platform engineer in Sydney. Production systems for a digital media business.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${newsreader.variable} ${caveat.variable} h-full antialiased`}
      data-positions={process.env.THEME_POSITIONS === "1" ? "true" : undefined}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteShell>{children}</SiteShell>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
