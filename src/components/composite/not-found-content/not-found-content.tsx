import Link from "next/link";

const links = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
] as const;

export function NotFoundContent() {
  return (
    <div className="flex max-w-xl flex-col gap-6">
      <h1 className="font-heading text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.035em]">
        Page not found.
      </h1>
      <p className="text-lg leading-relaxed">
        That address is not on this site. Try one of these instead.
      </p>
      <div className="flex flex-wrap gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center rounded-md bg-card px-4 text-sm no-underline"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
