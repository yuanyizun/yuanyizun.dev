function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function InterviewAppSkeleton() {
  return (
    <div
      className="flex h-dvh flex-col bg-background"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading interview notes…</span>
      <div className="flex items-center gap-3 px-4 py-3" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
        <Bone className="h-5 w-16" />
        <Bone className="h-5 flex-1" />
        <Bone className="h-11 w-11 rounded-full" />
        <Bone className="h-11 w-11 rounded-full" />
      </div>
      <div className="flex flex-1 flex-col gap-4 px-4 py-4">
        <Bone className="h-10 w-4/5" />
        <Bone className="h-28 w-full" />
        <Bone className="h-40 w-full" />
      </div>
      <div
        className="flex gap-3 px-4 py-3"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <Bone className="h-11 flex-1" />
        <Bone className="h-11 flex-1" />
      </div>
    </div>
  );
}
