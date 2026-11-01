import { ButtonLink } from "@/components/ui/button";
import { OrbitalCover } from "@/theme/covers";

export function IntroHero({
  title,
  summary,
}: {
  title: string;
  summary: string;
}) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)] lg:gap-16">
      <div className="flex max-w-3xl flex-col gap-6">
        <h1 className="font-heading text-[clamp(2.5rem,5.4vw,5.25rem)] leading-[0.96] tracking-[-0.035em]">
          {title}
        </h1>
        <p className="max-w-xl text-lg leading-relaxed text-foreground">
          {summary}
        </p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/contact">Let&apos;s talk</ButtonLink>
          <ButtonLink href="/about" variant="outline">
            About
          </ButtonLink>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl">
        <OrbitalCover title="Orbital diagram for publishing systems" />
      </div>
    </div>
  );
}
