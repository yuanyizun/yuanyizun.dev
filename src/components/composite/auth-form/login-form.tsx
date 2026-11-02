"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/primitive/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/primitive/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/primitive/field";
import { Input } from "@/components/primitive/input";
import type { AuthFormState } from "@/utils/auth-form";

const initialState: AuthFormState = {};

export function LoginForm({
  action,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="w-full max-w-lg gap-6 py-8 text-base [--card-spacing:--spacing(6)]">
      <CardHeader className="gap-2">
        <CardTitle className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Sign in
        </CardTitle>
        <CardDescription className="text-base">
          Use your email and password, or continue with Google.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup className="gap-6">
            <Field data-invalid={state.errors?.email ? true : undefined}>
              <FieldLabel htmlFor="email" className="text-base">
                Email
              </FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="m@example.com"
                required
                aria-invalid={state.errors?.email ? true : undefined}
                className="h-11 px-3 text-base md:text-base"
              />
              <FieldError>{state.errors?.email}</FieldError>
            </Field>
            <Field data-invalid={state.errors?.password ? true : undefined}>
              <FieldLabel htmlFor="password" className="text-base">
                Password
              </FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                aria-invalid={state.errors?.password ? true : undefined}
                className="h-11 px-3 text-base md:text-base"
              />
              <FieldError>{state.errors?.password}</FieldError>
            </Field>
            {state.message ? (
              <FieldError role="alert">{state.message}</FieldError>
            ) : null}
            <Field>
              <Button
                type="submit"
                size="lg"
                disabled={pending}
                aria-busy={pending || undefined}
                className="h-11 w-full gap-2 text-base"
              >
                {pending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="h-11 w-full text-base"
              >
                <Link href="/auth/google">Continue with Google</Link>
              </Button>
              <FieldDescription className="text-center text-base">
                Need an account? <Link href="/register">Register</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
