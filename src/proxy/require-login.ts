import { isLoginAllowed, pathnameRequiresLogin, routeAccess } from "./access";
import { redirectPreservingCookies, type ProxyContext } from "./chain";
import { ensureSession } from "./ensure-session";

export async function requireLogin(context: ProxyContext) {
  const pathname = context.request.nextUrl.pathname;
  if (!pathnameRequiresLogin(pathname)) {
    return;
  }

  const session = await ensureSession(context);
  if (isLoginAllowed(pathname, session)) {
    return;
  }

  return redirectPreservingCookies(
    context.request,
    routeAccess.loginPath,
    context.response,
  );
}
