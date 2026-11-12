"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/composite/field/field";
import { Button } from "@/components/primitive/form-button/form-button";
import { Input } from "@/components/primitive/input/input";
import { cn } from "@/utils/class-names";
import type { InterviewPasscodeState } from "@/services/domain/interview-passcode";
import "./interview-passcode.module.css";

const initialState: InterviewPasscodeState = {};

export function InterviewPasscodeForm({
  action,
  variant = "sheet",
}: {
  action: (
    state: InterviewPasscodeState,
    formData: FormData,
  ) => Promise<InterviewPasscodeState>;
  variant?: "sheet" | "app";
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.ok) {
      router.refresh();
    }
  }, [router, state.ok]);

  return (
    <div
      className={cn(
        "interviewPasscode",
        variant === "app" && "interviewPasscodeApp",
      )}
    >
      <form action={formAction} className="interviewPasscodeCard">
        <h1 className="interviewPasscodeTitle">Interview</h1>
        <p className="interviewPasscodeLead">
          Enter the passcode to open the crib sheet.
        </p>
        <FieldGroup className="gap-4">
          <Field data-invalid={state.errors?.code ? true : undefined}>
            <FieldLabel htmlFor="interview-passcode">Passcode</FieldLabel>
            <Input
              id="interview-passcode"
              name="code"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              aria-invalid={state.errors?.code ? true : undefined}
              className="h-11 px-3 text-base md:text-base"
            />
            <FieldError>{state.errors?.code}</FieldError>
          </Field>
          {state.message ? (
            <p className="interviewPasscodeMessage" role="alert">
              {state.message}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Checking
              </>
            ) : (
              "Open"
            )}
          </Button>
        </FieldGroup>
      </form>
    </div>
  );
}
