"use client";

import { useActionState, useState } from "react";
import { updateStudentProfileAction } from "./actions";

const initialState = { error: "", success: "" };

export default function StudentProfileEditor({ accountId, fullName, studentId }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className="student-status-button" type="button" onClick={() => setIsOpen(true)}>
        Edit
      </button>
      {isOpen ? (
        <div
          className="student-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        >
          <section className="student-modal" role="dialog" aria-modal="true" aria-labelledby="edit-student-title">
            <h2 id="edit-student-title">Edit student profile</h2>
            <p>Update the student's name or student ID.</p>
            <EditStudentForm
              accountId={accountId}
              fullName={fullName}
              studentId={studentId}
              onClose={() => setIsOpen(false)}
            />
          </section>
        </div>
      ) : null}
    </>
  );
}

function EditStudentForm({ accountId, fullName, studentId, onClose }) {
  const [state, formAction, pending] = useActionState(updateStudentProfileAction, initialState);

  return (
    <form className="student-edit-form" action={formAction}>
      <input type="hidden" name="accountId" value={accountId} />
      <label className="student-form-field">
        <span>Full name</span>
        <input name="fullName" defaultValue={fullName} required maxLength={120} autoFocus />
      </label>
      <label className="student-form-field">
        <span>Student ID</span>
        <input name="studentId" defaultValue={studentId} required maxLength={80} />
      </label>
      {state.error ? <p className="student-form-message is-error" role="alert">{state.error}</p> : null}
      {state.success ? <p className="student-form-message is-success" role="status">{state.success}</p> : null}
      <div className="student-modal-actions">
        {state.success ? (
          <button className="student-status-button" type="button" onClick={onClose}>Done</button>
        ) : (
          <>
            <button className="student-status-button" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-dark student-edit-submit" type="submit" disabled={pending}>
              {pending ? "Saving..." : "Save changes"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}