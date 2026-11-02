import { Suspense, ViewTransition } from "react";
import { Loader2 } from "lucide-react";
import { ButtonLink } from "@/components/primitive/button/button";
import { HeaderLogout } from "@/components/composite/site-header/header-logout";
import { getSessionFromCookie } from "@/services/session";
import { cn } from "@/utils/class-names";

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
      className={cn("inline-flex min-h-11 items-center gap-2", className)}
    >
      <span
        className="h-4 w-28 rounded-md bg-muted motion-safe:animate-pulse"
        aria-hidden
      />
      <span
        className="inline-flex min-h-11 min-w-[5.75rem] items-center justify-center rounded-md border border-foreground/15"
        aria-hidden
      >
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </span>
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
