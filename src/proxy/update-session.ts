import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { loadProfileCacheFields } from "@/data/users";
import {
  PROFILE_CACHE_COOKIE,
  clearProfileCache,
  profileCacheIsStale,
  setProfileCache,
  verifyProfileCacheToken,
} from "@/data/session";
import { copyResponseCookies, type ProxyContext } from "./chain";
import {
  reconcileProfileCache,
  type SupabaseAuthCheck,
} from "./reconcile-session";

function classifyGetClaimsResult(result: {
  data: { claims: { sub?: string } } | null;
  error: { name?: string } | null;
}): SupabaseAuthCheck {
  const sub = result.data?.claims?.sub;
  if (typeof sub === "string" && sub) {
    return { status: "verified", sub };
  }

  if (result.error?.name === "AuthRetryableFetchError") {
    return { status: "unavailable" };
  }

  return { status: "signed_out" };
}

async function applyClear(
  context: ProxyContext,
  response: NextResponse,
): Promise<void> {
  await clearProfileCache(response);
  context.request.cookies.delete(PROFILE_CACHE_COOKIE);
}

async function applyReload(
  context: ProxyContext,
  response: NextResponse,
  supabase: ReturnType<typeof createServerClient>,
  userId: string,
): Promise<void> {
  try {
    const profile = await loadProfileCacheFields(supabase, userId);
    if (!profile) {
      await applyClear(context, response);
      return;
    }

    const nextToken = await setProfileCache(
      {
        sub: userId,
        username: profile.username,
        role: profile.roleKey,
      },
      response,
    );
    context.request.cookies.set(PROFILE_CACHE_COOKIE, nextToken);
  } catch {
    // A missing app secret or profile read must not drop the Supabase refresh.
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
  const token = request.cookies.get(PROFILE_CACHE_COOKIE)?.value;
  const cache = token ? await verifyProfileCacheToken(token) : null;
  const stale =
    auth.status === "verified"
      ? await profileCacheIsStale(token, auth.sub)
      : !cache;

  const decision = reconcileProfileCache({ auth, cache, stale });

  if (decision === "clear") {
    await applyClear(context, supabaseResponse);
  } else if (decision === "reload" && auth.status === "verified") {
    await applyReload(context, supabaseResponse, supabase, auth.sub);
  }

  copyResponseCookies(context.response, supabaseResponse);
  context.response = supabaseResponse;
  context.session = undefined;
}
