import "server-only";

import type { ReactNode } from "react";
import { ButtonLink } from "@/components/primitive/button/button";
import { getCurrentUser } from "@/data/users";
import { cn } from "@/utils/class-names";

type AuthPlaceholderProps = {
  message: string;
  href?: string;
  label?: string;
  className?: string;
};

/** Paper sticker shown when a visitor is not signed in. */
export function AuthPlaceholder({
  message,
  href = "/login",
  label = "Sign in",
  className,
}: AuthPlaceholderProps) {
  return (
    <div className={cn("relative max-w-md py-8", className)}>
      <span
        aria-hidden
        className="absolute -top-1 left-[18%] z-10 h-3.5 w-14 -rotate-3 bg-card/90 shadow-sm ring-1 ring-border"
      />
      <div
        className="-rotate-2 bg-background px-6 py-5 ring-1 ring-border shadow-[3px_4px_0_color-mix(in_srgb,var(--foreground)_18%,transparent)] sm:px-8 sm:py-7"
        role="status"
      >
        <p className="font-mono text-[0.7rem] tracking-[0.14em] text-muted-foreground uppercase">
          Members only
        </p>
        <p className="mt-3 font-heading text-[clamp(1.65rem,3.2vw,2.35rem)] italic leading-[1.05] tracking-[-0.02em] text-primary">
          {message}
        </p>
        <div className="mt-6">
          <ButtonLink href={href}>{label}</ButtonLink>
        </div>
      </div>
    </div>
  );
}

export function AuthPlaceholderFallback({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn("relative max-w-md py-8", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Checking access…</span>
      <div
        className="-rotate-2 space-y-4 bg-card/60 px-6 py-5 ring-1 ring-border sm:px-8 sm:py-7"
        aria-hidden
      >
        <div className="h-3 w-24 rounded bg-card" />
        <div className="h-10 w-11/12 rounded-xl bg-card" />
        <div className="h-10 w-4/5 rounded-xl bg-card" />
        <div className="mt-2 h-11 w-28 rounded-md bg-card" />
      </div>
    </div>
  );
}

/**
 * Renders `children` when a database user exists.
 * A missing user renders `placeholder`, or nothing when that prop is omitted.
 * This component does not check permissions and does not redirect.
 */
export async function Auth({
  placeholder = null,
  children,
}: {
  placeholder?: ReactNode;
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return placeholder;
  }

  return children;
}
