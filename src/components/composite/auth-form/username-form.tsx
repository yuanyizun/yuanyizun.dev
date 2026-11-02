"use client";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/primitive/field";
import { Input } from "@/components/primitive/input";
import type { AuthFormState } from "@/utils/auth-form";

const initialState: AuthFormState = {};

export function UsernameForm({
  action,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Choose a username</CardTitle>
        <CardDescription>
          Pick a username to finish setting up your account.
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
            {state.message ? (
              <FieldError role="alert">{state.message}</FieldError>
            ) : null}
            <Field>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving…" : "Continue"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
