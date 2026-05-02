import type { AppState } from "./types";

export const STORAGE_KEY = "fe_dsa_v3";

export const DEFAULT_STATE: AppState = {
  prepTarget: "frontend",
  questions: {},
  dailyGoal: 5,
  streak: { current: 0, best: 0, lastDate: "" },
  theme: "dark",
  interviews: [],
  dailyDone: {},
};

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { ...DEFAULT_STATE, ...JSON.parse(raw || "{}") };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    const payload = { ...state, lastModified: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* ignore quota errors */
  }
}
