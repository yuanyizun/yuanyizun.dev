const points = [
  {
    title: "Adapt & Pivot",
    description:
      "I adjust quickly as priorities change, explore different approaches and change direction when new evidence points to a better path.",
  },
  {
    title: "Learn & Evolve",
    description:
      "I build on what I know, learn unfamiliar tools and challenge assumptions as new possibilities emerge.",
  },
  {
    title: "Work Smarter with AI",
    description:
      "I use AI thoughtfully to accelerate research, explore ideas and turn complex work into practical results.",
  },
  {
    title: "Apply Judgment",
    description:
      "I draw on knowledge and experience to ask better questions, assess AI outputs and decide what matters.",
  },
] as const;

export function ProofPoints() {
  return (
    <section className="relative grid items-start gap-4 pt-8 sm:grid-cols-2 sm:pt-6 xl:grid-cols-4">
      <h2 className="pointer-events-none absolute -top-2 left-0 z-10 -rotate-6 bg-background px-3 py-2 font-heading text-[clamp(1.35rem,2.4vw,1.85rem)] italic leading-none tracking-[-0.02em] text-primary shadow-[2px_3px_0_color-mix(in_srgb,var(--foreground)_18%,transparent)] ring-1 ring-border sm:-top-3 sm:left-1">
        How I Work!
      </h2>
      {points.map((point) => (
        <article
          key={point.title}
          className="flex flex-col gap-3 bg-inverse p-6 text-inverse-foreground"
        >
          <h3 className="font-heading text-[clamp(1.65rem,2vw,2rem)] leading-[1.05] tracking-[-0.03em]">
            {point.title}
          </h3>
          <p className="text-base leading-relaxed text-inverse-muted">
            {point.description}
          </p>
        </article>
      ))}
    </section>
  );
}
