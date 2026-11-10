import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import {
  RegisteredUsers,
  RegisteredUsersSkeleton,
} from "@/components/composite/registered-users/registered-users";
import { getProfileCache } from "@/data/session";
import { listRegisteredUsers } from "@/data/users";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardUsers({ currentUserId }: { currentUserId: string }) {
  const result = await listRegisteredUsers();
  if (!result.ok) {
    return <RegisteredUsers users={[]} currentUserId={currentUserId} error />;
  }
  return (
    <RegisteredUsers users={result.users} currentUserId={currentUserId} />
  );
}

async function DashboardGate() {
  // Proxy redirects visitors without a reconciled profile cache before render.
  // Keep the cookie read inside Suspense for Cache Components.
  const profile = await getProfileCache();
  if (!profile) {
    redirect("/login");
  }

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
        <DashboardUsers currentUserId={profile.sub} />
      </Suspense>
    </PageFrame>
  );
}

export default function DashboardPage() {
  // No dashboard chrome in the outer fallback — a signed-out flash would
  // otherwise show the intro before redirect().
  return (
    <Suspense fallback={null}>
      <DashboardGate />
    </Suspense>
  );
}
