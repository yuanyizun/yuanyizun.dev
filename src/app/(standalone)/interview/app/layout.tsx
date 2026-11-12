import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Interview app",
  manifest: "/interview/app/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Interview",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: [{ url: "/interview/app/apple-icon", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f0",
};

export default function InterviewAppLayout({
  children,
}: LayoutProps<"/interview/app">) {
  return (
    <>
      <a
        href="#interview-answer"
        className="absolute top-[-4rem] left-4 z-[60] rounded-lg bg-primary px-4 py-3 text-primary-foreground focus:top-4"
      >
        Skip to answer
      </a>
      {children}
    </>
  );
}
