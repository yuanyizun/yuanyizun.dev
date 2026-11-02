import type { Metadata } from "next";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { LoginForm } from "@/components/composite/auth-form/login-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { loginAction } from "./actions";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <PageFrame template="auth">
      <AuthStage>
        <LoginForm action={loginAction} />
      </AuthStage>
    </PageFrame>
  );
}
