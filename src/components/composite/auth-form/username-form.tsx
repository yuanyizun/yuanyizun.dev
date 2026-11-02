"use client";

import { Loader2 } from "lucide-react";
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
import {
  USERNAME_HINT,
  USERNAME_PATTERN_ATTR,
  type AuthFormState,
} from "@/utils/auth-form";

const initialState: AuthFormState = {};

export function UsernameForm({
  action,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Card className="w-full max-w-lg gap-6 py-8 text-base [--card-spacing:--spacing(6)]">
      <CardHeader className="gap-2">
        <CardTitle className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Choose a username
        </CardTitle>
        <CardDescription className="text-base">
          Pick a username to finish setting up your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction}>
          <FieldGroup className="gap-6">
            <Field data-invalid={state.errors?.username ? true : undefined}>
              <FieldLabel htmlFor="username" className="text-base">
                Username
              </FieldLabel>
              <Input
                id="username"
                name="username"
                autoComplete="username"
                required
                minLength={2}
                maxLength={32}
                pattern={USERNAME_PATTERN_ATTR}
                title={USERNAME_HINT}
                aria-invalid={state.errors?.username ? true : undefined}
                className="h-11 px-3 text-base md:text-base"
              />
              <FieldDescription className="text-base">
                2–32 letters, numbers, or underscores.
              </FieldDescription>
              <FieldError>{state.errors?.username}</FieldError>
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
                    Saving…
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
