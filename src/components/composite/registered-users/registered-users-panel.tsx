"use client";

import Link from "next/link";
import { useQueryFilters } from "@/hooks/use-query-filters";
import { formatDisplayDate } from "@/utils/date";
import {
  hasRegisteredUsersFilters,
  type RegisteredUsersSelection,
} from "@/utils/registered-users-query";
import { DeleteRegisteredUserButton } from "./delete-registered-user-button";
import { RegisteredUserRoleSelect } from "./registered-user-role-select";
import {
  RegisteredUsersFilters,
  type RegisteredUsersRoleOption,
} from "./registered-users-filters";

export type RegisteredUserItem = {
  id: string;
  username: string | null;
  roleKey: string;
  roleLabel: string;
  createdAt: string;
};

export function RegisteredUsersPanel({
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
  const { updateFilters, isPending } = useQueryFilters();
  const filtered = hasRegisteredUsersFilters(active);

  return (
    <section className="flex w-full flex-col gap-5 rounded-xl border border-foreground/15 p-5">
      <RegisteredUsersFilters
        active={active}
        roles={roles}
        updateFilters={updateFilters}
        isPending={isPending}
      />
      <div
        aria-busy={isPending || undefined}
        className={
          isPending
            ? "opacity-60 transition-opacity duration-200"
            : "transition-opacity duration-200"
        }
      >
        {isPending ? <span className="sr-only">Updating results…</span> : null}
        <RegisteredUsersResults
          users={users}
          roles={roles}
          currentUserId={currentUserId}
          error={error}
          filtered={filtered}
        />
      </div>
    </section>
  );
}

function RegisteredUsersResults({
  users,
  roles,
  currentUserId,
  error,
  filtered,
}: {
  users: RegisteredUserItem[];
  roles: RegisteredUsersRoleOption[];
  currentUserId: string;
  error: boolean;
  filtered: boolean;
}) {
  if (error) {
    return <p className="text-sm text-muted-foreground">Could not load users.</p>;
  }

  if (users.length === 0) {
    if (filtered) {
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            No users match these filters.
          </p>
          <Link
            href="/dashboard"
            prefetch={false}
            className="inline-flex text-sm text-foreground no-underline hover:text-primary"
          >
            Clear filters
          </Link>
        </div>
      );
    }

    return (
      <p className="text-sm text-muted-foreground">No registered users yet.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {users.map((user) => {
        const name = user.username ?? "Pending username";
        const you = user.id === currentUserId;

        return (
          <li
            key={user.id}
            className="flex items-start justify-between gap-4 rounded-xl bg-card px-5 py-4"
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
              <RegisteredUserRoleSelect
                userId={user.id}
                username={user.username}
                roleKey={user.roleKey}
                roles={roles}
              />
              <time
                dateTime={user.createdAt}
                className="font-mono text-xs text-muted-foreground"
              >
                {formatDisplayDate(user.createdAt)}
              </time>
            </div>
            <DeleteRegisteredUserButton
              id={user.id}
              username={user.username}
              className="shrink-0"
            />
          </li>
        );
      })}
    </ul>
  );
}
