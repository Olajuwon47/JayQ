import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthLoading from "@/components/auth-loading";
import { getVerifiedClaims } from "@/lib/supabase/roles";
import { createClient } from "@/lib/supabase/server";
import StudentPasswordSetupForm from "./student-password-setup-form";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "Change your temporary password" };

export default function StudentSetPasswordPage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
      </div>
      <Suspense fallback={<AuthLoading message="Checking your account..." />}>
        <FirstSignInPasswordSetup />
      </Suspense>
      <footer className="login-footer">JayQ - Clear assessments. Confident progress.</footer>
    </main>
  );
}

async function FirstSignInPasswordSetup() {
  const claims = await getVerifiedClaims();
  if (!claims) redirect("/login");

  const supabase = await createClient();
  const { data: userResult, error: userError } = await supabase.auth.getUser();
  const user = userResult?.user;

  if (userError || !user || user.id !== claims.sub) redirect("/login");
  if (user.app_metadata?.role !== "student") redirect("/account");

  if (user.app_metadata?.must_set_password !== true) redirect("/student/dashboard");

  return (
    <section className="login-card">
      <div className="login-mark"><BrandMark /></div>
      <p className="section-kicker">FIRST SIGN IN</p>
      <h1>Change your password.</h1>
      <p className="login-copy">Your administrator created this account with a temporary password. Choose a new password to continue.</p>
      <Suspense fallback={<AuthLoading message="Loading password setup..." />}>
        <StudentPasswordSetupForm />
      </Suspense>
    </section>
  );
}