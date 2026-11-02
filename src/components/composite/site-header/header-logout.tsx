"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { logoutAction } from "@/app/logout/actions";
import { Button } from "@/components/primitive/button/button";
import { cn } from "@/utils/class-names";

export function HeaderLogout({ className }: { className?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "gap-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      disabled={isPending}
      aria-busy={isPending || undefined}
      onClick={() => {
        startTransition(async () => {
          await logoutAction();
        });
      }}
    >
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          <span className="sr-only">Signing out</span>
        </>
      ) : (
        "Log out"
      )}
    </Button>
  );
}
