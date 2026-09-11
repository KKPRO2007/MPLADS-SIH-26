"use client";

import { FormEvent, useState } from "react";

import { login } from "@/src/lib/api";

export default function HomePage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("change-me");
  const [message, setMessage] = useState("Backend ready at http://localhost:8000");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login(username, password);
      setMessage("Signed in. Your access token is stored for this session.");
    } catch {
      setMessage("Sign-in failed. Start the backend and check your credentials.");
    }
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-16">
      <div className="mx-auto max-w-5xl">
        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">MPLADS / SIH-26</p>
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-end">
          <section>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] tracking-tight md:text-7xl">Projects, places, progress.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/65">The monitoring workspace is connected to a FastAPI service with PostgreSQL, JWT authentication, and an ML-ready data layer.</p>
          </section>
          <form onSubmit={handleSubmit} className="border border-[var(--line)] bg-white/60 p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Development sign in</h2>
            <label className="mt-6 block text-sm font-medium" htmlFor="username">Username</label>
            <input className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--accent)]" id="username" value={username} onChange={(event) => setUsername(event.target.value)} />
            <label className="mt-4 block text-sm font-medium" htmlFor="password">Password</label>
            <input className="mt-2 w-full border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--accent)]" id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            <button className="mt-6 w-full bg-[var(--accent)] px-4 py-3 font-semibold text-white transition-opacity hover:opacity-85" type="submit">Sign in</button>
            <p className="mt-4 text-sm text-black/60" role="status">{message}</p>
          </form>
        </div>
      </div>
    </main>
  );
}
