import { Container } from "@/components/primitive/container/container";

function Bone({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-card ${className ?? ""}`} aria-hidden />;
}

export function PageLoading() {
  return (
    <Container
      as="main"
      id="main-content"
      className="flex min-h-[36rem] flex-col gap-6 py-8 sm:py-12"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading page…</span>
      <Bone className="h-14 w-2/3 max-w-xl" />
      <Bone className="h-6 w-1/2 max-w-md" />
      <Bone className="mt-6 h-48 w-full" />
      <Bone className="h-24 w-full" />
      <Bone className="h-24 w-full" />
    </Container>
  );
}
