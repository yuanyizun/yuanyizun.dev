import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact",
};

const rows = [
  {
    href: "mailto:yuanyizun@gmail.com",
    label: "yuanyizun@gmail.com",
  },
  {
    href: "tel:+61410829994",
    label: "+61 410 829 994",
  },
  {
    href: "https://www.linkedin.com/in/yizun-yuan",
    label: "linkedin.com/in/yizun-yuan",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="page-shell flex flex-col gap-12 py-12 sm:py-20">
      <header className="quiet-column flex flex-col gap-5">
        <h1 className="font-heading text-[clamp(2.5rem,6vw,4rem)] tracking-[-0.04em]">
          Contact
        </h1>
        <p className="max-w-xl text-[1.125rem] text-foreground">
          Write or call about production systems, platforms, and full stack
          work. Sydney, NSW, Australia.
        </p>
      </header>

      <div className="quiet-column grid gap-10 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start">
        <figure className="aspect-square w-40 bg-surface">
          <Image
            src="/images/sydney-ferry-lady-denman-on-sydney-harbour.jpg"
            alt="Sydney ferry Lady Denman on Sydney Harbour, 1972"
            width={1920}
            height={1259}
            className="h-full w-full object-cover grayscale"
          />
        </figure>
        <ul className="flex flex-col gap-4">
          {rows.map((row) => (
            <li key={row.label}>
              <a
                href={row.href}
                className="text-[clamp(1.25rem,3vw,1.75rem)] font-medium tracking-[-0.02em] text-foreground underline underline-offset-4"
              >
                {row.label}
              </a>
            </li>
          ))}
          <li className="text-[1rem] text-muted-foreground">
            Sydney, NSW, Australia
          </li>
        </ul>
      </div>
    </div>
  );
}
