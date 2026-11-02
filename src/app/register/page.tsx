import type { Metadata } from "next";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { RegisterForm } from "@/components/composite/auth-form/register-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { registerAction } from "./actions";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <PageFrame template="auth">
      <AuthStage>
        <RegisterForm action={registerAction} />
      </AuthStage>
    </PageFrame>
  );
}
