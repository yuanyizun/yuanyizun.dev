import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connection, type NextResponse } from "next/server";

export const SESSION_COOKIE = "yz_session";
const SESSION_MAX_AGE = 60 * 60 * 24;
const SESSION_REFRESH_WINDOW = 60 * 60;

export type SessionClaims = {
  sub: string;
  username: string;
};

function secretKey() {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_JWT_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}

function cookieOptions() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE,
    secure: siteUrl.startsWith("https"),
  };
}

export async function signSessionToken(
  claims: SessionClaims,
): Promise<string> {
  return new SignJWT({ username: claims.username })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(secretKey());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const sub = payload.sub;
    const username = payload.username;
    if (
      typeof sub !== "string" ||
      !sub ||
      typeof username !== "string" ||
      !username
    ) {
      return null;
    }
    return { sub, username };
  } catch {
    return null;
  }
}

export async function sessionCookieNeedsReissue(
  token: string | undefined,
  userId: string,
): Promise<boolean> {
  if (!token) {
    return true;
  }
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (payload.sub !== userId) {
      return true;
    }
    if (typeof payload.username !== "string" || !payload.username) {
      return true;
    }
    if (typeof payload.exp !== "number") {
      return true;
    }
    return payload.exp - Math.floor(Date.now() / 1000) < SESSION_REFRESH_WINDOW;
  } catch {
    return true;
  }
}

export async function getSessionFromCookie(): Promise<SessionClaims | null> {
  // jose jwtVerify uses new Date() for exp; mark request-bound first.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }
  return verifySessionToken(token);
}

export async function setSessionCookie(
  claims: SessionClaims,
  response?: NextResponse,
): Promise<string> {
  const token = await signSessionToken(claims);
  const options = cookieOptions();
  if (response) {
    response.cookies.set(SESSION_COOKIE, token, options);
    return token;
  }
  (await cookies()).set(SESSION_COOKIE, token, options);
  return token;
}

export async function clearSessionCookie(
  response?: NextResponse,
): Promise<void> {
  if (response) {
    response.cookies.set(SESSION_COOKIE, "", {
      ...cookieOptions(),
      maxAge: 0,
    });
    return;
  }
  (await cookies()).delete(SESSION_COOKIE);
}
