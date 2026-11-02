import type { CaseStudyMeta } from "@/theme/contracts";

export function CaseStudyHeader({ study }: { study: CaseStudyMeta }) {
  const facts = [
    study.context ? { label: "Context", value: study.context } : null,
    study.period ? { label: "Period", value: study.period } : null,
    study.role ? { label: "Role", value: study.role } : null,
    study.stack?.length
      ? { label: "Stack", value: study.stack.join(", ") }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <header className="flex flex-col gap-8">
      <div className="flex max-w-3xl flex-col gap-4">
        <h1 className="font-heading text-[clamp(2.5rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.035em]">
          {study.title}
        </h1>
        <p className="text-lg leading-relaxed">{study.summary}</p>
      </div>
      {facts.length > 0 ? (
        <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl bg-card p-4">
              <dt className="font-mono text-xs text-muted-foreground">
                {fact.label}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed">{fact.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  );
}
