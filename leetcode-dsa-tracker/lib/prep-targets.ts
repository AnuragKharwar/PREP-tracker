import type { PrepTargetId, Question } from "./types";

/** Categories emphasized for UI / FE-style interviews (medium depth). */
const UI_CORE_CATS = new Set([
  "Hashing",
  "Sliding Window",
  "Two Pointers",
  "Arrays & Strings",
  "Stack & Queue",
  "Linked List",
  "Trees",
]);

/** Hard problems allowed on UI2 track (senior UI). */
const UI2_HARD_CATS = new Set([
  "Trees",
  "Heap / Priority Queue",
  "Graphs",
  "Stack & Queue",
]);

export const PREP_TARGET_IDS: PrepTargetId[] = [
  "confidence",
  "sde1",
  "sde2",
  "ui1",
  "ui2",
];

export const PREP_TARGET_DEFS: Record<
  PrepTargetId,
  {
    /** Short label for select */
    label: string;
    /** Sidebar / login main title */
    brandHeading: string;
    /** Small line under title */
    brandSub: string;
    /** Dashboard subtitle */
    trackBlurb: string;
  }
> = {
  confidence: {
    label: "Confidence — easy only",
    brandHeading: "Easy confidence",
    brandSub: "DSA Tracker",
    trackBlurb: "Easy problems only — build momentum before leveling up.",
  },
  sde1: {
    label: "SDE 1",
    brandHeading: "FE SDE1",
    brandSub: "DSA Tracker",
    trackBlurb: "Easy + Medium — typical SDE1 prep scope.",
  },
  sde2: {
    label: "SDE 2",
    brandHeading: "FE SDE2",
    brandSub: "DSA Tracker",
    trackBlurb: "Full question bank including Hard — SDE2 depth.",
  },
  ui1: {
    label: "UI engineer 1",
    brandHeading: "FE UI1",
    brandSub: "DSA Tracker",
    trackBlurb: "All Easy + core Medium patterns common in UI / FE screens.",
  },
  ui2: {
    label: "UI engineer 2",
    brandHeading: "FE UI2",
    brandSub: "DSA Tracker",
    trackBlurb: "Full Medium coverage + Hard in trees, graphs, heaps & stacks.",
  },
};

export function resolvePrepTarget(id: PrepTargetId | undefined): PrepTargetId {
  if (id && PREP_TARGET_IDS.includes(id)) return id;
  return "sde2";
}

export function filterQuestionsForTarget(
  all: Question[],
  target: PrepTargetId | undefined,
): Question[] {
  const t = resolvePrepTarget(target);
  switch (t) {
    case "confidence":
      return all.filter((q) => q.diff === "Easy");
    case "sde1":
      return all.filter((q) => q.diff !== "Hard");
    case "sde2":
      return all;
    case "ui1":
      return all.filter((q) => {
        if (q.diff === "Easy") return true;
        if (q.diff === "Medium") return UI_CORE_CATS.has(q.cat);
        return false;
      });
    case "ui2":
      return all.filter((q) => {
        if (q.diff === "Easy" || q.diff === "Medium") return true;
        return q.diff === "Hard" && UI2_HARD_CATS.has(q.cat);
      });
    default:
      return all;
  }
}

export function prepTargetDocumentTitle(id: PrepTargetId): string {
  const d = PREP_TARGET_DEFS[id];
  return `${d.brandHeading} — DSA Prep Tracker`;
}
