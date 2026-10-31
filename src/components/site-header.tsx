"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Work" },
  { href: "/posts", label: "Notes" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="page-shell flex items-center justify-between gap-4 py-6">
      <Link
        href="/"
        className="font-heading shrink-0 text-[0.9375rem] font-medium tracking-[-0.02em] no-underline hover:text-foreground"
      >
        Yizun Yuan
      </Link>
      <nav className="flex flex-wrap items-center justify-end gap-x-5 gap-y-2 text-[0.875rem] font-medium tracking-[-0.01em]">
        {links.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`no-underline transition-colors ${
                active ? "text-accent" : "text-foreground hover:text-accent"
              }`}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
        <Link
          href="/contact"
          className="pressable bg-accent px-3.5 py-2 text-accent-foreground no-underline hover:bg-foreground hover:text-background"
        >
          Contact
        </Link>
      </nav>
    </header>
  );
}
