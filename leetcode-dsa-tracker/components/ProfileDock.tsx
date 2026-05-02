"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";

function profileLabel(user: {
  email?: string;
  user_metadata?: Record<string, unknown>;
}): { title: string; subtitle: string } {
  const meta = user.user_metadata;
  const full =
    (typeof meta?.full_name === "string" && meta.full_name) ||
    (typeof meta?.name === "string" && meta.name) ||
    "";
  const email = user.email ?? "";
  if (full) {
    return { title: full, subtitle: email };
  }
  if (email) {
    const local = email.split("@")[0];
    return {
      title: local || email,
      subtitle: email,
    };
  }
  return { title: "Account", subtitle: "" };
}

export function ProfileDock() {
  const { user, cloudSyncReady, signOut, showToast } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const initial = useMemo(() => {
    if (!user) return "?";
    const { title } = profileLabel(user);
    const ch = title.trim().charAt(0);
    return ch ? ch.toUpperCase() : "?";
  }, [user]);

  if (!user) return null;

  const { title, subtitle } = profileLabel(user);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      showToast("Signed out successfully. Local data preserved.");
      setShowDetails(false);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <footer className="profile-dock" aria-label="Account">
      <div className="profile-dock__user">
        <span 
          className="profile-dock__avatar" 
          aria-hidden
          role="button"
          onClick={() => setShowDetails(!showDetails)}
          style={{ cursor: "pointer" }}
        >
          {initial}
        </span>
        <div 
          className="profile-dock__text"
          onClick={() => setShowDetails(!showDetails)}
          style={{ cursor: "pointer" }}
        >
          <span className="profile-dock__name">{title}</span>
          {subtitle ? (
            <span className="profile-dock__email">{subtitle}</span>
          ) : null}
        </div>
      </div>

      {showDetails && (
        <div 
          className="profile-dock__details"
          style={{
            position: "absolute",
            bottom: "100%",
            right: 0,
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "8px",
            minWidth: "250px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          <div style={{ marginBottom: "12px" }}>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>Email Account</p>
            <p style={{ margin: "4px 0 0 0", fontWeight: 500 }}>{user.email}</p>
          </div>

          <div style={{ marginBottom: "12px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7, display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: cloudSyncReady ? "#4ade80" : "#fbbf24" }} />
              Data Sync Status
            </p>
            <p style={{ margin: "4px 0 0 0", fontSize: "13px" }}>
              {cloudSyncReady ? "✓ Synced with Supabase" : "⟳ Syncing..."}
            </p>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <p style={{ margin: 0, fontSize: "12px", opacity: 0.7 }}>Storage</p>
            <ul style={{ margin: "4px 0 0 0", paddingLeft: "16px", fontSize: "12px" }}>
              <li>Local: Browser storage (always available)</li>
              <li>Cloud: Supabase database (encrypted, per email)</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            style={{
              width: "100%",
              padding: "8px 12px",
              backgroundColor: "var(--coral)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              cursor: signingOut ? "not-allowed" : "pointer",
              opacity: signingOut ? 0.6 : 1,
            }}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      )}

      <div className="profile-dock__actions">
        {cloudSyncReady ? (
          <span className="profile-dock__sync">✓ Synced</span>
        ) : (
          <span className="profile-dock__sync profile-dock__sync--pending">
            ⟳ Syncing…
          </span>
        )}
      </div>
    </footer>
  );
}
