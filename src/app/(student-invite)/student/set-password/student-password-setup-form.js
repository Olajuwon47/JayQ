"use client";

import { useActionState } from "react";
import { completeRequiredPasswordChangeAction } from "@/app/student/actions";

const initialState = { error: "" };

export default function StudentPasswordSetupForm() {
  const [state, formAction, pending] = useActionState(completeRequiredPasswordChangeAction, initialState);

  return (
    <form className="login-form" action={formAction}>
      <label htmlFor="new-password">New password</label>
      <input id="new-password" name="password" type="password" autoComplete="new-password" required />
      <label htmlFor="confirm-new-password">Confirm new password</label>
      <input id="confirm-new-password" name="confirmPassword" type="password" autoComplete="new-password" required />
      {state.error ? <p className="login-error" role="alert">{state.error}</p> : null}
      <button className="button button-dark login-submit" type="submit" disabled={pending}>
        {pending ? "Saving password..." : "Set password"}
      </button>
    </form>
  );
}