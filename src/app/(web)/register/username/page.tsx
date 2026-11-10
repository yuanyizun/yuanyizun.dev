import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthFormSkeleton } from "@/components/composite/auth-form/auth-form-skeleton";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { UsernameForm } from "@/components/composite/auth-form/username-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { getCurrentUser } from "@/data/users";
import { setUsernameAction } from "@/services/actions/auth-actions";

export const metadata: Metadata = {
  title: "Choose a username",
};

async function UsernameSection() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.username) {
    redirect("/dashboard");
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
