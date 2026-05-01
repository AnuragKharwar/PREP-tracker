export type PrepTargetId =
  | "confidence"
  | "sde1"
  | "sde2"
  | "ui1"
  | "ui2";

export type Question = {
  id: number;
  num: number;
  title: string;
  diff: string;
  cat: string;
  companies: string[];
  pat: string;
};

export type QuestionEntry = {
  status?: string;
  notes?: string;
  lastTouched?: number;
};

export type InterviewRound = { name: string; status: string };

export type Interview = {
  id: string;
  company: string;
  role: string;
  status: string;
  date: string;
  notes: string;
  rounds: InterviewRound[];
};

export type AppState = {
  /** Interview prep track — filters which questions count for this app */
  prepTarget?: PrepTargetId;
  questions: Record<number, QuestionEntry>;
  dailyGoal: number;
  streak: { current: number; best: number; lastDate: string };
  theme: "dark" | "light";
  interviews: Interview[];
  dailyDone: Record<string, number>;
  /** Client-only: last local save time (ms), used to resolve sync conflicts with cloud `updated_at`. */
  lastModified?: number;
};

export type TabId = "dashboard" | "questions" | "study" | "interviews" | "frontend";
