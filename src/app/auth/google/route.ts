import { NextResponse, type NextRequest } from "next/server";
import { startGoogleOAuth } from "@/services/auth";
import { createClientForResponse } from "@/utils/supabase/server";

function siteOrigin() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3002"
  );
}

export async function GET(request: NextRequest) {
  const loginUrl = new URL("/login", siteOrigin());
  const response = NextResponse.redirect(loginUrl);

  try {
    const supabase = createClientForResponse(request, response);
    const url = await startGoogleOAuth(supabase);
    response.headers.set("location", url);
    return response;
  } catch {
    return NextResponse.redirect(loginUrl);
  }
}
