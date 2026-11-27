"use client";

import { useActionState } from "react";
import { setStudentActiveAction } from "./actions";

const initialState = { error: "", success: "" };

export default function StudentStatusControl({ studentId, active }) {
  const [state, formAction, pending] = useActionState(setStudentActiveAction, initialState);
  const nextActive = !active;

  return (
    <div className="student-row-actions">
      <form action={formAction}>
        <input type="hidden" name="studentId" value={studentId} />
        <input type="hidden" name="active" value={String(nextActive)} />
        <button className="student-status-button" type="submit" disabled={pending}>
          {pending ? "Saving..." : active ? "Deactivate" : "Reactivate"}
        </button>
      </form>
      {state.error ? <span className="student-action-message is-error" role="alert">{state.error}</span> : null}
      {state.success ? <span className="student-action-message is-success" role="status">{state.success}</span> : null}
    </div>
  );
}