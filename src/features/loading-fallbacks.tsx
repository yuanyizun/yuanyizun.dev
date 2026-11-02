function Bone({ className }: { className?: string }) {
  return <div className={`rounded-md bg-card ${className ?? ""}`} aria-hidden />;
}

export function PostsArchiveFallback() {
  return (
    <div
      className="flex min-h-[36rem] flex-col gap-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading notes…</span>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Bone className="min-h-11 flex-1" />
        <Bone className="min-h-11 w-28" />
      </div>
      <div className="grid gap-6 rounded-xl bg-card p-5 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] lg:items-center">
        <Bone className="aspect-[4/3] w-full rounded-lg" />
        <div className="flex flex-col gap-3">
          <Bone className="h-3 w-24" />
          <Bone className="h-10 w-3/4 max-w-md" />
          <Bone className="h-4 w-full max-w-xl" />
          <Bone className="h-4 w-2/3 max-w-lg" />
        </div>
      </div>
      <ul className="flex flex-col">
        {Array.from({ length: 3 }, (_, index) => (
          <li key={index} className="border-t border-border py-5">
            <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <Bone className="h-3 w-20" />
              <div className="flex flex-col gap-2">
                <Bone className="h-5 w-2/3 max-w-sm" />
                <Bone className="h-4 w-full max-w-xl" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProjectsArchiveFallback() {
  return (
    <div
      className="flex min-h-[40rem] flex-col gap-10"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading projects…</span>
      <div className="flex flex-wrap gap-2">
        <Bone className="min-h-11 w-16" />
        <Bone className="min-h-11 w-28" />
        <Bone className="min-h-11 w-32" />
        <Bone className="min-h-11 w-24" />
      </div>
      <div className="grid gap-4 overflow-hidden rounded-xl bg-card lg:grid-cols-2">
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <Bone className="h-3 w-40" />
          <Bone className="h-10 w-4/5" />
          <Bone className="h-4 w-full" />
          <Bone className="h-4 w-3/4" />
          <Bone className="mt-4 min-h-11 w-36" />
        </div>
        <Bone className="min-h-56 w-full rounded-none" />
      </div>
      <ul className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }, (_, index) => (
          <li key={index} className="rounded-xl bg-card p-6">
            <div className="flex flex-col gap-3">
              <Bone className="h-3 w-28" />
              <Bone className="h-7 w-3/4" />
              <Bone className="h-4 w-full" />
              <Bone className="h-4 w-5/6" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HomeContentFallback() {
  return (
    <div
      className="flex min-h-[48rem] flex-col gap-16"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading selected work…</span>
      <section className="flex flex-col gap-8">
        <Bone className="h-10 w-56" />
        <ul className="relative m-0 flex list-none flex-col p-0">
          <span
            className="pointer-events-none absolute top-2 bottom-2 left-[2.35rem] w-px bg-border sm:left-[3.1rem]"
            aria-hidden
          />
          {Array.from({ length: 5 }, (_, index) => (
            <li
              key={index}
              className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-6 sm:py-6"
            >
              <div className="flex justify-end pt-1">
                <Bone className="h-3 w-8" />
              </div>
              <div className="flex flex-col gap-2">
                <Bone className="h-3 w-28" />
                <Bone className="h-7 w-3/4 max-w-md" />
                <Bone className="h-4 w-full max-w-xl" />
              </div>
            </li>
          ))}
        </ul>
        <Bone className="h-11 w-40" />
      </section>
      <section className="flex flex-col gap-5">
        <Bone className="h-10 w-52" />
        <ul className="flex flex-col">
          {Array.from({ length: 3 }, (_, index) => (
            <li key={index} className="border-t border-border py-5">
              <div className="grid gap-2 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-8">
                <Bone className="h-3 w-20" />
                <div className="flex flex-col gap-2">
                  <Bone className="h-5 w-2/3 max-w-md" />
                  <Bone className="h-4 w-full max-w-xl" />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function ArticleBodyFallback({ label }: { label: string }) {
  return (
    <div
      className="reading-column flex min-h-[28rem] flex-col gap-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">{label}</span>
      <Bone className="h-4 w-24" />
      <Bone className="h-5 w-full" />
      <Bone className="h-5 w-full" />
      <Bone className="h-5 w-5/6" />
      <Bone className="mt-4 h-5 w-full" />
      <Bone className="h-5 w-4/5" />
      <Bone className="h-5 w-full" />
      <Bone className="h-48 w-full rounded-xl" />
    </div>
  );
}
