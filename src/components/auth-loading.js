export default function AuthLoading({ message }) {
  return (
    <main className="login-page">
      <section className="login-card account-card" aria-live="polite">
        <p className="section-kicker">{message}</p>
      </section>
    </main>
  );
}