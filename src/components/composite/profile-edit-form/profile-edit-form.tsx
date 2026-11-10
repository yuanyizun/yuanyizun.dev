"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/composite/field/field";
import { Button } from "@/components/primitive/form-button/form-button";
import { Input } from "@/components/primitive/input/input";
import {
  USERNAME_HINT,
  USERNAME_PATTERN_ATTR,
  type AuthFormState,
} from "@/validation/auth";

export type ProfileEditDefaults = {
  username: string;
  email: string;
  roleKey: string;
  roleLabel?: string;
};

const initialState: AuthFormState = {};

export function ProfileEditForm({
  action,
  defaults,
}: {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  defaults: ProfileEditDefaults;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const roleDisplay = defaults.roleLabel ?? defaults.roleKey;

  return (
    <section className="flex max-w-xl flex-col gap-5 rounded-xl border border-foreground/15 p-5">
      <div className="flex flex-col gap-1">
        <h2 className="font-heading text-xl font-medium tracking-tight">
          Your profile
        </h2>
        <p className="text-sm text-muted-foreground">
          Update the username shown across the site.
        </p>
      </div>

      <form action={formAction}>
        <FieldGroup className="gap-5">
          <Field>
            <FieldLabel htmlFor="profile-email">Email</FieldLabel>
            <Input
              id="profile-email"
              type="email"
              value={defaults.email}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              className="h-11 px-3 text-base md:text-base"
            />
            <FieldDescription>Managed by your sign-in account.</FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-role">Role</FieldLabel>
            <Input
              id="profile-role"
              value={roleDisplay}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
              className="h-11 px-3 text-base md:text-base"
            />
          </Field>

          <Field data-invalid={state.errors?.username ? true : undefined}>
            <FieldLabel htmlFor="profile-username">Username</FieldLabel>
            <Input
              id="profile-username"
              name="username"
              autoComplete="username"
              required
              minLength={2}
              maxLength={32}
              pattern={USERNAME_PATTERN_ATTR}
              title={USERNAME_HINT}
              defaultValue={defaults.username}
              aria-invalid={state.errors?.username ? true : undefined}
              className="h-11 px-3 text-base md:text-base"
            />
            <FieldDescription>
              2–32 letters, numbers, or underscores.
            </FieldDescription>
            <FieldError>{state.errors?.username}</FieldError>
          </Field>

          {state.message ? (
            <p
              role="alert"
              className={
                state.ok
                  ? "text-sm text-foreground"
                  : "text-sm text-destructive"
              }
            >
              {state.message}
            </p>
          ) : null}

          <Field>
            <Button
              type="submit"
              size="lg"
              disabled={pending}
              aria-busy={pending || undefined}
              className="h-11 w-full gap-2 text-base sm:w-auto"
            >
              {pending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </section>
  );
}
