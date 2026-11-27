import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getVerifiedClaims } from "@/lib/supabase/roles";
import { signOutAction } from "@/app/account/actions";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "Student dashboard" };

export default function StudentDashboardPage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <form action={signOutAction}><button className="account-signout" type="submit">Sign out</button></form>
      </div>
      <section className="login-card account-card">
        <p className="section-kicker">STUDENT WORKSPACE</p>
        <h1>Welcome to JayQ.</h1>
        <p className="login-copy">You are signed in as a student.</p>
        <Suspense fallback={<p className="account-email">Loading accountâ€¦</p>}>
          <StudentAccountEmail />
        </Suspense>
        <div className="login-notice"><span className="notice-dot" />Your assigned quizzes will appear here.</div>
        <Link className="button button-dark account-home" href="/student/profile">Manage my account <ArrowRight size={16} /></Link>
        <Link className="button button-dark account-home" href="/">Return to homepage <ArrowRight size={16} /></Link>
      </section>
      <footer className="login-footer">JayQ Â· Clear assessments. Confident progress.</footer>
    </main>
  );
}

async function StudentAccountEmail() {
  const claims = await getVerifiedClaims();
  return typeof claims?.email === "string" ? <p className="account-email">{claims.email}</p> : null;
}