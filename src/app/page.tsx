import Image from "next/image";
import Link from "next/link";
import { HomeTyping } from "@/components/home-typing";

const featured = [
  {
    href: "/projects/event-ticket-sales-crm",
    title: "Event Ticket Sales CRM",
    kind: "Applications",
    period: "2026",
    outcome: "First version in about two weeks; used daily by the sales team.",
  },
  {
    href: "/projects/laravel-comment-system",
    title: "Standalone Laravel Comment System",
    kind: "Applications",
    period: "2026",
    outcome: "Rolled out across all 12 websites; easier moderation.",
  },
  {
    href: "/projects/bigquery-data-pipeline",
    title: "BigQuery Data Pipeline Platform",
    kind: "Data",
    period: "circa 2025",
    outcome: "Centralised scripts and credentials; missing data became rare.",
  },
  {
    href: "/projects/aws-hosting-restructure",
    title: "AWS Hosting Restructure",
    kind: "Infrastructure",
    period: "2022–2026",
    outcome: "About 150–200 applications in four groups.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="page-shell grid items-center gap-10 pb-16 pt-12 sm:gap-14 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.95fr)]">
        <div className="hero-rise flex flex-col gap-8 lg:max-w-[40rem] lg:pl-[clamp(0rem,4vw,4rem)]">
          <HomeTyping />
          <div className="flex flex-wrap items-center gap-5">
            <Link
              href="/contact"
              className="pressable inline-flex w-fit bg-accent px-4 py-3 text-[0.9375rem] font-medium text-accent-foreground no-underline hover:bg-foreground hover:text-background"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="text-[0.9375rem] font-medium text-foreground no-underline underline-offset-4 hover:underline"
            >
              Read the career
            </Link>
          </div>
        </div>
        <figure className="drift-media aspect-[4/5] w-full max-w-[32rem] justify-self-end bg-surface lg:aspect-[5/6]">
          <Image
            src="/images/sydney-opera-house-and-harbour-bridge-dusk.jpg"
            alt="Sydney Opera House and Harbour Bridge at dusk"
            width={1920}
            height={960}
            className="h-full w-full object-cover grayscale"
            priority
          />
        </figure>
      </section>

      <section className="page-shell py-16 sm:py-20" data-reveal="true">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start">
          <div className="flex flex-col gap-7 lg:pl-[clamp(0rem,4vw,4rem)]">
            <h2 className="reveal-item font-heading text-[clamp(1.5rem,2vw,1.75rem)] font-medium tracking-[-0.03em]">
              Selected work
            </h2>
            <ul className="work-list list-rise flex flex-col">
              {featured.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="work-row grid gap-1 py-4 no-underline sm:grid-cols-[minmax(0,1.5fr)_auto] sm:items-start sm:gap-8"
                  >
                    <span>
                      <span className="block text-[1.05rem] tracking-[-0.01em]">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-[0.9375rem] text-foreground">
                        {item.outcome}
                      </span>
                      <span className="mt-1 block text-[0.875rem] text-muted-foreground sm:hidden">
                        {item.kind} · {item.period}
                      </span>
                    </span>
                    <span className="hidden text-right text-[0.875rem] text-muted-foreground sm:block">
                      {item.kind}
                      <br />
                      <span className="tabular-nums">{item.period}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/projects"
              className="reveal-item pressable w-fit font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-accent hover:text-accent"
            >
              See all work
            </Link>
          </div>
          <div className="reveal-item grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <figure className="drift-media aspect-[16/10] bg-surface">
              <Image
                src="/images/the-rotary-press-of-newspaper-hufvudstadsbladet.jpg"
                alt="Rotary newspaper press in a printing house, 1927"
                width={1920}
                height={1407}
                className="h-full w-full object-cover grayscale"
              />
            </figure>
            <figure className="aspect-[16/10] bg-surface">
              <Image
                src="/images/wharves-of-darling-harbour-and-pyrmont-sydney.jpg"
                alt="Wharves of Darling Harbour and Pyrmont, Sydney, 1950s"
                width={1920}
                height={1337}
                className="h-full w-full object-cover grayscale"
              />
            </figure>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 sm:py-20" data-reveal="true">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:pl-[clamp(0rem,4vw,4rem)]">
          <div className="flex flex-col gap-5">
            <h2 className="reveal-item font-heading text-[clamp(1.5rem,2vw,1.75rem)] font-medium tracking-[-0.03em]">
              About
            </h2>
            <p className="reveal-item max-w-[36rem] text-[clamp(1.125rem,1.6vw,1.25rem)] leading-[1.4] text-foreground">
              Eleven years at Momentum Media in Sydney, from publishing websites
              into shared platforms across roughly a dozen brands. Laravel
              applications, Node services, Python data pipelines, and AWS hosting
              for about 150–200 applications.
            </p>
            <Link
              href="/about"
              className="reveal-item w-fit font-medium text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-accent hover:text-accent"
            >
              Read the career
            </Link>
          </div>
          <div className="reveal-item grid gap-8 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-start">
            <figure className="drift-media aspect-square w-40 bg-surface">
              <Image
                src="/images/sydney-ferry-lady-denman-on-sydney-harbour.jpg"
                alt="Sydney ferry Lady Denman on Sydney Harbour, 1972"
                width={1920}
                height={1259}
                className="h-full w-full object-cover grayscale"
              />
            </figure>
            <div className="flex flex-col gap-3">
              <h2 className="font-heading text-[clamp(1.5rem,2vw,1.75rem)] font-medium tracking-[-0.03em]">
                Contact
              </h2>
              <p className="max-w-[28rem] text-[1.125rem] leading-[1.45] text-foreground">
                Write or call about production systems, platforms, and full stack
                work.
              </p>
              <a
                href="mailto:yuanyizun@gmail.com"
                className="text-[1.125rem] text-foreground underline underline-offset-4"
              >
                yuanyizun@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/yizun-yuan"
                className="text-[1.125rem] text-foreground underline underline-offset-4"
              >
                linkedin.com/in/yizun-yuan
              </a>
              <p className="text-[0.875rem] text-muted-foreground">Sydney, NSW</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
