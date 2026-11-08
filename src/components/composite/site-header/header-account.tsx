import "server-only";

import { Suspense, ViewTransition } from "react";
import { ButtonLink } from "@/components/primitive/button/button";
import { getSessionFromCookie } from "@/data/session";
import { cn } from "@/utils/class-names";
import { HeaderLogout } from "./header-logout";

export function HeaderSignIn({ className }: { className?: string }) {
  return (
    <ButtonLink href="/login" variant="outline" className={className}>
      Sign in
    </ButtonLink>
  );
}

export function HeaderAccountFallback({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("inline-flex min-h-11 items-center", className)}
    >
      <span
        className="h-11 w-28 rounded-md bg-card"
        aria-hidden
      />
      <span className="sr-only">Loading account</span>
    </div>
  );
}

export async function HeaderAccount({ className }: { className?: string }) {
  const session = await getSessionFromCookie();

  if (!session) {
    return <HeaderSignIn className={className} />;
  }

  return (
    <div
      className={cn(
        "inline-flex min-h-11 items-center gap-2 text-sm text-foreground",
        className,
      )}
    >
      <span>hello, {session.username}</span>
      <HeaderLogout />
    </div>
  );
}

export function HeaderAccountSection({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex min-h-11 items-center", className)}>
      <Suspense
        fallback={
          <ViewTransition exit="header-account-exit" default="none">
            <HeaderAccountFallback />
          </ViewTransition>
        }
      >
        <ViewTransition enter="header-account-enter" default="none">
          <HeaderAccount />
        </ViewTransition>
      </Suspense>
    </div>
  );
}
