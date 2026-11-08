import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthFormSkeleton } from "@/components/composite/auth-form/auth-form-skeleton";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { LoginForm } from "@/components/composite/auth-form/login-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { redirectIfSignedIn } from "@/services/auth";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Sign in",
};

async function LoginSection() {
  await redirectIfSignedIn();
  return <LoginForm action={loginAction} />;
}

export default function LoginPage() {
  return (
    <PageFrame template="auth">
      <AuthStage>
        <Suspense fallback={<AuthFormSkeleton />}>
          <LoginSection />
        </Suspense>
      </AuthStage>
    </PageFrame>
  );
}
