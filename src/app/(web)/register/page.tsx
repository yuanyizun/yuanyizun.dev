import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFormSkeleton } from "@/components/composite/auth-form/auth-form-skeleton";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { RegisterForm } from "@/components/composite/auth-form/register-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { redirectIfSignedIn } from "@/services/auth";
import { registerAction } from "@/services/auth-actions";

export const metadata: Metadata = {
  title: "Register",
};

async function RegisterSection() {
  await redirectIfSignedIn();
  return <RegisterForm action={registerAction} />;
}

export default function RegisterPage() {
  return (
    <PageFrame template="auth">
      <AuthStage>
        <Suspense fallback={<AuthFormSkeleton />}>
          <RegisterSection />
        </Suspense>
      </AuthStage>
    </PageFrame>
  );
}
