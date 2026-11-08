import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthFormSkeleton } from "@/components/composite/auth-form/auth-form-skeleton";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { UsernameForm } from "@/components/composite/auth-form/username-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { getCurrentUser } from "@/data/users";
import { setUsernameAction } from "../actions";

export const metadata: Metadata = {
  title: "Choose a username",
};

async function UsernameSection() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // Cookie writes are illegal in RSC pages; proxy re-issues yz_session on `/`.
  if (user.username) {
    redirect("/");
  }

  return <UsernameForm action={setUsernameAction} />;
}

export default function RegisterUsernamePage() {
  return (
    <PageFrame template="auth">
      <AuthStage>
        <Suspense fallback={<AuthFormSkeleton />}>
          <UsernameSection />
        </Suspense>
      </AuthStage>
    </PageFrame>
  );
}
