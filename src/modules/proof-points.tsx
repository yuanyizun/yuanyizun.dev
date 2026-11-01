const points = [
  {
    label: "Tenure",
    value: "11 years",
    detail: "Momentum Media, May 2015–September 2026",
  },
  {
    label: "Publishing",
    value: "About 12 sites",
    detail: "One shared Tailwind template across Joomla brands",
  },
  {
    label: "Hosting",
    value: "150–200 apps",
    detail: "Four isolated AWS groups",
  },
  {
    label: "Education",
    value: "Master of IT",
    detail: "University of Sydney",
  },
] as const;

export function ProofPoints() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <h2 className="sr-only">Selected facts</h2>
      {points.map((point) => (
        <article key={point.label} className="flex flex-col gap-3 bg-card p-6">
          <p className="font-mono text-xs text-muted-foreground">{point.label}</p>
          <p className="font-heading text-3xl tracking-[-0.03em]">{point.value}</p>
          <p className="text-sm leading-relaxed text-foreground">{point.detail}</p>
        </article>
      ))}
    </section>
  );
}
