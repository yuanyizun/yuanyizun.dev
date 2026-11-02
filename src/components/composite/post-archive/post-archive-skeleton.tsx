function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function PostArchiveSkeleton() {
  return (
    <div
      className="flex flex-col gap-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading posts…</span>
      <Bone className="h-11 w-full max-w-xl" />
      <Bone className="h-48 w-full" />
      <Bone className="h-20 w-full" />
      <Bone className="h-20 w-full" />
    </div>
  );
}
