import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import {
  RegisteredUsers,
  RegisteredUsersSkeleton,
} from "@/components/composite/registered-users/registered-users";
import { getSessionFromCookie } from "@/data/session";
import { listRegisteredUsers } from "@/data/users";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardBody() {
  const session = await getSessionFromCookie();
  if (!session) {
    redirect("/login");
  }

  const result = await listRegisteredUsers();
  if (!result.ok) {
    return (
      <RegisteredUsers users={[]} currentUserId={session.sub} error />
    );
  }

  return (
    <RegisteredUsers users={result.users} currentUserId={session.sub} />
  );
}

export default function DashboardPage() {
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
        <DashboardBody />
      </Suspense>
    </PageFrame>
  );
}
