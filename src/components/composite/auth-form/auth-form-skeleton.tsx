function Bone({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-card ${className ?? ""}`} aria-hidden />;
}

/** Form-area placeholder while auth pages resolve the signed-in redirect. */
export function AuthFormSkeleton() {
  return (
    <div
      className="flex w-full max-w-lg flex-col gap-6 rounded-xl border border-border bg-background px-6 py-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading form…</span>
      <Bone className="h-10 w-2/3" />
      <Bone className="h-5 w-4/5" />
      <Bone className="mt-2 h-11 w-full" />
      <Bone className="h-11 w-full" />
      <Bone className="h-11 w-full" />
    </div>
  );
}
