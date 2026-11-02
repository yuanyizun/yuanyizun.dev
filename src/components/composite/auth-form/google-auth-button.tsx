"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/primitive/button";
import { cn } from "@/utils/class-names";

export function GoogleAuthButton({
  idleLabel,
  pendingLabel,
  disabled = false,
  onBusyChange,
  className,
}: {
  idleLabel: string;
  pendingLabel: string;
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
  className?: string;
}) {
  const [busy, setBusy] = useState(false);

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={cn("h-11 w-full gap-2 text-base", className)}
      onClick={() => {
        setBusy(true);
        onBusyChange?.(true);
        // Route handler redirects to Google — hard nav avoids RSC payload fetch.
        window.location.assign("/auth/google");
      }}
    >
      {busy ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {pendingLabel}
        </>
      ) : (
        idleLabel
      )}
    </Button>
  );
}
