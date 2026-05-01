"use client";

import { useApp } from "@/lib/app-context";
import { PREP_TARGET_DEFS, PREP_TARGET_IDS } from "@/lib/prep-targets";
import type { PrepTargetId, TabId } from "@/lib/types";
import { Dashboard } from "./Dashboard";
import { FrontendResources } from "./FrontendResources";
import { InterviewLog } from "./InterviewLog";
import { LoginGate } from "./LoginGate";
import { ProfileDock } from "./ProfileDock";
import { QuestionList } from "./QuestionList";
import { StudyMode } from "./StudyMode";

const NAV_ITEMS: { id: TabId; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "questions", icon: "✦", label: "Questions" },
  { id: "study", icon: "⏱", label: "Study Mode" },
  { id: "interviews", icon: "⌘", label: "Interview Log" },
  { id: "frontend", icon: "⚡", label: "FE Prep" },
];

export function AppShell() {
  const {
    state,
    tab,
    setTab,
    toast,
    toggleTheme,
    exportData,
    importData,
    resetProgress,
    user,
    authReady,
    cloudConfigured,
    prepTarget,
    setPrepTarget,
    prepBrand,
  } = useApp();

  const needsCloudLogin =
    cloudConfigured && (!authReady || !user);

  if (needsCloudLogin) {
    return (
      <>
        <LoginGate />
        {toast ? (
          <div className="toast">{toast}</div>
        ) : null}
      </>
    );
  }

  const showDock = cloudConfigured && Boolean(user);

  return (
    <>
      <div className="app">
        <nav className="sidebar" aria-label="Main">
          <div className="sb-brand">
            <h1>{prepBrand.brandHeading}</h1>
            <p>{prepBrand.brandSub}</p>
          </div>
          <div className="sb-prep">
            <label className="sb-prep-label" htmlFor="prep-target-select">
              Your track
            </label>
            <select
              id="prep-target-select"
              className="sb-prep-select"
              value={prepTarget}
              onChange={(e) => setPrepTarget(e.target.value as PrepTargetId)}
            >
              {PREP_TARGET_IDS.map((id) => (
                <option key={id} value={id}>
                  {PREP_TARGET_DEFS[id].label}
                </option>
              ))}
            </select>
          </div>
          <div className="sb-nav">
            {NAV_ITEMS.map((n) => (
              <button
                key={n.id}
                type="button"
                className={`nav-item${tab === n.id ? " active" : ""}`}
                onClick={() => setTab(n.id)}
              >
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </div>
          <div className="sb-bottom">
            <button type="button" className="nav-item" onClick={toggleTheme}>
              <span className="nav-icon">{state.theme === "dark" ? "☀" : "☾"}</span>
              <span>{state.theme === "dark" ? "Light" : "Dark"}</span>
            </button>
            <button type="button" className="nav-item" onClick={exportData}>
              <span className="nav-icon">↑</span>
              <span>Export</span>
            </button>
            <button type="button" className="nav-item" onClick={importData}>
              <span className="nav-icon">↓</span>
              <span>Import</span>
            </button>
            <button
              type="button"
              className="nav-item"
              onClick={resetProgress}
              style={{ color: "var(--coral)" }}
            >
              <span className="nav-icon">✕</span>
              <span>Reset</span>
            </button>
          </div>
        </nav>
        <main className={showDock ? "main main--with-dock" : "main"}>
          <div className="main-content">
            {tab === "dashboard" && <Dashboard />}
            {tab === "questions" && <QuestionList />}
            {tab === "study" && <StudyMode />}
            {tab === "interviews" && <InterviewLog />}
            {tab === "frontend" && <FrontendResources />}
          </div>
        </main>
      </div>
      {showDock ? <ProfileDock /> : null}
      {toast ? (
        <div className={showDock ? "toast toast--above-dock" : "toast"}>{toast}</div>
      ) : null}
    </>
  );
}
