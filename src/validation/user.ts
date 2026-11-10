const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Untrusted ids from bind / action args — allowlist UUID only. */
export function parseUserId(id: unknown): string | null {
  if (typeof id !== "string") {
    return null;
  }
  const trimmed = id.trim();
  if (!trimmed || trimmed.length > 36 || !UUID_RE.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}
