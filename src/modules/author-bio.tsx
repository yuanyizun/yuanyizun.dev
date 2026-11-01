import Link from "next/link";

export function AuthorBio() {
  return (
    <section className="grid gap-4 rounded-xl bg-card p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
      <p className="font-heading text-4xl tracking-[-0.04em]">Yy.</p>
      <div className="flex flex-col gap-2">
        <h2 className="font-heading text-2xl tracking-[-0.03em]">Yizun Yuan</h2>
        <p className="max-w-xl text-sm leading-relaxed">
          Senior full stack and platform engineer in Sydney. Eleven years at
          Momentum Media, May 2015 to September 2026.
        </p>
        <Link href="/about" className="w-fit text-sm no-underline hover:text-primary">
          About
        </Link>
      </div>
    </section>
  );
}
