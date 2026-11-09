const rows = [
  { href: "mailto:yuanyizun@gmail.com", label: "yuanyizun@gmail.com" },
  { href: "tel:+61410829994", label: "+61 410 829 994" },
  { href: "https://www.linkedin.com/in/yizun-yuan", label: "linkedin.com/in/yizun-yuan" },
] as const;

export function ContactLinks() {
  return (
    <ul className="flex max-w-xl flex-col gap-4">
      {rows.map((row) => (
        <li key={row.href}>
          <a
            href={row.href}
            className="font-heading text-3xl tracking-heading no-underline hover:text-primary"
          >
            {row.label}
          </a>
        </li>
      ))}
      <li className="text-sm text-muted-foreground">Sydney, NSW, Australia</li>
    </ul>
  );
}
