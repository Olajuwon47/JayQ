import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getVerifiedClaims } from "@/lib/supabase/roles";
import { signOutAction } from "@/app/account/actions";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "Administrator dashboard" };

export default function AdminDashboardPage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <form action={signOutAction}><button className="account-signout" type="submit">Sign out</button></form>
      </div>
      <section className="login-card account-card">
        <p className="section-kicker">ADMINISTRATOR WORKSPACE</p>
        <h1>Welcome to JayQ.</h1>
        <p className="login-copy">You are signed in as an administrator.</p>
        <Suspense fallback={<p className="account-email">Loading account…</p>}>
          <AdminAccountEmail />
        </Suspense>
        <div className="login-notice"><span className="notice-dot" />Quiz and student management will be added in the next phases.</div>
        <Link className="button button-dark account-home" href="/">Return to homepage <ArrowRight size={16} /></Link>
      </section>
      <footer className="login-footer">JayQ · Clear assessments. Confident progress.</footer>
    </main>
  );
}

async function AdminAccountEmail() {
  const claims = await getVerifiedClaims();
  return typeof claims?.email === "string" ? <p className="account-email">{claims.email}</p> : null;
}