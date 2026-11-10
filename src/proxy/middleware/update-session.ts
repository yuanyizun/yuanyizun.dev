import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  copyResponseCookies,
  type ProxyAuth,
  type ProxyContext,
} from "../chain";

const LEGACY_SESSION_COOKIES = ["yz_profile", "yz_session"] as const;

function classifyGetClaimsResult(result: {
  data: { claims: { sub?: string } } | null;
  error: { name?: string } | null;
}): ProxyAuth {
  const sub = result.data?.claims?.sub;
  if (typeof sub === "string" && sub) {
    return { status: "verified", sub };
  }

  if (result.error?.name === "AuthRetryableFetchError") {
    return { status: "unavailable" };
  }

  return { status: "signed_out" };
}

function expireLegacySessionCookies(
  request: NextRequest,
  response: NextResponse,
) {
  const secure = (process.env.NEXT_PUBLIC_SITE_URL ?? "").startsWith("https")
    ? "; Secure"
    : "";

  for (const name of LEGACY_SESSION_COOKIES) {
    if (!request.cookies.get(name)) {
      continue;
    }
    // Set the header directly. response.cookies.delete also writes
    // x-middleware-set-cookie, and the dev server emits that a second time.
    response.headers.append(
      "set-cookie",
      `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; SameSite=lax${secure}`,
    );
  }
}

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

  const claimsResult = await supabase.auth.getClaims();
  const auth = classifyGetClaimsResult(claimsResult);
  expireLegacySessionCookies(request, supabaseResponse);

  copyResponseCookies(context.response, supabaseResponse);
  context.response = supabaseResponse;
  context.auth = auth;
}
