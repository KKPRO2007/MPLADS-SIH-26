import { useState } from "react";
import { LockKeyhole, LogIn } from "lucide-react";

export default function LoginPage({ onLogin, onCancel }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Unable to sign in.");
      onLogin(payload);
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-paper">
      <section className="w-full max-w-md bg-card border border-border rounded-[6px] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full bg-navy/10 text-navy flex items-center justify-center"><LockKeyhole size={20} /></div>
          <div>
            <h1 className="font-serif font-bold text-xl text-ink">Sign in to MPLADS Monitoring</h1>
            <p className="text-[12px] text-muted">Use your assigned email and password.</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="text-[12.5px] font-semibold text-ink">
            Email address
            <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full h-10 px-3 rounded border border-border bg-white text-ink focus:outline-none focus:border-navy" autoComplete="username" />
          </label>
          <label className="text-[12.5px] font-semibold text-ink">
            Password
            <input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full h-10 px-3 rounded border border-border bg-white text-ink focus:outline-none focus:border-navy" autoComplete="current-password" />
          </label>
          {error && <p className="text-[12px] text-red-700 bg-red-50 border border-red-200 p-3" role="alert">{error}</p>}
          <button type="submit" disabled={loading} className="bg-navy hover:bg-navy-light disabled:opacity-60 text-white font-bold py-2.5 rounded text-[13px] flex items-center justify-center gap-2">
            <LogIn size={15} /> {loading ? "Signing in..." : "Sign in"}
          </button>
          <button type="button" onClick={onCancel} className="text-[12px] text-muted hover:text-ink">Return to portal</button>
        </form>
      </section>
    </main>
  );
}
