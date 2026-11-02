function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function LatestWritingSkeleton() {
  return (
    <section
      className="flex flex-col gap-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading latest writing…</span>
      <Bone className="h-10 w-52 max-w-full" />
      <div className="flex flex-col gap-0">
        <Bone className="my-3 h-16 w-full" />
        <Bone className="my-3 h-16 w-full" />
        <Bone className="my-3 h-16 w-full" />
      </div>
    </section>
  );
}
