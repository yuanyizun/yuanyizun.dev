import { NextResponse } from "next/server";
import { startGoogleOAuth } from "@/services/domain/auth";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
}

export async function GET() {
  const loginUrl = new URL("/login", siteOrigin());

  try {
    const url = await startGoogleOAuth();
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
