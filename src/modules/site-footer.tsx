import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteFooter() {
  return (
    <footer className="theme-container flex flex-col gap-8 py-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-3">
        <p className="font-heading text-3xl tracking-[-0.03em]">Yizun Yuan</p>
        <p className="text-sm text-muted-foreground">Sydney, NSW</p>
      </div>
      <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="no-underline">
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="text-sm text-muted-foreground">2026</p>
    </footer>
  );
}
