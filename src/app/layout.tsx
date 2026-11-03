import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono, Newsreader } from "next/font/google";
import { SiteShell } from "@/components/composite/site-shell/site-shell";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      data-scroll-behavior="smooth"
      data-positions={process.env.THEME_POSITIONS === "1" ? "true" : undefined}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
