"use client";

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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Use your email and password, or continue with Google.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={state.errors?.email ? true : undefined}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="m@example.com"
                required
                aria-invalid={state.errors?.email ? true : undefined}
              />
              <FieldError>{state.errors?.email}</FieldError>
            </Field>
            <Field data-invalid={state.errors?.password ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                minLength={8}
                aria-invalid={state.errors?.password ? true : undefined}
              />
              <FieldError>{state.errors?.password}</FieldError>
            </Field>
            {state.message ? (
              <FieldError role="alert">{state.message}</FieldError>
            ) : null}
            <Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Signing in…" : "Sign in"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/google">Continue with Google</Link>
              </Button>
              <FieldDescription className="text-center">
                Need an account? <Link href="/register">Register</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
