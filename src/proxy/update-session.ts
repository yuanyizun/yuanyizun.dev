import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  sessionCookieNeedsReissue,
  setSessionCookie,
  verifySessionToken,
} from "@/data/session";

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}

function redirectToLogin(request: NextRequest, from: NextResponse) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  from.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}

export async function updateSession(request: NextRequest) {
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
          // Mirror onto the request so RSC cookies() sees it on this same pass.
          request.cookies.set(SESSION_COOKIE, nextToken);
        }
      }
    } catch {
      // A missing app secret must not drop the Supabase refresh.
    }
  }

  // Guard private routes before any page render (avoids a content flash).
  if (isDashboardPath(request.nextUrl.pathname)) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const claims = token ? await verifySessionToken(token) : null;
    if (!claims) {
      return redirectToLogin(request, supabaseResponse);
    }
  }

  return supabaseResponse;
}
