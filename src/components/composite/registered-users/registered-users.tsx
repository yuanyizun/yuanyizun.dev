import type { RegisteredUsersSelection } from "@/utils/registered-users-query";
import {
  RegisteredUsersPanel,
  type RegisteredUserItem,
} from "./registered-users-panel";
import type { RegisteredUsersRoleOption } from "./registered-users-filters";

export type { RegisteredUserItem };

function Bone({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-card ${className ?? ""}`} aria-hidden />;
}

export function RegisteredUsersSkeleton() {
  return (
    <section
      className="flex max-w-xl flex-col gap-5 rounded-xl border border-foreground/15 p-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading registered users…</span>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Bone className="h-14 flex-1" />
        <Bone className="h-14 w-full sm:w-44" />
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-[4.5rem] w-full" />
        <Bone className="h-[4.5rem] w-full" />
        <Bone className="h-[4.5rem] w-full" />
      </div>
    </section>
  );
}

export function RegisteredUsers({
  active,
  roles,
  users,
  currentUserId,
  error = false,
}: {
  active: RegisteredUsersSelection;
  roles: RegisteredUsersRoleOption[];
  users: RegisteredUserItem[];
  currentUserId: string;
  error?: boolean;
}) {
  return (
    <RegisteredUsersPanel
      active={active}
      roles={roles}
      users={users}
      currentUserId={currentUserId}
      error={error}
    />
  );
}
