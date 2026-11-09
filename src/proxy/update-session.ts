import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  sessionCookieNeedsReissue,
  setSessionCookie,
  verifySessionToken,
} from "@/data/session";
import { copyResponseCookies, type ProxyContext } from "./chain";

export async function updateSession(context: ProxyContext) {
  const { request } = context;
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([key, value]) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    },
  );

  // Refresh the Supabase session.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (userId) {
    try {
      const token = request.cookies.get(SESSION_COOKIE)?.value;
      if (await sessionCookieNeedsReissue(token, userId)) {
        const claims = token ? await verifySessionToken(token) : null;
        if (claims && claims.sub === userId) {
          const nextToken = await setSessionCookie(claims, supabaseResponse);
          // Mirror onto the request so later steps and RSC cookies() see it.
          request.cookies.set(SESSION_COOKIE, nextToken);
        }
      }
    } catch {
      // A missing app secret must not drop the Supabase refresh.
    }
  }

  copyResponseCookies(context.response, supabaseResponse);
  context.response = supabaseResponse;
  context.session = undefined;
}
