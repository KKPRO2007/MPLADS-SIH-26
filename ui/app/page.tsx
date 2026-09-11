"use client";

import { useState } from "react";

import Header from "@/src/components/Header";
import Overview from "@/src/components/Overview";
import { RiskMonitoring } from "@/src/components/RiskMonitoring";

export default function HomePage() {
  const [showProjectCheck, setShowProjectCheck] = useState(false);

  return (
    <div className="min-h-screen">
      <Header onProjectCheck={() => setShowProjectCheck(true)} />
      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10 md:py-16">
        <Overview />
        <div className="mt-14 grid gap-12 lg:grid-cols-[1.15fr_0.85fr]">
          <RiskMonitoring />
          <section className="border border-[var(--line)] bg-[#e8eee8] p-6">
            <p className="eyebrow">Coverage</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">Portfolio health</h2>
            <div className="mt-8 flex items-end gap-4">
              <p className="text-7xl font-semibold tracking-[-0.08em] text-[#27736b]">82</p>
              <p className="pb-2 text-sm leading-5 text-black/55">overall<br />health score</p>
            </div>
            <div className="mt-6 h-2 bg-white"><div className="h-full w-[82%] bg-[#27736b]" /></div>
            <p className="mt-4 text-sm text-black/60">Strong delivery momentum, with procurement delays driving the current watchlist.</p>
          </section>
        </div>
      </main>
      {showProjectCheck && (
        <div className="fixed inset-0 z-10 grid place-items-center bg-black/35 px-6" role="dialog" aria-modal="true" aria-labelledby="project-check-title">
          <div className="w-full max-w-lg border border-[var(--line)] bg-[#fbfaf6] p-7 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Automated review</p>
                <h2 className="mt-2 text-3xl font-semibold tracking-tight" id="project-check-title">Project check complete</h2>
              </div>
              <button aria-label="Close project check" className="text-2xl leading-none text-black/45 hover:text-black" onClick={() => setShowProjectCheck(false)} type="button">×</button>
            </div>
            <div className="mt-7 space-y-3 text-sm">
              <p className="flex justify-between border-b border-[var(--line)] pb-3"><span>Projects checked</span><strong>128 / 128</strong></p>
              <p className="flex justify-between border-b border-[var(--line)] pb-3"><span>New risk signals</span><strong className="text-[#b44a32]">3 found</strong></p>
              <p className="flex justify-between"><span>Data freshness</span><strong className="text-[#27736b]">Up to date</strong></p>
            </div>
            <button className="mt-7 w-full bg-[var(--ink)] px-4 py-3 text-sm font-semibold text-white hover:opacity-85" onClick={() => setShowProjectCheck(false)} type="button">Back to overview</button>
          </div>
        </div>
      )}
    </div>
  );
}
