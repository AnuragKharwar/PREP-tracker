"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { COMPANIES, DIFFS } from "@/lib/constants";
import type { Question } from "@/lib/types";
import { QItem } from "./QItem";

export function QuestionList() {
  const { state, setStatus, setNotes, questionPool, poolCategories, prepBrand } =
    useApp();
  const [search, setSearch] = useState("");
  const [fDiff, setFDiff] = useState("");
  const [fCat, setFCat] = useState("");
  const [fCo, setFCo] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [sortBy, setSortBy] = useState("num");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setFCat((prev) => (prev && !poolCategories.includes(prev) ? "" : prev));
  }, [poolCategories]);

  const filtered = useMemo(() => {
    let qs = questionPool;
    if (search) {
      const s = search.toLowerCase();
      qs = qs.filter(
        (q) =>
          q.title.toLowerCase().includes(s) ||
          q.pat.toLowerCase().includes(s) ||
          String(q.num).includes(s),
      );
    }
    if (fDiff) qs = qs.filter((q) => q.diff === fDiff);
    if (fCat) qs = qs.filter((q) => q.cat === fCat);
    if (fCo) qs = qs.filter((q) => q.companies.includes(fCo));
    if (fStatus)
      qs = qs.filter(
        (q) => ((state.questions[q.id] || {}).status || "untouched") === fStatus,
      );
    const diffOrder: Record<string, number> = { Easy: 0, Medium: 1, Hard: 2 };
    return [...qs].sort((a, b) => {
      if (sortBy === "num") return a.num - b.num;
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return diffOrder[a.diff] - diffOrder[b.diff];
    });
  }, [search, fDiff, fCat, fCo, fStatus, sortBy, state.questions, questionPool]);

  const grouped = useMemo(() => {
    const m: Record<string, Question[]> = {};
    filtered.forEach((q) => {
      if (!m[q.cat]) m[q.cat] = [];
      m[q.cat].push(q);
    });
    return m;
  }, [filtered]);

  const done = questionPool.filter(
    (q) => (state.questions[q.id] || {}).status === "done",
  ).length;
  const hasF = search || fDiff || fCat || fCo || fStatus;

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Questions</h2>
          <p>
            {done} of {questionPool.length} solved ({prepBrand.label}) · {filtered.length}{" "}
            shown
          </p>
        </div>
      </div>

      <div className="qf">
        <input
          className="input"
          style={{ flex: 1, maxWidth: 260 }}
          placeholder="Search title, pattern, LC#..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input" value={fDiff} onChange={(e) => setFDiff(e.target.value)}>
          <option value="">All difficulties</option>
          {DIFFS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select className="input" value={fCat} onChange={(e) => setFCat(e.target.value)}>
          <option value="">All topics</option>
          {poolCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="input" value={fCo} onChange={(e) => setFCo(e.target.value)}>
          <option value="">All companies</option>
          {COMPANIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select className="input" value={fStatus} onChange={(e) => setFStatus(e.target.value)}>
          <option value="">All status</option>
          <option value="done">Done ✓</option>
          <option value="review">Review ↺</option>
          <option value="starred">Starred ★</option>
          <option value="untouched">Untouched</option>
        </select>
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="num">Sort: LC#</option>
          <option value="title">Sort: Title</option>
          <option value="diff">Sort: Difficulty</option>
        </select>
        {hasF && (
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => {
              setSearch("");
              setFDiff("");
              setFCat("");
              setFCo("");
              setFStatus("");
            }}
            style={{ color: "var(--coral)" }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {!filtered.length && (
        <div className="empty-state">
          <div style={{ fontSize: 32 }}>🔍</div>
          <p>No questions match your filters</p>
        </div>
      )}

      {Object.keys(grouped).map((cat) => {
        const qs = grouped[cat];
        const cd = qs.filter(
          (q) => (state.questions[q.id] || {}).status === "done",
        ).length;
        const isOpen = collapsed[cat] !== true;
        return (
          <div key={cat} style={{ marginBottom: 20 }}>
            <div className="cat-hdr" onClick={() => setCollapsed((p) => ({ ...p, [cat]: isOpen }))}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: "var(--text3)", fontSize: 12 }}>{isOpen ? "▼" : "▶"}</span>
                <h2 style={{ textTransform: "none", letterSpacing: 0, fontSize: 13 }}>{cat}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    height: 4,
                    width: 80,
                    background: "var(--bg4)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.round((cd / qs.length) * 100)}%`,
                      background: "var(--accent)",
                      borderRadius: 2,
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                  {cd}/{qs.length}
                </span>
              </div>
            </div>
            {isOpen && (
              <div className="q-list">
                {qs.map((q) => (
                  <QItem
                    key={q.id}
                    q={q}
                    qData={state.questions[q.id] || {}}
                    onStatus={setStatus}
                    onNote={setNotes}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
