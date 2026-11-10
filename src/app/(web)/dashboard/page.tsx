import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { ProfileEditForm } from "@/components/composite/profile-edit-form/profile-edit-form";
import {
  RegisteredUsers,
  RegisteredUsersSkeleton,
} from "@/components/composite/registered-users/registered-users";
import { getCurrentUser, listAppRoles, listRegisteredUsers } from "@/data/users";
import { updateProfileAction } from "@/services/auth-actions";
import { parseRegisteredUsersQuery } from "@/utils/registered-users-query";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardBody({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Proxy already redirects visitors without a reconciled profile cache.
  // Keep verified user + list fetch inside Suspense for Cache Components.
  const [raw, user, roles] = await Promise.all([
    searchParams,
    getCurrentUser(),
    listAppRoles(),
  ]);

  if (!user) {
    redirect("/login");
  }
  if (!user.username) {
    redirect("/register/username");
  }

  const filters = parseRegisteredUsersQuery(
    raw,
    roles.map((role) => role.key),
  );
  const result = await listRegisteredUsers(filters);
  const roleLabel =
    roles.find((role) => role.key === user.roleKey)?.label ?? user.roleKey;

  return (
    <div className="flex flex-col gap-8">
      <ProfileEditForm
        action={updateProfileAction}
        defaults={{
          username: user.username,
          email: user.email,
          roleKey: user.roleKey,
          roleLabel,
        }}
      />
      {result.ok ? (
        <RegisteredUsers
          active={filters}
          roles={roles}
          users={result.users}
          currentUserId={user.id}
        />
      ) : (
        <RegisteredUsers
          active={filters}
          roles={roles}
          users={[]}
          currentUserId={user.id}
          error
        />
      )}
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="flex flex-col gap-8">
      <section
        className="flex max-w-xl flex-col gap-5 rounded-xl border border-foreground/15 p-5"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span className="sr-only">Loading profile…</span>
        <div className="flex flex-col gap-2">
          <div className="h-7 w-40 rounded-xl bg-card" aria-hidden />
          <div className="h-4 w-64 rounded-xl bg-card" aria-hidden />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-14 w-full rounded-xl bg-card" aria-hidden />
          <div className="h-14 w-full rounded-xl bg-card" aria-hidden />
          <div className="h-14 w-full rounded-xl bg-card" aria-hidden />
          <div className="h-11 w-28 rounded-xl bg-card" aria-hidden />
        </div>
      </section>
      <RegisteredUsersSkeleton />
    </div>
  );
}

export default function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
  // Paint PageFrame immediately. Signed-out visitors never reach this route
  // (proxy requireLogin), so the old null outer fallback only caused a blank
  // → chrome pop for signed-in refreshes.
  return (
    <PageFrame
      template="dashboard"
      props={{
        PageIntro: {
          title: "Dashboard",
          summary: "Accounts registered on this site.",
        },
      }}
    >
      <Suspense fallback={<DashboardFallback />}>
        <DashboardBody searchParams={searchParams} />
      </Suspense>
    </PageFrame>
  );
}
