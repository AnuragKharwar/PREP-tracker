import type { SupabaseClient } from "@supabase/supabase-js";
import { DEFAULT_STATE } from "../storage";
import type { AppState } from "../types";

const TABLE = "tracker_data";

export type TrackerRow = {
  user_id: string;
  payload: AppState;
  updated_at: string;
};

/** Strip client-only sync hint before storing in JSONB. */
export function payloadForCloud(state: AppState): AppState {
  const { lastModified: _lm, ...rest } = state;
  return rest;
}

export function normalizePayload(raw: unknown): AppState {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_STATE };
  }
  return { ...DEFAULT_STATE, ...(raw as AppState) };
}

/**
 * remoteUpdatedAt comes from Postgres; local uses lastModified from localStorage saves.
 */
export function mergeWithRemote(
  local: AppState,
  remotePayload: AppState | null,
  remoteUpdatedAt: string | null,
): { merged: AppState; shouldPushLocal: boolean } {
  if (!remotePayload || !remoteUpdatedAt) {
    return { merged: local, shouldPushLocal: true };
  }
  const localLm = local.lastModified ?? 0;
  const remoteMs = new Date(remoteUpdatedAt).getTime();
  if (remoteMs > localLm) {
    return {
      merged: normalizePayload(remotePayload),
      shouldPushLocal: false,
    };
  }
  return { merged: local, shouldPushLocal: true };
}

export async function fetchTrackerRow(
  supabase: SupabaseClient,
): Promise<TrackerRow | null> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select("user_id, payload, updated_at")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (error) {
    console.error("fetchTrackerRow", error.message);
    return null;
  }
  if (!data) return null;
  return data as TrackerRow;
}

export async function upsertTrackerRow(
  supabase: SupabaseClient,
  state: AppState,
): Promise<{ ok: boolean; message?: string }> {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user) {
    return { ok: false, message: "Not signed in" };
  }

  const payload = payloadForCloud(state);
  const { error } = await supabase.from(TABLE).upsert(
    {
      user_id: userData.user.id,
      payload,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("upsertTrackerRow", error.message);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}
