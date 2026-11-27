import Link from "next/link";
import { ArrowDown, ArrowRight, Check, Clock3, LockKeyhole, Sparkles } from "lucide-react";

function BrandMark({ light = false }) {
  return <span className={light ? "brand-mark brand-mark-light" : "brand-mark"} aria-hidden="true"><i /><i /><i /><i /></span>;
}

const features = [
  { icon: Clock3, title: "Assessments with clear limits", text: "Set a schedule, a time limit, and the rules students need before they begin." },
  { icon: LockKeyhole, title: "A focused student experience", text: "Give each student access to assigned assessments and keep results private." },
  { icon: Check, title: "Results students can understand", text: "Show scores and pass status clearly, with correct answers available when an assessment closes." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header"><div className="site-header-inner">
        <Link className="brand" href="/" aria-label="JayQ home"><BrandMark /><span>jayq</span></Link>
        <nav className="main-nav" aria-label="Main navigation"><a href="#how-it-works">How it works</a><a href="#for-schools">For schools</a></nav>
        <Link className="button button-dark header-signin" href="/login">Student sign in <ArrowRight size={16} /></Link>
      </div></header>

      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> Online assessment, made clearer</div>
          <h1>Good assessments make room for <span>real progress.</span></h1>
          <p className="hero-description">JayQ gives schools one clear place to create timed assessments, guide students through them, and share results with confidence.</p>
          <div className="hero-actions"><Link className="button button-lime" href="/login">Student sign in to JayQ <ArrowRight size={17} /></Link><a className="text-link" href="#how-it-works">Explore the platform <ArrowDown size={16} /></a></div>
          <div className="hero-note"><span className="note-check"><Check size={13} strokeWidth={3} /></span>Built for thoughtful, focused assessments</div>
        </div>
        <div className="hero-visual" aria-label="Illustration of a timed JayQ assessment">
          <div className="visual-orbit orbit-one" /><div className="visual-orbit orbit-two" />
          <div className="floating-label label-top"><span className="live-dot" /> Assessment ready</div>
          <div className="exam-card">
            <div className="exam-card-top"><div className="mini-brand"><BrandMark light /><span>jayq</span></div><span className="exam-status"><i /> In progress</span></div>
            <div className="exam-card-content">
              <p className="exam-kicker">YOUR ASSESSMENT</p><h2>One question at a time.</h2>
              <p className="exam-subtitle">Stay focused. Your progress is saved as you go.</p>
              <div className="exam-progress-meta"><span>Question 1 of 10</span><span>10%</span></div><div className="progress-track"><span /></div>
              <div className="sample-question"><span className="question-number">01</span><div><span className="sample-label">QUESTION</span><p>Your assessment begins here.</p></div><ArrowRight className="question-arrow" size={16} /></div>
              <div className="exam-card-footer"><span><Clock3 size={14} /> 15 minutes</span><span><LockKeyhole size={13} /> Private results</span></div>
            </div>
          </div>
          <div className="floating-label label-bottom"><Sparkles size={15} /> Clear results, right after</div><span className="visual-star star-one">✳</span><span className="visual-star star-two">✳</span>
        </div>
      </section>

      <section className="trust-strip" id="for-schools"><div className="trust-strip-inner"><span className="trust-label">MADE FOR BETTER ASSESSMENTS</span><span>Thoughtful by design</span><i /><span>Clear for every student</span><i /><span>Useful for every educator</span></div></section>

      <section className="features-section section-wrap" id="how-it-works">
        <div className="section-heading"><p className="section-kicker">THE JAYQ APPROACH</p><h2>Everything has a place.<br /><span>Every result has meaning.</span></h2><p>From the first question to the final result, JayQ keeps the experience straightforward for everyone.</p></div>
        <div className="feature-grid">{features.map(({ icon: Icon, title, text }, index) => (
          <article className="feature-card" key={title}><div className={"feature-icon feature-icon-" + (index + 1)}><Icon size={20} strokeWidth={1.8} /></div><span className="feature-index">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>
        ))}</div>
      </section>

      <section className="closing-cta section-wrap"><div className="closing-cta-inner"><div><p className="section-kicker">YOUR NEXT STEP STARTS HERE</p><h2>Ready when you are.</h2><p>Sign in to see your JayQ workspace.</p></div><Link className="button button-lime" href="/login">Student sign in <ArrowRight size={17} /></Link><div className="cta-decoration" aria-hidden="true"><BrandMark light /></div></div></section>
      <footer className="site-footer"><Link className="brand footer-brand" href="/"><BrandMark /><span>jayq</span></Link><span>Clear assessments. Confident progress.</span><span>© 2026 JayQ</span></footer>
    </main>
  );
}
