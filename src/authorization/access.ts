import { defineAccess } from "rbac";

export const access = defineAccess({
  permissions: [
    "user_view",
    "user_delete",
    "user_update_role",
    "role_view",
    "role_create",
  ],
  roles: {
    admin: "*",
    member: [],
  },
});
