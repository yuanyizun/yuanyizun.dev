import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Showtime",
  description: "Personal site",
};

const links = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 py-6">
          <nav className="flex flex-wrap items-center gap-1">
            {links.map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </nav>
          <Separator />
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 pb-12">{children}</main>
        <footer className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 pb-8">
          <Separator />
          <p className="text-sm text-muted-foreground">Showtime</p>
        </footer>
      </body>
    </html>
  );
}
