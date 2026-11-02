import { NextResponse } from "next/server";
import { startGoogleOAuth } from "@/services/auth";

export async function GET() {
  try {
    const url = await startGoogleOAuth();
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.redirect(
      new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
    );
  }
}
