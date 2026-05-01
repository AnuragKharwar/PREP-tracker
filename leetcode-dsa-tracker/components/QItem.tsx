"use client";

import { useState } from "react";
import type { Question, QuestionEntry } from "@/lib/types";
import { slugify } from "@/lib/utils";

export function QItem({
  q,
  qData,
  onStatus,
  onNote,
}: {
  q: Question;
  qData: QuestionEntry;
  onStatus: (id: number, status: string) => void;
  onNote: (id: number, note: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(qData.notes || "");
  const status = qData.status || "untouched";

  function cycle(e: React.MouseEvent, next: string) {
    e.stopPropagation();
    onStatus(q.id, status === next ? "untouched" : next);
  }

  const lcUrl = `https://leetcode.com/problems/${slugify(q.title)}/`;

  return (
    <div
      className={`q-item${status !== "untouched" ? ` is-${status}` : ""}`}
    >
      <div className="q-hdr" onClick={() => setOpen((x) => !x)} role="presentation">
        <span className="q-num">#{q.num}</span>
        <span className={`q-title${status === "done" ? " x" : ""}`}>{q.title}</span>
        <div className="q-meta">
          <span className={`badge b-${q.diff.toLowerCase()}`}>{q.diff}</span>
        </div>
        <div className="q-acts" onClick={(e) => e.stopPropagation()} role="presentation">
          <button
            type="button"
            className={`q-btn${status === "done" ? " a-done" : ""}`}
            onClick={(e) => cycle(e, "done")}
            title="Done"
          >
            ✓
          </button>
          <button
            type="button"
            className={`q-btn${status === "review" ? " a-review" : ""}`}
            onClick={(e) => cycle(e, "review")}
            title="Review"
          >
            ↺
          </button>
          <button
            type="button"
            className={`q-btn${status === "starred" ? " a-star" : ""}`}
            onClick={(e) => cycle(e, "starred")}
            title="Star"
          >
            ★
          </button>
          <button
            type="button"
            className="q-btn"
            onClick={(e) => {
              e.stopPropagation();
              setOpen((x) => !x);
            }}
            style={{ color: "var(--text3)" }}
          >
            {open ? "▲" : "▼"}
          </button>
        </div>
      </div>
      {open && (
        <div className="q-expand">
          <div className="q-exp-row">
            <span className="q-exp-lbl">Pattern</span>
            <span className="badge b-pat">{q.pat}</span>
          </div>
          <div className="q-exp-row">
            <span className="q-exp-lbl">Topic</span>
            <span className="badge b-cat">{q.cat}</span>
          </div>
          <div className="q-exp-row">
            <span className="q-exp-lbl">Companies</span>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {q.companies.map((c) => (
                <span key={c} className="badge b-co">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="q-exp-row">
            <span className="q-exp-lbl">LeetCode</span>
            <a href={lcUrl} target="_blank" rel="noopener noreferrer" className="lc-link">
              #{q.num} ↗
            </a>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>Your notes</div>
            <textarea
              className="input"
              placeholder="Approach, time complexity, key insight..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => onNote(q.id, note)}
              style={{ fontSize: 13, lineHeight: 1.6 }}
            />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className={`btn btn-sm${status === "done" ? " btn-p" : ""}`}
              onClick={(e) => cycle(e, "done")}
            >
              {status === "done" ? "✓ Done" : "Mark done"}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={
                status === "review"
                  ? { color: "var(--amber)", borderColor: "rgba(251,191,36,.4)" }
                  : {}
              }
              onClick={(e) => cycle(e, "review")}
            >
              {status === "review" ? "↺ In review" : "Mark review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
