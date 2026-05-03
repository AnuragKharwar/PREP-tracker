"use client";

import { useState } from "react";
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
import { TemplateLibrary } from "./TemplateLibrary";

const NAV_ITEMS: { id: TabId; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "questions", icon: "✦", label: "Questions" },
  { id: "study", icon: "⏱", label: "Study Mode" },
  { id: "interviews", icon: "⌘", label: "Interview Log" },
  { id: "frontend", icon: "⚡", label: "FE Prep" },
  { id: "templates", icon: "✎", label: "Templates" },
];

export function AppShell() {
  const {
    state,
    tab,
    setTab,
    toast,
    toggleTheme,
    user,
    authReady,
    cloudConfigured,
    cloudSyncReady,
    signOut,
    showToast,
    prepTarget,
    setPrepTarget,
    prepBrand,
  } = useApp();

  const [showLoginOverlay, setShowLoginOverlay] = useState(false);

  const needsCloudLogin =
    cloudConfigured && (!authReady || !user);

  // Always show the main app, overlay login when needed or requested
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

          {/* Profile section */}
          <div className="sb-profile">
            {showDock && (
              <div>
                <div className="sb-profile__user">
                  <span className="sb-profile__avatar" aria-hidden>
                    {user?.email?.charAt(0).toUpperCase() || "?"}
                  </span>
                  <div className="sb-profile__text">
                    <span className="sb-profile__email">
                      {user?.email || "Account"}
                    </span>
                    <div className="sb-profile__sync">
                      {cloudSyncReady ? (
                        <span style={{ color: "#4ade80", fontSize: "11px" }}>✓ Synced</span>
                      ) : (
                        <span style={{ color: "#fbbf24", fontSize: "11px" }}>⟳ Syncing…</span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="nav-item sb-profile__logout"
                  onClick={() => {
                    void signOut().then(() => showToast("Signed out successfully"));
                  }}
                  style={{ color: "var(--coral)", fontSize: "13px" }}
                >
                  <span className="nav-icon">↪</span>
                  <span>Sign out</span>
                </button>
              </div>
            )}

            {!showDock && cloudConfigured && (
              <div>
                <div className="sb-profile__signin-notice">
                  <span style={{ fontSize: "11px", color: "var(--text3)", marginBottom: "8px", display: "block" }}>
                    Sign in to sync your progress across devices
                  </span>
                </div>
                <button
                  type="button"
                  className="nav-item sb-profile__signin"
                  onClick={() => {
                    setShowLoginOverlay(true);
                  }}
                  style={{ color: "var(--blue)", fontSize: "13px" }}
                >
                  <span className="nav-icon">🔐</span>
                  <span>Sign in</span>
                </button>
              </div>
            )}

            {!cloudConfigured && (
              <div style={{ color: "var(--text3)", fontSize: "11px", padding: "8px 12px" }}>
                Using local storage only
              </div>
            )}
          </div>

          <div className="sb-bottom">
            <button type="button" className="nav-item" onClick={toggleTheme}>
              <span className="nav-icon">{state.theme === "dark" ? "☀" : "☾"}</span>
              <span>{state.theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
        </nav>
        <main className="main">
          <div className="main-content">
            {tab === "dashboard" && <Dashboard />}
            {tab === "questions" && <QuestionList />}
            {tab === "study" && <StudyMode />}
            {tab === "interviews" && <InterviewLog />}
            {tab === "frontend" && <FrontendResources />}
            {tab === "templates" && <TemplateLibrary />}
          </div>
        </main>
      </div>

      {(needsCloudLogin || showLoginOverlay) && (
        <div 
          className="login-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLoginOverlay(false);
            }
          }}
        >
          <LoginGate />
        </div>
      )}

      {toast ? (
        <div className="toast">{toast}</div>
      ) : null}
    </>
  );
}
