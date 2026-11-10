import type { Metadata } from "next";
import { Suspense } from "react";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { ProfileEditForm } from "@/components/composite/profile-edit-form/profile-edit-form";
import {
  RegisteredUsers,
  RegisteredUsersSkeleton,
} from "@/components/composite/registered-users/registered-users";
import {
  RolesManage,
  RolesManageSkeleton,
} from "@/components/composite/roles-manage/roles-manage";
import { updateProfileAction } from "@/services/actions/auth-actions";
import { createRoleAction } from "@/services/actions/role-actions";
import { getDashboardPage } from "@/services/pages/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function DashboardBody({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const page = await getDashboardPage(await searchParams);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <ProfileEditForm
        action={updateProfileAction}
        defaults={{
          username: page.user.username,
          email: page.user.email,
          roleKey: page.user.roleKey,
          roleLabel: page.roleLabel,
        }}
      />
      {page.registeredUsers ? (
        <RegisteredUsers
          active={page.registeredUsers.active}
          roles={page.registeredUsers.roles}
          users={page.registeredUsers.users}
          currentUserId={page.user.id}
          error={page.registeredUsers.error}
        />
      ) : null}
      {page.roles ? (
        <RolesManage roles={page.roles} action={createRoleAction} />
      ) : null}
    </div>
  );
}

function DashboardFallback() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <section
        className="flex w-full flex-col gap-5 rounded-xl border border-foreground/15 p-5"
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
      <RolesManageSkeleton />
    </div>
  );
}

export default function DashboardPage({
  searchParams,
}: PageProps<"/dashboard">) {
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
