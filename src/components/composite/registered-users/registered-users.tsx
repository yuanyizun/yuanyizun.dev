import { formatDisplayDate } from "@/utils/date";

export type RegisteredUserItem = {
  id: string;
  username: string | null;
  roleLabel: string;
  createdAt: string;
};

function Bone({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-card ${className ?? ""}`} aria-hidden />;
}

export function RegisteredUsersSkeleton() {
  return (
    <section
      className="flex max-w-xl flex-col gap-3"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading registered users…</span>
      <Bone className="h-[4.5rem] w-full" />
      <Bone className="h-[4.5rem] w-full" />
      <Bone className="h-[4.5rem] w-full" />
    </section>
  );
}

export function RegisteredUsers({
  users,
  currentUserId,
  error = false,
}: {
  users: RegisteredUserItem[];
  currentUserId: string;
  error?: boolean;
}) {
  if (error) {
    return <p className="text-sm text-muted-foreground">Could not load users.</p>;
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No registered users yet.</p>
    );
  }

  return (
    <ul className="flex max-w-xl flex-col gap-3">
      {users.map((user) => {
        const name = user.username ?? "Pending username";
        const you = user.id === currentUserId;

        return (
          <li
            key={user.id}
            className="flex items-baseline justify-between gap-4 rounded-xl bg-card px-5 py-4"
          >
            <div className="flex min-w-0 flex-col gap-1">
              <span className="truncate font-heading text-2xl tracking-heading text-foreground">
                {name}
                {you ? (
                  <span className="ml-3 align-middle font-mono text-xs tracking-[0.14em] text-primary uppercase">
                    You
                  </span>
                ) : null}
              </span>
              <span className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
                {user.roleLabel}
              </span>
            </div>
            <time
              dateTime={user.createdAt}
              className="shrink-0 font-mono text-xs text-muted-foreground"
            >
              {formatDisplayDate(user.createdAt)}
            </time>
          </li>
        );
      })}
    </ul>
  );
}
