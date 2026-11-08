import Link from "next/link";

export type RelatedItem = {
  href: string;
  title: string;
  summary: string;
  meta: string;
};

export function RelatedList({
  title,
  items,
}: {
  title: string;
  items: RelatedItem[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-5">
      <h2 className="font-heading text-3xl tracking-[-0.03em]">{title}</h2>
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex h-full flex-col gap-2 rounded-xl bg-card p-5 no-underline"
            >
              <span className="font-mono text-xs text-muted-foreground">
                {item.meta}
              </span>
              <span className="font-heading text-2xl tracking-[-0.03em]">
                {item.title}
              </span>
              <span className="text-sm leading-relaxed text-foreground">
                {item.summary}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
