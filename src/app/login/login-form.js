"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm({ requiredRole }) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const { data: claimsResult, error: claimsError } = await supabase.auth.getClaims();
      const authenticatedRole = claimsResult?.claims?.app_metadata?.role;

      if (claimsError || authenticatedRole !== requiredRole) {
        await supabase.auth.signOut();
        setErrorMessage(
          requiredRole === "admin"
            ? "Use an administrator account for Admin sign in."
            : "Use a student account for Student sign in.",
        );
        return;
      }

      router.replace(requiredRole === "admin" ? "/admin/dashboard" : "/student/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Unable to reach JayQ right now. Check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" placeholder="you@school.edu" autoComplete="email" required />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required />
      {errorMessage ? <p className="login-error" role="alert">{errorMessage}</p> : null}
      <button className="button button-dark login-submit" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : requiredRole === "admin" ? "Admin sign in" : "Student sign in"} <ArrowRight size={16} />
      </button>
    </form>
  );
}

