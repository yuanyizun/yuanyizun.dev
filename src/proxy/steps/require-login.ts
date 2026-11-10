import { redirectPreservingCookies, type ProxyContext } from "../chain";
import { isLoginAllowed, routeAccess } from "../access";

export async function requireLogin(context: ProxyContext) {
  const pathname = context.request.nextUrl.pathname;
  const loggedIn = context.auth?.status === "verified";
  if (isLoginAllowed(pathname, loggedIn)) {
    return;
  }

  return redirectPreservingCookies(
    context.request,
    routeAccess.loginPath,
    context.response,
  );
}
