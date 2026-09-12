import { LockKeyhole, Menu, X } from "lucide-react";
import { useState } from "react";

export const PAGE_TITLES = {
  home: "Portal Home",
  overview: "National Overview",
  mps: "MP Performance Directory",
  states: "State & District Explorer",
  sectors: "Sector Allocations",
  works: "Work Progress & Assets",
  alerts: "Work Progress & Assets",
  citizen: "Citizen Corner & Reports",
};

export default function Header({ page, setPage, fontSize, setFontSize, user, onLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNav = (key) => {
    setMenuOpen(false);
    if (key === "home") {
      setPage("home");
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      setPage(key);
    }
  };

  return (
    <header className="w-full bg-[#082743] text-white shrink-0 select-none z-50 border-b border-white/10">
      {/* Top Accessibility Bar */}
      <div className="top-strip flex items-center justify-between sm:justify-end gap-6 min-h-[38px] px-6 sm:px-10 bg-[#0b3768] text-xs font-bold text-white">
        <span className="text-[12px] opacity-90">Government of India</span>
        <div className="flex items-center gap-3 ml-auto" aria-label="Accessibility font size controls">
          <span className="hidden sm:inline text-white/80 text-[11px]">Font Size:</span>
          <button
            type="button"
            onClick={() => setFontSize && setFontSize("normal")}
            className={`px-2 py-0.5 rounded text-[12px] ${
              fontSize === "normal" ? "bg-white/25 font-extrabold text-cyan" : "hover:text-cyan"
            }`}
          >
            A-
          </button>
          <button
            type="button"
            onClick={() => setFontSize && setFontSize("large")}
            className={`px-2 py-0.5 rounded text-[12px] ${
              fontSize === "large" ? "bg-white/25 font-extrabold text-cyan" : "hover:text-cyan"
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontSize && setFontSize("xlarge")}
            className={`px-2 py-0.5 rounded text-[12px] ${
              fontSize === "xlarge" ? "bg-white/25 font-extrabold text-cyan" : "hover:text-cyan"
            }`}
          >
            A+
          </button>
        </div>
      </div>

      {/* Main Official Portal Site Header */}
      <div className="site-header">
        {/* Emblem of India Logo & Ministry Title (Clickable -> Go Home) */}
        <div
          onClick={() => handleNav("home")}
          className="identity cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="AI eSAKSHI Home"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
            alt="Government of India Emblem"
            className="w-12 h-16 object-contain group-hover:scale-105 transition-transform"
          />
          <span>
            <small>Government of India</small>
            <strong>Ministry of Statistics and Programme Implementation</strong>
            <em>AI Powered MPLADS eSAKSHI Portal</em>
          </span>
        </div>

        {/* Global Navigation - 4 clean text links with bright color hover effect */}
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <button
            type="button"
            onClick={() => handleNav("home")}
            className={page === "home" ? "nav-link active" : "nav-link"}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => handleNav("overview")}
            className={page === "overview" ? "nav-link active" : "nav-link"}
          >
            National Overview
          </button>

          <button
            type="button"
            onClick={() => handleNav("works")}
            className={
              page === "works" || page === "risk" || page === "alerts" || page === "mps"
                ? "nav-link active"
                : "nav-link"
            }
          >
            Work Progress & Assets
          </button>

          <button
            type="button"
            onClick={() => handleNav("citizen")}
            className={page === "citizen" ? "nav-link active" : "nav-link"}
          >
            Citizen Corner & Reports
          </button>
        </nav>

        {/* User Login Action Button - Right Aligned */}
        <div className="flex items-center gap-3 ml-auto shrink-0">
          {user ? (
            <button className="login-button" type="button" onClick={onLogout} title="Sign out">
              <LockKeyhole size={18} />
              {user.roleLabel || user.role} · Sign out
            </button>
          ) : (
            <button className="login-button" type="button" onClick={onLogin}>
              <LockKeyhole size={18} /> Login
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            className="menu-button"
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
