import { ButtonAnchor, ButtonLink } from "@/components/primitive/button/button";
import { Container } from "@/components/primitive/container/container";

export function ContactCTA({ variant = "full" }: { variant?: "compact" | "full" }) {
  return (
    <section className="bg-inverse text-inverse-foreground">
      <Container className="flex flex-col gap-6 py-14 sm:py-16 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex max-w-xl flex-col gap-3">
          <h2 className="font-heading text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-heading">
            Write about production systems.
          </h2>
          {variant === "full" ? (
            <p className="text-inverse-muted">
              Email or LinkedIn. Sydney, NSW.
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonAnchor href="mailto:yuanyizun@gmail.com" variant="inverse">
            yuanyizun@gmail.com
          </ButtonAnchor>
          <ButtonLink href="/contact" variant="outline" className="border-white/20 text-inverse-foreground hover:bg-white/10">
            Contact page
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
