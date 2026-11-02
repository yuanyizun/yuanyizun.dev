import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  sessionCookieNeedsReissue,
  setSessionCookie,
} from "@/services/session";

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

  // Refresh the Supabase session. Do not authorize routes here.
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;
  if (!userId) {
    return supabaseResponse;
  }

  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!(await sessionCookieNeedsReissue(token, userId))) {
      return supabaseResponse;
    }

    const { data: profile, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", userId)
      .maybeSingle();
    const username = profile?.username;
    if (error || typeof username !== "string" || !username) {
      return supabaseResponse;
    }

    const nextToken = await setSessionCookie(
      { sub: userId, username },
      supabaseResponse,
    );
    // Mirror onto the request so RSC cookies() sees it on this same pass.
    request.cookies.set(SESSION_COOKIE, nextToken);
  } catch {
    // A missing app secret or profile read must not drop the Supabase refresh.
  }

  return supabaseResponse;
}
