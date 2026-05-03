"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AppState, Interview, PrepTargetId, Question, TabId, TemplateItem } from "./types";
import { DEFAULT_STATE, loadState, saveState } from "./storage";
import { QUESTIONS } from "./questions";
import {
  PREP_TARGET_DEFS,
  filterQuestionsForTarget,
  prepTargetDocumentTitle,
  resolvePrepTarget,
} from "./prep-targets";
import { getSupabaseBrowserClient, isSupabaseConfigured } from "./supabase/client";
import {
  fetchTrackerRow,
  mergeWithRemote,
  normalizePayload,
  upsertTrackerRow,
} from "./supabase/sync";

type AppContextValue = {
  state: AppState;
  tab: TabId;
  setTab: (t: TabId) => void;
  toast: string;
  setStatus: (id: number, status: string) => void;
  setNotes: (id: number, notes: string) => void;
  setDailyGoal: (g: number) => void;
  toggleTheme: () => void;
  showToast: (msg: string) => void;
  exportData: () => void;
  importData: () => void;
  resetProgress: () => void;
  addInterview: (iv: Interview) => void;
  updateInterview: (id: string, data: Partial<Interview>) => void;
  deleteInterview: (id: string) => void;
  addTemplate: (template: TemplateItem) => void;
  updateTemplate: (id: string, data: Partial<TemplateItem>) => void;
  deleteTemplate: (id: string) => void;
  user: User | null;
  authReady: boolean;
  cloudConfigured: boolean;
  cloudSyncReady: boolean;
  signInWithEmail: (email: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  prepTarget: PrepTargetId;
  setPrepTarget: (t: PrepTargetId) => void;
  questionPool: Question[];
  poolCategories: string[];
  prepBrand: {
    id: PrepTargetId;
    label: string;
    brandHeading: string;
    brandSub: string;
    trackBlurb: string;
  };
};

const AppCtx = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const v = useContext(AppCtx);
  if (!v) throw new Error("useApp must be used within AppProvider");
  return v;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [tab, setTab] = useState<TabId>("dashboard");
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cloudSyncReady, setCloudSyncReady] = useState(false);

  const stateRef = useRef(state);
  const applyingRemoteRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveState(state);
  }, [state, hydrated]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  const prepTarget = resolvePrepTarget(state.prepTarget);

  const questionPool = useMemo(
    () => filterQuestionsForTarget(QUESTIONS, prepTarget),
    [prepTarget],
  );

  const poolCategories = useMemo(
    () => [...new Set(questionPool.map((q) => q.cat))].sort(),
    [questionPool],
  );

  const prepBrand = useMemo(
    () => ({
      id: prepTarget,
      ...PREP_TARGET_DEFS[prepTarget],
    }),
    [prepTarget],
  );

  useEffect(() => {
    document.title = prepTargetDocumentTitle(prepTarget);
  }, [prepTarget]);

  const [cloudConfigured, setCloudConfigured] = useState(false);

  useEffect(() => {
    setCloudConfigured(isSupabaseConfigured());
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!cloudConfigured) {
      setAuthReady(true);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    const client = supabase;

    async function runCloudMerge() {
      setCloudSyncReady(false);
      const row = await fetchTrackerRow(client);
      const local = stateRef.current;
      const remoteNorm = row?.payload
        ? normalizePayload(row.payload as unknown)
        : null;
      const { merged, shouldPushLocal } = mergeWithRemote(
        local,
        remoteNorm,
        row?.updated_at ?? null,
      );
      applyingRemoteRef.current = true;
      setState(merged);
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      applyingRemoteRef.current = false;
      if (shouldPushLocal) {
        await upsertTrackerRow(client, merged);
      }
      setCloudSyncReady(true);
    }

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
      if (session?.user && event === "SIGNED_IN") {
        void runCloudMerge();
      } else if (!session) {
        setCloudSyncReady(false);
      }
    });

    void client.auth
      .getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error("getSession", error.message);
          setCloudSyncReady(false);
          return;
        }
        setUser(session?.user ?? null);
        if (session?.user) {
          void runCloudMerge();
        } else {
          setCloudSyncReady(false);
        }
      })
      .catch((e: unknown) => {
        console.error("getSession", e);
        setCloudSyncReady(false);
      })
      .finally(() => {
        setAuthReady(true);
      });

    return () => subscription.unsubscribe();
  }, [hydrated, cloudConfigured]);

  useEffect(() => {
    if (!hydrated || !user || !cloudSyncReady || !cloudConfigured) return;
    if (applyingRemoteRef.current) return;
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    const id = window.setTimeout(() => {
      void upsertTrackerRow(supabase, stateRef.current);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [state, hydrated, user, cloudSyncReady, cloudConfigured]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return { error: "Cloud sync is not configured." };
    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return { error: "Enter a valid email address." };
    }
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/`
            : undefined,
      },
    });
    return error ? { error: error.message } : {};
  }, []);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    await supabase.auth.signOut();
    setCloudSyncReady(false);
  }, []);

  const todayFmt = () => new Date().toISOString().slice(0, 10);

  const setStatus = useCallback((id: number, status: string) => {
    setState((prev) => {
      const cur = prev.questions[id] || {};
      const wasDone = cur.status === "done";
      const becomeDone = status === "done";
      const t = todayFmt();
      const prevToday = prev.dailyDone[t] || 0;
      const delta =
        becomeDone && !wasDone ? 1 : wasDone && !becomeDone ? -1 : 0;
      const newCount = Math.max(0, prevToday + delta);
      let newStreak = prev.streak;
      if (becomeDone && !wasDone) {
        const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (prev.streak.lastDate !== t) {
          const nc = prev.streak.lastDate === yest ? prev.streak.current + 1 : 1;
          newStreak = {
            current: nc,
            best: Math.max(nc, prev.streak.best),
            lastDate: t,
          };
        }
      }
      return {
        ...prev,
        streak: newStreak,
        dailyDone: { ...prev.dailyDone, [t]: newCount },
        questions: {
          ...prev.questions,
          [id]: { ...cur, status, lastTouched: Date.now() },
        },
      };
    });
  }, []);

  const setNotes = useCallback((id: number, notes: string) => {
    setState((prev) => ({
      ...prev,
      questions: {
        ...prev.questions,
        [id]: { ...(prev.questions[id] || {}), notes },
      },
    }));
  }, []);

  const setDailyGoal = useCallback((g: number) => {
    setState((prev) => ({ ...prev, dailyGoal: g }));
  }, []);

  const setPrepTarget = useCallback((t: PrepTargetId) => {
    setState((prev) => ({ ...prev, prepTarget: t }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  }, []);

  const addInterview = useCallback((iv: Interview) => {
    setState((prev) => ({
      ...prev,
      interviews: [iv, ...(prev.interviews || [])],
    }));
  }, []);

  const updateInterview = useCallback((id: string, data: Partial<Interview>) => {
    setState((prev) => ({
      ...prev,
      interviews: (prev.interviews || []).map((iv) =>
        iv.id === id ? { ...iv, ...data } : iv,
      ),
    }));
  }, []);

  const deleteInterview = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      interviews: (prev.interviews || []).filter((iv) => iv.id !== id),
    }));
  }, []);

  const addTemplate = useCallback((template: TemplateItem) => {
    setState((prev) => ({
      ...prev,
      templates: [template, ...(prev.templates || [])],
    }));
  }, []);

  const updateTemplate = useCallback((id: string, data: Partial<TemplateItem>) => {
    setState((prev) => ({
      ...prev,
      templates: (prev.templates || []).map((template) =>
        template.id === id ? { ...template, ...data } : template,
      ),
    }));
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      templates: (prev.templates || []).filter((template) => template.id !== id),
    }));
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dsa-tracker-backup.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported!");
  }, [state, showToast]);

  const importData = useCallback(() => {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = ".json,application/json";
    inp.onchange = (e) => {
      const f = (e.target as HTMLInputElement).files?.[0];
      if (!f) return;
      const r = new FileReader();
      r.onload = (ev) => {
        try {
          const parsed = JSON.parse(String(ev.target?.result)) as Partial<AppState>;
          setState((p) => ({ ...p, ...parsed }));
          showToast("Imported!");
        } catch {
          showToast("Invalid file");
        }
      };
      r.readAsText(f);
    };
    inp.click();
  }, [showToast]);

  const resetProgress = useCallback(() => {
    if (typeof window !== "undefined" && window.confirm("Reset ALL progress?")) {
      setState((prev) => ({
        ...DEFAULT_STATE,
        prepTarget: prev.prepTarget,
        theme: prev.theme,
      }));
      showToast("Reset.");
    }
  }, [showToast]);

  const value = useMemo(
    () => ({
      state,
      tab,
      setTab,
      toast,
      setStatus,
      setNotes,
      setDailyGoal,
      toggleTheme,
      showToast,
      exportData,
      importData,
      resetProgress,
      addInterview,
      updateInterview,
      deleteInterview,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      user,
      authReady,
      cloudConfigured,
      cloudSyncReady,
      signInWithEmail,
      signOut,
      prepTarget,
      setPrepTarget,
      questionPool,
      poolCategories,
      prepBrand,
    }),
    [
      state,
      tab,
      toast,
      setStatus,
      setNotes,
      setDailyGoal,
      setPrepTarget,
      toggleTheme,
      showToast,
      exportData,
      importData,
      resetProgress,
      addInterview,
      updateInterview,
      deleteInterview,
      addTemplate,
      updateTemplate,
      deleteTemplate,
      user,
      authReady,
      cloudConfigured,
      cloudSyncReady,
      signInWithEmail,
      signOut,
      prepTarget,
      questionPool,
      poolCategories,
      prepBrand,
    ],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
