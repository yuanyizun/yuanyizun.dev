import { NextResponse } from "next/server";
import {
  authorizationFor,
  isAuthorized,
  pathMatches,
  routeAccess,
} from "./access";
import {
  copyResponseCookies,
  redirectPreservingCookies,
  type ProxyContext,
} from "./chain";
import { ensureSession } from "./ensure-session";

export async function authorize(context: ProxyContext) {
  const pathname = context.request.nextUrl.pathname;
  const rule = authorizationFor(pathname);
  if (!rule || isAuthorized(pathname, await ensureSession(context))) {
    return;
  }

  const session = context.session;
  if (!session) {
    return redirectPreservingCookies(
      context.request,
      routeAccess.loginPath,
      context.response,
    );
  }

  if (pathMatches(routeAccess.denyPath, rule)) {
    const response = new NextResponse(null, { status: 403 });
    copyResponseCookies(context.response, response);
    return response;
  }

  return redirectPreservingCookies(
    context.request,
    routeAccess.denyPath,
    context.response,
  );
}
