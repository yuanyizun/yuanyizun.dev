function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function ProjectArchiveSkeleton() {
  return (
    <div
      className="flex flex-col gap-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading projects…</span>
      <div className="flex flex-wrap gap-2">
        <Bone className="h-11 w-16" />
        <Bone className="h-11 w-28" />
        <Bone className="h-11 w-24" />
      </div>
      <Bone className="h-64 w-full" />
      <div className="grid gap-4 md:grid-cols-2">
        <Bone className="h-40 w-full" />
        <Bone className="h-40 w-full" />
      </div>
    </div>
  );
}
