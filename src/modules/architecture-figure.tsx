export function ArchitectureFigure({
  stages,
  title,
}: {
  stages: string[];
  title: string;
}) {
  if (stages.length === 0) {
    return null;
  }

  return (
    <figure className="flex flex-col gap-4">
      <figcaption className="font-mono text-xs text-muted-foreground">
        Conceptual architecture · {title}
      </figcaption>
      <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((stage) => (
          <li
            key={stage}
            className="rounded-xl bg-inverse px-4 py-5 text-inverse-foreground"
          >
            <p className="font-heading text-2xl leading-tight tracking-[-0.03em]">
              {stage}
            </p>
          </li>
        ))}
      </ol>
    </figure>
  );
}
