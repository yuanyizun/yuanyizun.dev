import "server-only";

import type { ReactNode } from "react";
import { access } from "@/authorization/access";
import { getCurrentUser } from "@/data/users";

/**
 * Renders `children` when the database user has `permission`.
 * A missing user and a missing permission both render `placeholder`, or nothing when that prop is omitted.
 * This component does not redirect. Pages that must be signed in use `<Auth>` or `requireUser()`.
 */
export async function HasPermission({
  permission,
  placeholder = null,
  children,
}: {
  permission: string;
  placeholder?: ReactNode;
  children: ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || !access.has(permission, user)) {
    return placeholder;
  }

  return children;
}
