import { verifyProfileCacheToken, PROFILE_CACHE_COOKIE } from "@/data/session";
import type { ProxyContext } from "./chain";

/**
 * Read the reconciled profile cache once, after `updateSession` verified Auth
 * and cleared/reloaded `yz_profile`. A missing cache means not a finished member.
 */
export async function ensureSession(context: ProxyContext) {
  if (context.session !== undefined) {
    return context.session;
  }

  const token = context.request.cookies.get(PROFILE_CACHE_COOKIE)?.value;
  context.session = token ? await verifyProfileCacheToken(token) : null;
  return context.session;
}
