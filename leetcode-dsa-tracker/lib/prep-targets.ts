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

export const PREP_TARGET_IDS: PrepTargetId[] = [
  "confidence",
  "frontend",
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
  frontend: {
    label: "Frontend Developer",
    brandHeading: "Frontend Developer",
    brandSub: "DSA Tracker",
    trackBlurb: "Frontend-specific DSA prep with the full question bank.",
  },
};

export function resolvePrepTarget(id: PrepTargetId | undefined): PrepTargetId {
  if (id && PREP_TARGET_IDS.includes(id)) return id;
  return "frontend";
}

export function filterQuestionsForTarget(
  all: Question[],
  target: PrepTargetId | undefined,
): Question[] {
  const t = resolvePrepTarget(target);
  switch (t) {
    case "confidence":
      return all.filter((q) => q.diff === "Easy");
    case "frontend":
      return all;
    default:
      return all;
  }
}

export function prepTargetDocumentTitle(id: PrepTargetId): string {
  const d = PREP_TARGET_DEFS[id];
  return `${d.brandHeading} — DSA Prep Tracker`;
}
