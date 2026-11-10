"use client";

import { useState, useTransition } from "react";
import { updateRegisteredUserRoleAction } from "@/services/actions/user-actions";
import { cn } from "@/utils/class-names";
import type { RegisteredUsersRoleOption } from "./registered-users-filters";

export function RegisteredUserRoleSelect({
  userId,
  username,
  roleKey,
  roles,
  className,
}: {
  userId: string;
  username: string | null;
  roleKey: string;
  roles: RegisteredUsersRoleOption[];
  className?: string;
}) {
  const [value, setValue] = useState(roleKey);
  const [syncedKey, setSyncedKey] = useState(roleKey);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const label = username ?? "Pending username";

  if (roleKey !== syncedKey) {
    setSyncedKey(roleKey);
    if (!isPending) {
      setValue(roleKey);
    }
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label className="sr-only" htmlFor={`registered-user-role-${userId}`}>
        Role for {label}
      </label>
      <select
        id={`registered-user-role-${userId}`}
        value={value}
        disabled={isPending || roles.length === 0}
        aria-busy={isPending || undefined}
        onChange={(event) => {
          const next = event.target.value;
          if (next === value) {
            return;
          }
          const previous = value;
          setError(null);
          setValue(next);
          startTransition(async () => {
            const result = await updateRegisteredUserRoleAction(userId, next);
            if (!result.ok) {
              setError(result.message);
              setValue(previous);
            }
          });
        }}
        className="h-8 w-full max-w-[11rem] min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
      >
        {roles.map((role) => (
          <option key={role.key} value={role.key}>
            {role.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
