"use client";

import { useActionState, useEffect, useRef } from "react";
import { changeOwnPasswordAction, updateOwnProfileAction } from "./actions";

const initialState = { error: "", success: "" };

export default function StudentSelfService({ profile, email }) {
  const [profileState, profileAction, profilePending] = useActionState(updateOwnProfileAction, initialState);
  const [passwordState, passwordAction, passwordPending] = useActionState(changeOwnPasswordAction, initialState);
  const passwordFormRef = useRef(null);

  useEffect(() => {
    if (passwordState.success) passwordFormRef.current?.reset();
  }, [passwordState]);

  return (
    <div className="student-self-service-grid">
      <section className="student-self-service-card" aria-labelledby="student-profile-heading">
        <p className="section-kicker">PROFILE DETAILS</p>
        <h2 id="student-profile-heading">My profile</h2>
        <p className="student-form-help">Your email address is managed by your administrator.</p>
        <dl className="student-profile-summary">
          <div><dt>Email address</dt><dd>{email || "Not available"}</dd></div>
        </dl>
        <form className="student-self-service-form" action={profileAction}>
          <label className="student-form-field">
            <span>Full name</span>
            <input name="fullName" defaultValue={profile.full_name} required maxLength={120} />
          </label>
          <label className="student-form-field">
            <span>Student ID</span>
            <input name="studentId" defaultValue={profile.student_id} required maxLength={80} />
          </label>
          {profileState.error ? <p className="student-form-message is-error" role="alert">{profileState.error}</p> : null}
          {profileState.success ? <p className="student-form-message is-success" role="status">{profileState.success}</p> : null}
          <button className="button button-dark student-form-submit" type="submit" disabled={profilePending}>
            {profilePending ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <section className="student-self-service-card" aria-labelledby="student-password-heading">
        <p className="section-kicker">PASSWORD</p>
        <h2 id="student-password-heading">Change password</h2>
        <form className="student-self-service-form" action={passwordAction} ref={passwordFormRef}>
          <label className="student-form-field">
            <span>Current password</span>
            <input name="currentPassword" type="password" autoComplete="current-password" required />
          </label>
          <label className="student-form-field">
            <span>New password</span>
            <input name="newPassword" type="password" autoComplete="new-password" required />
          </label>
          <label className="student-form-field">
            <span>Confirm new password</span>
            <input name="confirmPassword" type="password" autoComplete="new-password" required />
          </label>
          {passwordState.error ? <p className="student-form-message is-error" role="alert">{passwordState.error}</p> : null}
          {passwordState.success ? <p className="student-form-message is-success" role="status">{passwordState.success}</p> : null}
          <button className="button button-dark student-form-submit" type="submit" disabled={passwordPending}>
            {passwordPending ? "Changing password..." : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
}