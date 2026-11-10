import "server-only";

import { revalidatePath } from "next/cache";
import { createRole } from "@/data/roles";
import { getCurrentUser } from "@/data/users";
import { canCreateRole } from "@/services/role-policy";
import {
  parseCreateRole,
  type RoleFormState,
} from "@/validation/role";

function isUniqueViolation(code?: string, message?: string): boolean {
  if (code === "23505") {
    return true;
  }
  const lower = (message ?? "").toLowerCase();
  return lower.includes("duplicate") || lower.includes("unique");
}

export async function createAppRole(formData: FormData): Promise<RoleFormState> {
  const actor = await getCurrentUser();
  if (!actor) {
    return { message: "Sign in required." };
  }

  if (!canCreateRole(actor)) {
    return { message: "You cannot create roles." };
  }

  const parsed = parseCreateRole(formData);
  if (!parsed.ok) {
    return parsed.state;
  }

  const result = await createRole(parsed.value);
  if (!result.ok) {
    if (isUniqueViolation(result.error.code, result.error.message)) {
      return {
        errors: { name: "A role with this name already exists." },
      };
    }
    console.error("createRole failed:", result.error.message);
    return { message: "Could not create role. Try again." };
  }

  revalidatePath("/dashboard");
  return {
    ok: true,
    message: "Role created.",
    createdKey: result.role.key,
  };
}
