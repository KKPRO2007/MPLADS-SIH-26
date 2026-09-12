"use client";

import Header from "@/src/components/Header";
import Overview from "@/src/components/Overview";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="w-full px-4 py-6 sm:px-6 md:py-10 lg:px-8">
        <Overview />
      </main>
    </div>
  );
}
