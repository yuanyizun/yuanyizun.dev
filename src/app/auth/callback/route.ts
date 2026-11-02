import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/data/users";
import { exchangeAuthCode } from "@/services/auth";
import { setSessionCookie } from "@/services/session";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = siteOrigin();

  if (!code) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    await exchangeAuthCode(code);
  } catch {
    return NextResponse.redirect(new URL("/login", origin));
  }

  const user = await getCurrentUser();
  if (!user?.username) {
    return NextResponse.redirect(new URL("/register/username", origin));
  }

  const response = NextResponse.redirect(new URL("/", origin));
  await setSessionCookie({ sub: user.id, username: user.username }, response);
  return response;
}
