function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function InterviewSkeleton() {
  return (
    <div
      className="grid gap-4 md:grid-cols-[18.25rem_minmax(0,1fr)]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading interview notes…</span>
      <Bone className="h-64 w-full" />
      <div className="flex flex-col gap-4">
        <Bone className="h-40 w-full" />
        <Bone className="h-40 w-full" />
        <Bone className="h-40 w-full" />
      </div>
    </div>
  );
}
