"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: form.get("username"), password: form.get("password") }),
      });
      if (!response.ok) throw new Error("Invalid username or password.");
      const { access_token } = await response.json();
      sessionStorage.setItem("mplads_access_token", access_token);
      window.location.assign("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <form className="w-full max-w-sm border border-[var(--line)] bg-white p-7 shadow-sm" onSubmit={submit}>
        <p className="eyebrow">MPLADS</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-slate-500">Use the account issued by your administrator.</p>
        <label className="mt-6 block text-sm font-semibold" htmlFor="username">Username</label>
        <input className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5" id="username" name="username" required />
        <label className="mt-4 block text-sm font-semibold" htmlFor="password">Password</label>
        <input className="mt-2 w-full border border-slate-300 bg-white px-3 py-2.5" id="password" name="password" required type="password" />
        {error && <p className="mt-4 text-sm text-red-700" role="alert">{error}</p>}
        <button className="mt-6 w-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white hover:opacity-85 disabled:opacity-60" disabled={loading} type="submit">
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <Link className="mt-5 block text-center text-sm text-slate-600 underline" href="/">Back to dashboard</Link>
      </form>
    </main>
  );
}
