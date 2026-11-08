import "server-only";

export function authJwtSecretKey(): Uint8Array {
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_JWT_SECRET must be set to at least 32 characters.");
  }
  return new TextEncoder().encode(secret);
}
