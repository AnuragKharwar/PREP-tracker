"use client";

import { useMemo } from "react";
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

  const initial = useMemo(() => {
    if (!user) return "?";
    const { title } = profileLabel(user);
    const ch = title.trim().charAt(0);
    return ch ? ch.toUpperCase() : "?";
  }, [user]);

  if (!user) return null;

  const { title, subtitle } = profileLabel(user);

  return (
    <footer className="profile-dock" aria-label="Account">
      <div className="profile-dock__user">
        <span className="profile-dock__avatar" aria-hidden>
          {initial}
        </span>
        <div className="profile-dock__text">
          <span className="profile-dock__name">{title}</span>
          {subtitle ? (
            <span className="profile-dock__email">{subtitle}</span>
          ) : null}
        </div>
      </div>
      <div className="profile-dock__actions">
        {cloudSyncReady ? (
          <span className="profile-dock__sync">Synced</span>
        ) : (
          <span className="profile-dock__sync profile-dock__sync--pending">
            Syncing…
          </span>
        )}
        <button
          type="button"
          className="profile-dock__signout"
          onClick={() => void signOut().then(() => showToast("Signed out"))}
        >
          Sign out
        </button>
      </div>
    </footer>
  );
}
