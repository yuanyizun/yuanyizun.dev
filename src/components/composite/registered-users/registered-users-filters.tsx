"use client";

import { useEffect, useRef, useState } from "react";
import type { QueryFilterPatch } from "@/hooks/use-query-filters";
import { Input } from "@/components/primitive/input/input";
import { Label } from "@/components/primitive/label/label";
import {
  registeredUsersParams,
  type RegisteredUsersSelection,
} from "@/utils/registered-users-query";

const debounceMs = 300;

export type RegisteredUsersRoleOption = {
  key: string;
  label: string;
};

export function RegisteredUsersFilters({
  active,
  roles,
  updateFilters,
  isPending,
}: {
  active: RegisteredUsersSelection;
  roles: RegisteredUsersRoleOption[];
  updateFilters: (patch: QueryFilterPatch) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(active.q);
  const [syncedQ, setSyncedQ] = useState(active.q);
  const timerRef = useRef<number | null>(null);

  if (active.q !== syncedQ) {
    setSyncedQ(active.q);
    // Keep the local draft while a debounce is in flight so a late URL
    // commit cannot wipe characters typed after the scheduled write.
    if (timerRef.current === null) {
      setName(active.q);
    }
  }

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function onNameChange(next: string) {
    setName(next);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      updateFilters({
        [registeredUsersParams.q]: next.trim() || null,
        [registeredUsersParams.page]: null,
      });
    }, debounceMs);
  }

  function onRoleChange(next: string) {
    updateFilters({
      [registeredUsersParams.role]: next || null,
      [registeredUsersParams.page]: null,
    });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <Label htmlFor="registered-users-q">Name</Label>
        <Input
          id="registered-users-q"
          type="search"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder="Filter by username"
          aria-busy={isPending || undefined}
          autoComplete="off"
        />
      </div>
      <div className="flex w-full flex-col gap-1.5 sm:w-44">
        <Label htmlFor="registered-users-role">Role</Label>
        <select
          id="registered-users-role"
          value={active.role ?? ""}
          onChange={(event) => onRoleChange(event.target.value)}
          aria-busy={isPending || undefined}
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
        >
          <option value="">All roles</option>
          {roles.map((role) => (
            <option key={role.key} value={role.key}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
