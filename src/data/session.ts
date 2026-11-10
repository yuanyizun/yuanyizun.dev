import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connection, type NextResponse } from "next/server";
import { authJwtSecretKey } from "@/data/internal/secrets";

/** Short profile cache. Supabase cookies remain the identity session. */
export const PROFILE_CACHE_COOKIE = "yz_profile";
/** Legacy dual-session cookie; cleared on sign-out / reconcile clear. */
const LEGACY_SESSION_COOKIE = "yz_session";
export const PROFILE_CACHE_MAX_AGE = 60 * 15;
export const PROFILE_CACHE_TTL_SECONDS = PROFILE_CACHE_MAX_AGE;

export type ProfileCacheClaims = {
  sub: string;
  username: string;
  /** App role key from public.roles.key — not the Supabase JWT `role`. */
  role: string;
};

function cookieOptions(maxAge = PROFILE_CACHE_MAX_AGE) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
    secure: siteUrl.startsWith("https"),
  };
}

export async function signProfileCacheToken(
  claims: ProfileCacheClaims,
): Promise<string> {
  return new SignJWT({
    username: claims.username,
    role: claims.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${PROFILE_CACHE_TTL_SECONDS}s`)
    .sign(authJwtSecretKey());
}

export async function verifyProfileCacheToken(
  token: string,
): Promise<ProfileCacheClaims | null> {
  try {
    const { payload } = await jwtVerify(token, authJwtSecretKey());
    const sub = payload.sub;
    const username = payload.username;
    const role = payload.role;
    if (
      typeof sub !== "string" ||
      !sub ||
      typeof username !== "string" ||
      !username ||
      typeof role !== "string" ||
      !role
    ) {
      return null;
    }
    return { sub, username, role };
  } catch {
    return null;
  }
}

/** True when the token is missing, invalid, incomplete, or older than the TTL. */
export async function profileCacheIsStale(
  token: string | undefined,
  userId: string,
): Promise<boolean> {
  if (!token) {
    return true;
  }
  try {
    const { payload } = await jwtVerify(token, authJwtSecretKey());
    if (payload.sub !== userId) {
      return true;
    }
    if (typeof payload.username !== "string" || !payload.username) {
      return true;
    }
    if (typeof payload.role !== "string" || !payload.role) {
      return true;
    }
    if (typeof payload.iat !== "number") {
      return true;
    }
    return (
      Math.floor(Date.now() / 1000) - payload.iat >= PROFILE_CACHE_TTL_SECONDS
    );
  } catch {
    return true;
  }
}

export async function getProfileCache(): Promise<ProfileCacheClaims | null> {
  // jose jwtVerify uses new Date() for exp; mark request-bound first.
  await connection();
  const token = (await cookies()).get(PROFILE_CACHE_COOKIE)?.value;

  if (!token) {
    return null;
  }
  return verifyProfileCacheToken(token);
}

export async function setProfileCache(
  claims: ProfileCacheClaims,
  response?: NextResponse,
): Promise<string> {
  const token = await signProfileCacheToken(claims);
  const options = cookieOptions();
  if (response) {
    response.cookies.set(PROFILE_CACHE_COOKIE, token, options);
    return token;
  }
  (await cookies()).set(PROFILE_CACHE_COOKIE, token, options);
  return token;
}

function clearLegacySessionCookie(response?: NextResponse): void {
  if (response) {
    response.cookies.set(LEGACY_SESSION_COOKIE, "", {
      ...cookieOptions(0),
      maxAge: 0,
    });
    return;
  }
}

export async function clearProfileCache(
  response?: NextResponse,
): Promise<void> {
  if (response) {
    response.cookies.set(PROFILE_CACHE_COOKIE, "", {
      ...cookieOptions(0),
      maxAge: 0,
    });
    clearLegacySessionCookie(response);
    return;
  }
  const jar = await cookies();
  jar.delete(PROFILE_CACHE_COOKIE);
  jar.delete(LEGACY_SESSION_COOKIE);
}
