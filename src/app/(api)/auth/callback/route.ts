import { NextResponse, type NextRequest } from "next/server";
import { exchangeAuthCode } from "@/services/auth";

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

  try {
    const destination = await exchangeAuthCode(code);
    return NextResponse.redirect(destination);
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
