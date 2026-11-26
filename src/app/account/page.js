import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import AuthLoading from "@/components/auth-loading";
import { getVerifiedClaims } from "@/lib/supabase/roles";
import { signOutAction } from "./actions";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "Your account", description: "Your signed-in JayQ account." };

export default function AccountPage() {
  return (
    <Suspense fallback={<AuthLoading message="Loading your account…" />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const claims = await getVerifiedClaims();

  if (!claims) {
    redirect("/login");
  }

  const role = claims.app_metadata?.role;

  if (role === "admin") {
    redirect("/admin/dashboard");
  }

  if (role === "student") {
    redirect("/student/dashboard");
  }

  const email = typeof claims.email === "string" ? claims.email : "Signed-in account";

  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <form action={signOutAction}><button className="account-signout" type="submit">Sign out</button></form>
      </div>
      <section className="login-card account-card">
        <p className="section-kicker">ACCOUNT SETUP</p>
        <h1>Your role is not set yet.</h1>
        <p className="login-copy">You are signed in as</p>
        <p className="account-email">{email}</p>
        <div className="login-notice"><span className="notice-dot" />An administrator role must be assigned before this account can open a workspace.</div>
        <Link className="button button-dark account-home" href="/">Return to homepage <ArrowRight size={16} /></Link>
      </section>
      <footer className="login-footer">JayQ · Clear assessments. Confident progress.</footer>
    </main>
  );
}