import { SelectedWorkFilterFallback } from "./selected-work-filter-fallback";

function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function SelectedWorkSkeleton() {
  return (
    <section
      className="flex flex-col gap-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading selected work…</span>
      <Bone className="h-10 w-56 max-w-full" />
      <SelectedWorkFilterFallback />
      <div className="flex flex-col gap-4">
        <Bone className="h-24 w-full" />
        <Bone className="h-24 w-full" />
        <Bone className="h-24 w-full" />
      </div>
    </section>
  );
}
