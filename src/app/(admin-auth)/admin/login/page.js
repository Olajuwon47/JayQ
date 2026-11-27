import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "@/app/login/login-form";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = {
  title: "Administrator sign in",
  description: "Administrator sign in for JayQ.",
};

export default function AdminLoginPage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <Link className="login-back" href="/login"><ArrowLeft size={15} /> Student sign in</Link>
      </div>
      <section className="login-card">
        <div className="login-mark"><BrandMark /></div>
        <p className="section-kicker">ADMINISTRATOR SIGN IN</p>
        <h1>Admin sign in to continue.</h1>
        <p className="login-copy">Manage assessments and student accounts.</p>
        <p className="login-help login-intro">Use your administrator account.</p>
        <LoginForm requiredRole="admin" />
      </section>
      <footer className="login-footer">JayQ - Clear assessments. Confident progress.</footer>
    </main>
  );
}