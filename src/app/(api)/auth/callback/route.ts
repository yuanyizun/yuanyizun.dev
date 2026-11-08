import { NextResponse, type NextRequest } from "next/server";
import { loadCurrentUser } from "@/data/users";
import { exchangeAuthCode } from "@/services/auth";
import { setSessionCookie } from "@/services/session";
import { createClientForResponse } from "@/utils/supabase/server";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = siteOrigin();
  const loginUrl = new URL("/login", origin);

  if (!code) {
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.redirect(loginUrl);
  const supabase = createClientForResponse(request, response);

  try {
    await exchangeAuthCode(supabase, code);
  } catch {
    return NextResponse.redirect(loginUrl);
  }

  const user = await loadCurrentUser(supabase);
  const destination = user?.username
    ? new URL("/", origin)
    : new URL("/register/username", origin);
  response.headers.set("location", destination.toString());

  if (user?.username) {
    await setSessionCookie({ sub: user.id, username: user.username }, response);
  }

  return response;
}
