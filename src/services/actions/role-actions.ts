"use server";

import { createAppRole } from "@/services/domain/roles";
import type { RoleFormState } from "@/validation/role";

export async function createRoleAction(
  _state: RoleFormState,
  formData: FormData,
): Promise<RoleFormState> {
  return createAppRole(formData);
}
