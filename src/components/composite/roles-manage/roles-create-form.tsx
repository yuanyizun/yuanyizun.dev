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
import { cn } from "@/utils/class-names";
import {
  ROLE_DESCRIPTION_MAX,
  ROLE_NAME_HINT,
  ROLE_NAME_MAX,
  ROLE_NAME_PATTERN_ATTR,
  type RoleFormState,
} from "@/validation/role";

const initialState: RoleFormState = {};

const textareaClassName = cn(
  "min-h-24 w-full min-w-0 rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
);

export function RolesCreateForm({
  action,
}: {
  action: (state: RoleFormState, formData: FormData) => Promise<RoleFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form key={state.createdKey ?? "new-role"} action={formAction}>
      <FieldGroup className="gap-5">
        <Field data-invalid={state.errors?.name ? true : undefined}>
          <FieldLabel htmlFor="role-name">Name</FieldLabel>
          <Input
            id="role-name"
            name="name"
            required
            maxLength={ROLE_NAME_MAX}
            pattern={ROLE_NAME_PATTERN_ATTR}
            title={ROLE_NAME_HINT}
            aria-invalid={state.errors?.name ? true : undefined}
            className="h-11 px-3 text-base md:text-base"
          />
          <FieldDescription>
            Shown in the directory filters. A slug key is derived automatically.
          </FieldDescription>
          <FieldError>{state.errors?.name}</FieldError>
        </Field>

        <Field data-invalid={state.errors?.description ? true : undefined}>
          <FieldLabel htmlFor="role-description">Description</FieldLabel>
          <textarea
            id="role-description"
            name="description"
            maxLength={ROLE_DESCRIPTION_MAX}
            rows={3}
            aria-invalid={state.errors?.description ? true : undefined}
            className={textareaClassName}
          />
          <FieldDescription>Optional. Up to {ROLE_DESCRIPTION_MAX} characters.</FieldDescription>
          <FieldError>{state.errors?.description}</FieldError>
        </Field>

        {state.message ? (
          <p
            role="alert"
            className={
              state.ok ? "text-sm text-foreground" : "text-sm text-destructive"
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
              "Add role"
            )}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
