import { verifySessionToken, SESSION_COOKIE } from "@/data/session";
import type { ProxyContext } from "./chain";

/** Verify the app session cookie once, after `updateSession` may have reissued it. */
export async function ensureSession(context: ProxyContext) {
  if (context.session !== undefined) {
    return context.session;
  }

  const token = context.request.cookies.get(SESSION_COOKIE)?.value;
  context.session = token ? await verifySessionToken(token) : null;
  return context.session;
}
