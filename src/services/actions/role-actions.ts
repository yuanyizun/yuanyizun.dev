"use server";

import { createAppRole } from "@/services/domain/roles";
import { parseCreateRole, type RoleFormState } from "@/validation/role";

export async function createRoleAction(
  _state: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  const parsed = parseCreateRole(formData);
  if (!parsed.ok) return parsed.state;
  return createAppRole(parsed.value);
}
