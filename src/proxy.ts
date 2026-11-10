import { type NextRequest } from "next/server";
import { runProxy } from "./proxy/chain";
import { requireLogin } from "./proxy/middleware/require-login";
import { updateSession } from "./proxy/middleware/update-session";

export async function proxy(request: NextRequest) {
  // Refresh cookies before any check that reads them. Append a step to extend the chain.
  return runProxy(request, [updateSession, requireLogin]);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static assets and images.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
