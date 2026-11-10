import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import {
  RegisteredUsers,
  RegisteredUsersSkeleton,
} from "@/components/composite/registered-users/registered-users";
import { getProfileCache } from "@/data/session";
import { listAppRoles, listRegisteredUsers } from "@/data/users";
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
  // Keep the cookie read (and the list fetch) inside Suspense for Cache Components.
  const [raw, profile, roles] = await Promise.all([
    searchParams,
    getProfileCache(),
    listAppRoles(),
  ]);

  if (!profile) {
    redirect("/login");
  }

  const filters = parseRegisteredUsersQuery(
    raw,
    roles.map((role) => role.key),
  );
  const result = await listRegisteredUsers(filters);

  if (!result.ok) {
    return (
      <RegisteredUsers
        active={filters}
        roles={roles}
        users={[]}
        currentUserId={profile.sub}
        error
      />
    );
  }

  return (
    <RegisteredUsers
      active={filters}
      roles={roles}
      users={result.users}
      currentUserId={profile.sub}
    />
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
      <Suspense fallback={<RegisteredUsersSkeleton />}>
        <DashboardBody searchParams={searchParams} />
      </Suspense>
    </PageFrame>
  );
}
