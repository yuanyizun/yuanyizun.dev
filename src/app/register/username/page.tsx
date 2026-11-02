import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthStage } from "@/components/composite/auth-form/auth-stage";
import { UsernameForm } from "@/components/composite/auth-form/username-form";
import { PageFrame } from "@/components/composite/page-frame/page-frame";
import { getCurrentUser } from "@/data/users";
import { setSessionCookie } from "@/services/session";
import { setUsernameAction } from "../actions";

export const metadata: Metadata = {
  title: "Choose a username",
};

async function UsernameSection() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.username) {
    await setSessionCookie({ sub: user.id, username: user.username });
    redirect("/");
  }

  return <UsernameForm action={setUsernameAction} />;
}

export default function RegisterUsernamePage() {
  return (
    <PageFrame template="auth">
      <AuthStage>
        <Suspense
          fallback={
            <p className="text-foreground/70" aria-live="polite">
              Loading your account…
            </p>
          }
        >
          <UsernameSection />
        </Suspense>
      </AuthStage>
    </PageFrame>
  );
}
