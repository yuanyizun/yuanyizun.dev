import { NextResponse, type NextRequest } from "next/server";
import type { ProfileCacheClaims } from "@/data/session";

export type ProxyContext = {
  readonly request: NextRequest;
  response: NextResponse;
  /**
   * Reconciled profile cache for this request. `undefined` means unread.
   * `updateSession` clears the memo after Auth verify + cache reconcile.
   */
  session: ProfileCacheClaims | null | undefined;
};

/** Return a response to stop the pipeline. Return nothing to continue. */
export type ProxyStep = (
  context: ProxyContext,
) => Promise<NextResponse | undefined | void>;

export function copyResponseCookies(from: NextResponse, to: NextResponse) {
  if (from === to) {
    return;
  }
  const existing = new Set(to.cookies.getAll().map((cookie) => cookie.name));
  for (const cookie of from.cookies.getAll()) {
    if (!existing.has(cookie.name)) {
      to.cookies.set(cookie);
    }
  }
}

export function redirectPreservingCookies(
  request: NextRequest,
  pathname: string,
  from: NextResponse,
) {
  const response = NextResponse.redirect(new URL(pathname, request.url));
  copyResponseCookies(from, response);
  return response;
}

export async function runProxy(
  request: NextRequest,
  steps: readonly ProxyStep[],
): Promise<NextResponse> {
  const context: ProxyContext = {
    request,
    response: NextResponse.next({ request }),
    session: undefined,
  };

  for (const step of steps) {
    const terminal = await step(context);
    if (terminal) {
      copyResponseCookies(context.response, terminal);
      return terminal;
    }
  }

  return context.response;
}
