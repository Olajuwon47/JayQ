import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowLeft } from "lucide-react";
import AuthLoading from "@/components/auth-loading";
import { createClient } from "@/lib/supabase/server";
import StudentSelfService from "../student-self-service";
import { signOutAction } from "@/app/account/actions";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "My account" };

export default function StudentProfilePage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <form action={signOutAction}><button className="account-signout" type="submit">Sign out</button></form>
      </div>
      <section className="students-shell student-profile-shell">
        <Link className="login-back" href="/student/dashboard"><ArrowLeft size={15} /> Student workspace</Link>
        <p className="section-kicker">STUDENT WORKSPACE</p>
        <h1>My account</h1>
        <p className="students-description">View your account details and manage your password.</p>
        <Suspense fallback={<AuthLoading message="Loading your account..." />}>
          <StudentProfileDetails />
        </Suspense>
      </section>
      <footer className="login-footer">JayQ - Clear assessments. Confident progress.</footer>
    </main>
  );
}

async function StudentProfileDetails() {
  await connection();
  const supabase = await createClient();
  const { data: claimsResult, error: claimsError } = await supabase.auth.getClaims();
  const claims = claimsResult?.claims;

  if (claimsError || claims?.app_metadata?.role !== "student" || !claims.sub) {
    return <div className="login-notice student-storage-notice">Your student account could not be loaded.</div>;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, student_id")
    .eq("id", claims.sub)
    .maybeSingle();

  if (profileError || !profile) {
    return <div className="login-notice student-storage-notice">Your profile could not be loaded. Contact your administrator.</div>;
  }

  return <StudentSelfService profile={profile} email={typeof claims.email === "string" ? claims.email : ""} />;
}