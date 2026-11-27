"use client";

import { useActionState } from "react";
import { createStudentAction } from "./actions";

const initialState = { error: "", success: "" };

export default function CreateStudentForm() {
  const [state, formAction, pending] = useActionState(createStudentAction, initialState);

  return (
    <form className="student-create-form" action={formAction}>
      <div className="student-form-grid">
        <label className="student-form-field">
          <span>Full name</span>
          <input name="fullName" autoComplete="name" required maxLength={120} />
        </label>
        <label className="student-form-field">
          <span>Email address</span>
          <input name="email" type="email" autoComplete="email" required maxLength={254} />
        </label>
        <label className="student-form-field">
          <span>Student ID</span>
          <input name="studentId" required maxLength={80} />
        </label>
        <label className="student-form-field">
          <span>Temporary password</span>
          <input name="password" type="password" autoComplete="new-password" required />
        </label>
      </div>
      <p className="student-form-help">Share the temporary password with the student securely.</p>
      {state.error ? <p className="student-form-message is-error" role="alert">{state.error}</p> : null}
      {state.success ? <p className="student-form-message is-success" role="status">{state.success}</p> : null}
      <button className="button button-dark student-form-submit" type="submit" disabled={pending}>
        {pending ? "Creating account..." : "Create student account"}
      </button>
    </form>
  );
}