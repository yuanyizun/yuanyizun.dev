import type { AppRole } from "@/data/roles";
import type { RoleFormState } from "@/validation/role";
import { RolesCreateForm } from "./roles-create-form";

function Bone({ className }: { className?: string }) {
  return <div className={`rounded-xl bg-card ${className ?? ""}`} aria-hidden />;
}

export function RolesManageSkeleton() {
  return (
    <section
      className="flex w-full flex-col gap-5 rounded-xl border border-foreground/15 p-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="sr-only">Loading roles…</span>
      <div className="flex flex-col gap-2">
        <Bone className="h-7 w-28" />
        <Bone className="h-4 w-56" />
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-16 w-full" />
        <Bone className="h-16 w-full" />
      </div>
      <div className="flex flex-col gap-3">
        <Bone className="h-14 w-full" />
        <Bone className="h-24 w-full" />
        <Bone className="h-11 w-28" />
      </div>
    </section>
  );
}

export function RolesManage({
  roles,
  action,
}: {
  roles: AppRole[];
  action: (state: RoleFormState, formData: FormData) => Promise<RoleFormState>;
}) {
  return (
    <section className="flex w-full flex-col gap-5 rounded-xl border border-foreground/15 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-medium tracking-tight">Roles</h2>
        <p className="text-sm text-muted-foreground">
          Roles available for accounts on this site.
        </p>
      </div>

      <RolesList roles={roles} />

      <div className="flex flex-col gap-3 border-t border-foreground/10 pt-5">
        <h3 className="font-heading text-base font-medium tracking-tight">
          Add a role
        </h3>
        <RolesCreateForm action={action} />
      </div>
    </section>
  );
}

function RolesList({ roles }: { roles: AppRole[] }) {
  if (roles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No roles yet.</p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {roles.map((role) => (
        <li
          key={role.key}
          className="flex flex-col gap-1 rounded-xl border border-foreground/10 px-4 py-3"
        >
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="font-medium text-foreground">{role.label}</span>
            <span className="font-mono text-xs text-muted-foreground">
              {role.key}
            </span>
          </div>
          {role.description ? (
            <p className="text-sm text-muted-foreground">{role.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
