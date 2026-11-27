import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LoginForm from "./login-form";

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>;
}

export const metadata = { title: "Sign in", description: "Sign in to your JayQ account." };

export default function LoginPage() {
  return (
    <main className="login-page">
      <div className="login-topbar">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <Link className="login-back" href="/"><ArrowLeft size={15} /> Back to home</Link>
      </div>
      <section className="login-card">
        <div className="login-mark"><BrandMark /></div>
        <p className="section-kicker">STUDENT SIGN IN</p>
        <h1>Student sign in to continue.</h1>
        <p className="login-copy">Your assessments and results, all in one place.</p>
        <p className="login-help login-intro">Use the account your administrator created.</p>
        <LoginForm requiredRole="student" />
      </section>
      <footer className="login-footer">JayQ · Clear assessments. Confident progress.</footer>
    </main>
  );
}
