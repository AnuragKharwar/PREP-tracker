"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "@/lib/app-context";
import { DIFFS } from "@/lib/constants";
import { fmtTime, shuffle, slugify } from "@/lib/utils";
import type { Question } from "@/lib/types";

type Phase = "config" | "session" | "done";

type StudyCfg = {
  count: number;
  mins: number;
  diff: string;
  cat: string;
  unsolved: boolean;
  reviewOnly: boolean;
};

export function StudyMode() {
  const { state, setStatus, showToast, questionPool, poolCategories, prepBrand } =
    useApp();
  const [phase, setPhase] = useState<Phase>("config");
  const [cfg, setCfg] = useState<StudyCfg>({
    count: 10,
    mins: 30,
    diff: "",
    cat: "",
    unsolved: false,
    reviewOnly: false,
  });
  const [queue, setQueue] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<{ id: number; rated: string }[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (running && timeLeft === 0) {
        setRunning(false);
        showToast("⏰ Time's up!");
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, timeLeft, showToast]);

  useEffect(() => {
    setCfg((prev) => ({
      ...prev,
      cat: prev.cat && !poolCategories.includes(prev.cat) ? "" : prev.cat,
    }));
  }, [poolCategories]);

  const diffsInPool = useMemo(
    () => DIFFS.filter((d) => questionPool.some((q) => q.diff === d)),
    [questionPool],
  );

  function start() {
    const pool = questionPool.filter((q) => {
      if (cfg.diff && q.diff !== cfg.diff) return false;
      if (cfg.cat && q.cat !== cfg.cat) return false;
      if (cfg.unsolved && (state.questions[q.id] || {}).status === "done") return false;
      if (cfg.reviewOnly && (state.questions[q.id] || {}).status !== "review") return false;
      return true;
    });
    if (!pool.length) {
      showToast("No questions match!");
      return;
    }
    const picked = shuffle(pool).slice(0, Math.min(cfg.count, pool.length));
    setQueue(picked);
    setIdx(0);
    setRevealed(false);
    setResults([]);
    setTimeLeft(cfg.mins * 60);
    setRunning(true);
    setPhase("session");
  }

  function rate(rating: string) {
    const q = queue[idx];
    setResults((r) => [...r, { id: q.id, rated: rating }]);
    if (rating === "done") setStatus(q.id, "done");
    if (rating === "review") setStatus(q.id, "review");
    if (idx + 1 >= queue.length) {
      setRunning(false);
      setPhase("done");
    } else {
      setIdx((i) => i + 1);
      setRevealed(false);
    }
  }

  const tc = timeLeft < 60 ? "danger" : timeLeft < 180 ? "warn" : "";
  const cur = queue[idx];

  if (phase === "done") {
    const dc = results.filter((r) => r.rated === "done").length;
    const rc = results.filter((r) => r.rated === "review").length;
    const sc = results.filter((r) => r.rated === "skip").length;
    return (
      <div>
        <div className="ph">
          <h2>Study Mode</h2>
        </div>
        <div className="card">
          <div className="sess-summary">
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
            <h3>Session complete!</h3>
            <p style={{ color: "var(--text2)", marginTop: 4 }}>
              Worked through {results.length} of {queue.length} questions
            </p>
            <div className="sess-stats">
              <div>
                <div className="ss-val" style={{ color: "var(--accent)" }}>
                  {dc}
                </div>
                <div className="ss-lbl">Got it</div>
              </div>
              <div>
                <div className="ss-val" style={{ color: "var(--amber)" }}>
                  {rc}
                </div>
                <div className="ss-lbl">Review</div>
              </div>
              <div>
                <div className="ss-val" style={{ color: "var(--text3)" }}>
                  {sc}
                </div>
                <div className="ss-lbl">Skipped</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button type="button" className="btn btn-p" onClick={start}>
                New session
              </button>
              <button type="button" className="btn" onClick={() => setPhase("config")}>
                Change config
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "session" && cur) {
    const qData = state.questions[cur.id] || {};
    const lc = `https://leetcode.com/problems/${slugify(cur.title)}/`;
    const pct = Math.round((idx / queue.length) * 100);

    return (
      <div>
        <div className="ph">
          <div>
            <h2>Study Mode</h2>
            <p>
              Question {idx + 1} of {queue.length}
            </p>
          </div>
          <div className="ph-actions">
            <div className={`study-timer ${tc}`}>{fmtTime(timeLeft)}</div>
            <button type="button" className="btn btn-sm" onClick={() => setRunning((r) => !r)}>
              {running ? "⏸ Pause" : "▶ Resume"}
            </button>
            <button
              type="button"
              className="btn btn-sm"
              style={{ color: "var(--coral)" }}
              onClick={() => {
                setRunning(false);
                setPhase("done");
              }}
            >
              End
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 12,
              color: "var(--text3)",
            }}
          >
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div
            style={{
              height: 4,
              background: "var(--bg4)",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: "var(--teal)",
                borderRadius: 2,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>

        <div className="study-card">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span className="badge b-cat">{cur.cat}</span>
            <span className={`badge b-${cur.diff.toLowerCase()}`}>{cur.diff}</span>
            {qData.status === "done" && <span className="badge b-done">Previously solved</span>}
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                color: "var(--text3)",
                marginBottom: 8,
              }}
            >
              LeetCode #{cur.num}
            </div>
            <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.3, color: "var(--text)" }}>
              {cur.title}
            </div>
          </div>
          {!revealed ? (
            <button type="button" className="btn" style={{ marginTop: 8 }} onClick={() => setRevealed(true)}>
              Reveal pattern hint
            </button>
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>Pattern</div>
              <div style={{ fontSize: 13, color: "var(--text2)", fontFamily: "var(--mono)" }}>
                {cur.pat}
              </div>
              {qData.notes && (
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 16px",
                    background: "var(--bg3)",
                    borderRadius: "var(--r)",
                    fontSize: 13,
                    color: "var(--text2)",
                    maxWidth: 380,
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>
                    Your notes
                  </div>
                  {qData.notes}
                </div>
              )}
            </div>
          )}
          <a href={lc} target="_blank" rel="noopener noreferrer" className="lc-link">
            Open on LeetCode ↗
          </a>
          <div style={{ width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 10 }}>How did it go?</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                className="btn"
                style={{ color: "var(--accent)", borderColor: "rgba(74,222,128,.3)" }}
                onClick={() => rate("done")}
              >
                ✓ Got it
              </button>
              <button
                type="button"
                className="btn"
                style={{ color: "var(--amber)", borderColor: "rgba(251,191,36,.3)" }}
                onClick={() => rate("review")}
              >
                ↺ Review
              </button>
              <button type="button" className="btn" style={{ color: "var(--text3)" }} onClick={() => rate("skip")}>
                → Skip
              </button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", gap: 5, flexWrap: "wrap" }}>
          {queue.map((q, i) => {
            const r = results.find((res) => res.id === q.id);
            const isCur = i === idx;
            return (
              <div
                key={q.id}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 10,
                  fontFamily: "var(--mono)",
                  background: isCur
                    ? "var(--teal)"
                    : r
                      ? r.rated === "done"
                        ? "rgba(74,222,128,.2)"
                        : r.rated === "review"
                          ? "rgba(251,191,36,.2)"
                          : "var(--bg4)"
                      : "var(--bg4)",
                  color: isCur
                    ? "#000"
                    : r
                      ? r.rated === "done"
                        ? "var(--accent)"
                        : r.rated === "review"
                          ? "var(--amber)"
                          : "var(--text3)"
                      : "var(--text3)",
                  border: isCur ? "1px solid var(--teal)" : "1px solid var(--border)",
                }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Study Mode</h2>
          <p>
            {prepBrand.trackBlurb} · Pool: {questionPool.length} questions
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 680 }}>
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Session setup</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Questions</label>
              <input
                className="input"
                type="number"
                min={1}
                max={Math.max(1, Math.min(80, questionPool.length))}
                value={cfg.count}
                onChange={(e) =>
                  setCfg((c) => ({ ...c, count: parseInt(e.target.value, 10) || 10 }))
                }
              />
            </div>
            <div className="form-group">
              <label className="form-label">Timer</label>
              <select
                className="input"
                value={cfg.mins}
                onChange={(e) =>
                  setCfg((c) => ({ ...c, mins: parseInt(e.target.value, 10) }))
                }
              >
                {[10, 20, 30, 45, 60, 90].map((m) => (
                  <option key={m} value={m}>
                    {m} min
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select
                className="input"
                value={cfg.diff}
                onChange={(e) => setCfg((c) => ({ ...c, diff: e.target.value }))}
              >
                <option value="">All (in track)</option>
                {diffsInPool.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Topic</label>
              <select
                className="input"
                value={cfg.cat}
                onChange={(e) => setCfg((c) => ({ ...c, cat: e.target.value }))}
              >
                <option value="">All (in track)</option>
                {poolCategories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            {(
              [
                ["Only unsolved", "unsolved"],
                ["Review only", "reviewOnly"],
              ] as const
            ).map(([lbl, k]) => (
              <label
                key={k}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  cursor: "pointer",
                  color: "var(--text2)",
                }}
              >
                <input
                  type="checkbox"
                  checked={cfg[k]}
                  onChange={(e) =>
                    setCfg((c) => {
                      const n = { ...c, [k]: e.target.checked };
                      if (e.target.checked) {
                        if (k === "unsolved") n.reviewOnly = false;
                        else n.unsolved = false;
                      }
                      return n;
                    })
                  }
                />
                {lbl}
              </label>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-p"
            onClick={start}
            style={{ width: "100%", justifyContent: "center", padding: "12px" }}
          >
            ▶ Start Session
          </button>
        </div>
        <div
          className="card"
          style={{
            background: "rgba(45,212,191,.05)",
            borderColor: "rgba(45,212,191,.2)",
          }}
        >
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--teal)", marginBottom: 10 }}>
            Study tips · {prepBrand.label}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[
              ["Identify the pattern first", "before writing a single line of code."],
              ["Verbalize your approach", "interviewers value thought process over code."],
              ["Target 20-25 min for Mediums", "and 35-40 min for Hards."],
              ["Re-attempt review questions", "at least twice before your interview day."],
            ].map(([h, p], i) => (
              <div key={i} style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.5 }}>
                <strong style={{ color: "var(--text)", fontWeight: 500 }}>{h}</strong> {p}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
