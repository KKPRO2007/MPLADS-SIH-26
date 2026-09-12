import { useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import RiskMonitoringPage from "./pages/RiskMonitoringPage.jsx";
import CitizenCornerPage from "./pages/CitizenCornerPage.jsx";
import StateExplorerPage from "./pages/StateExplorerPage.jsx";
import SectorAnalyticsPage from "./pages/SectorAnalyticsPage.jsx";
import FundFlowPage from "./pages/FundFlowPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RoleWorkspacePage from "./pages/RoleWorkspacePage.jsx";

export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("en");
  const [contrastMode, setContrastMode] = useState("normal"); // 'normal', 'high-contrast', 'yellow-black'
  const [fontSize, setFontSize] = useState("normal"); // 'normal', 'large', 'xlarge'
  const [backendData, setBackendData] = useState(null);
  const [backendError, setBackendError] = useState("");
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem("mplads_token");
      return token ? JSON.parse(localStorage.getItem("mplads_user")) || null : null;
    } catch {
      return null;
    }
  });
  const [showLogin, setShowLogin] = useState(() => !localStorage.getItem("mplads_token"));

  const handleLogin = ({ access_token: token, user: signedInUser }) => {
    localStorage.setItem("mplads_token", token);
    localStorage.setItem("mplads_user", JSON.stringify(signedInUser));
    setUser(signedInUser);
    setShowLogin(false);
    setPage("workspace");
  };

  const handleLogout = () => {
    localStorage.removeItem("mplads_token");
    localStorage.removeItem("mplads_user");
    setUser(null);
    setPage("home");
  };

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("mplads_token");
    if (!token) {
      setBackendData(null);
      return () => controller.abort();
    }
    fetch("/api/ui-data", { signal: controller.signal, headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (response.status === 401) {
          handleLogout();
          setShowLogin(true);
        }
        if (!response.ok) throw new Error("Backend unavailable");
        return response.json();
      })
      .then(setBackendData)
      .catch((error) => {
        if (error.name !== "AbortError") setBackendError("Live backend data is unavailable.");
      });
    return () => controller.abort();
  }, [user]);

  // Accessibility CSS classes
  const fontClass =
    fontSize === "large" ? "text-[115%]" : fontSize === "xlarge" ? "text-[128%]" : "";

  const themeClass =
    contrastMode === "high-contrast"
      ? "invert grayscale bg-black text-white"
      : contrastMode === "yellow-black"
      ? "bg-black text-[#FFE600]"
      : "bg-paper text-ink";

  return (
    <div className={`w-full min-h-screen flex flex-col font-sans transition-all ${themeClass} ${fontClass}`}>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Official Government Site Header */}
      <Header
        page={page}
        setPage={setPage}
        lang={lang}
        setLang={setLang}
        contrastMode={contrastMode}
        setContrastMode={setContrastMode}
        fontSize={fontSize}
        setFontSize={setFontSize}
        user={user}
        onLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {showLogin ? (
          <LoginPage onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
        ) : page === "home" ? (
          <HomePage onNavigate={setPage} token={localStorage.getItem("mplads_token")} />
        ) : (
          <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-[1500px] w-full mx-auto">
            {page === "workspace" && <RoleWorkspacePage user={user} onNavigate={setPage} />}
            {page === "overview" && (
              <OverviewPage
                goToAlerts={() => setPage("risk")}
                goToMps={() => setPage("mps")}
                data={backendData}
                error={backendError}
              />
            )}
            {page === "risk" && <RiskMonitoringPage defaultTab="alerts" data={backendData} error={backendError} />}
            {page === "alerts" && <RiskMonitoringPage defaultTab="alerts" data={backendData} error={backendError} />}
            {page === "mps" && <RiskMonitoringPage defaultTab="mps" data={backendData} error={backendError} />}
            {page === "works" && <RiskMonitoringPage defaultTab="works" data={backendData} error={backendError} />}
            {page === "states" && <StateExplorerPage />}
            {page === "sectors" && <SectorAnalyticsPage />}
            {page === "funds" && <FundFlowPage />}
            {page === "citizen" && <CitizenCornerPage data={backendData} />}
          </main>
        )}
      </div>
    </div>
  );
}
