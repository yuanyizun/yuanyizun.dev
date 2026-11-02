function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function SelectedWorkFilterFallback() {
  return (
    <div
      className="flex min-h-[8.5rem] flex-col gap-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading filters…</span>
      <div className="flex max-w-xs flex-col gap-3">
        <Bone className="h-3 w-16" />
        <Bone className="h-11 w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Bone className="min-h-11 w-16" />
        <Bone className="min-h-11 w-28" />
        <Bone className="min-h-11 w-32" />
        <Bone className="min-h-11 w-24" />
      </div>
    </div>
  );
}
