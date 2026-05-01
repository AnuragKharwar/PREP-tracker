import { QUESTIONS } from "./questions";

export const CATS = [...new Set(QUESTIONS.map((q) => q.cat))];

export const COMPANIES = [...new Set(QUESTIONS.flatMap((q) => q.companies))].sort();

export const DIFFS = ["Easy", "Medium", "Hard"] as const;

export const STATUS_OPTS = [
  "Applied",
  "Screening",
  "Technical",
  "HR",
  "Offer",
  "Rejected",
  "Ghosted",
] as const;

export const STATUS_CLS: Record<string, string> = {
  Applied: "b-applied",
  Screening: "b-screening",
  Technical: "b-technical",
  HR: "b-pat",
  Offer: "b-offer",
  Rejected: "b-rejected",
  Ghosted: "b-ghosted",
};

export const COMPANY_HIGHLIGHTS = [
  "Google",
  "Meta",
  "Amazon",
  "Flipkart",
  "Razorpay",
  "Zepto",
  "Swiggy",
  "Uber",
] as const;
