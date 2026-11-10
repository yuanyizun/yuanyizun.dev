"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/primitive/button/button";
import { deleteRegisteredUserAction } from "@/services/actions/user-actions";
import { cn } from "@/utils/class-names";

export function DeleteRegisteredUserButton({
  id,
  username,
  className,
}: {
  id: string;
  username: string | null;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const label = username ?? "this user";

  if (!confirming) {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn("min-h-9 px-3 text-xs", className)}
        onClick={() => {
          setError(null);
          setConfirming(true);
        }}
      >
        Delete
      </Button>
    );
  }

  return (
    <div className={cn("flex flex-col items-end gap-2", className)}>
      <p className="max-w-[12rem] text-right text-xs text-muted-foreground">
        Delete {label}?
      </p>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          className="min-h-9 px-3 text-xs disabled:pointer-events-none disabled:opacity-50"
          disabled={isPending}
          aria-busy={isPending || undefined}
          onClick={() => {
            setError(null);
            startTransition(async () => {
              const result = await deleteRegisteredUserAction(id);
              if (!result.ok) {
                setError(result.message);
                return;
              }
              setConfirming(false);
            });
          }}
        >
          {isPending ? "Deleting…" : "Confirm"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="min-h-9 px-3 text-xs disabled:pointer-events-none disabled:opacity-50"
          disabled={isPending}
          onClick={() => {
            setError(null);
            setConfirming(false);
          }}
        >
          Cancel
        </Button>
      </div>
      {error ? (
        <p className="max-w-[14rem] text-right text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
