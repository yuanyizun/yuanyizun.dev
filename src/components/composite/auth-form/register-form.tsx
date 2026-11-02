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

export function RegisterForm({
  action,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  if (state.ok) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>{state.message}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" asChild>
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Username, email, and a password of at least 8 characters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup>
            <Field data-invalid={state.errors?.username ? true : undefined}>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                required
                maxLength={32}
                aria-invalid={state.errors?.username ? true : undefined}
              />
              <FieldError>{state.errors?.username}</FieldError>
            </Field>
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
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={state.errors?.password ? true : undefined}
              />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              <FieldError>{state.errors?.password}</FieldError>
            </Field>
            {state.message ? (
              <FieldError role="alert">{state.message}</FieldError>
            ) : null}
            <Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating account…" : "Create account"}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/google">Sign up with Google</Link>
              </Button>
              <FieldDescription className="text-center">
                Already have an account? <Link href="/login">Sign in</Link>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
