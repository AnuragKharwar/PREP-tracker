"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import { COMPANY_HIGHLIGHTS, DIFFS } from "@/lib/constants";
import { today } from "@/lib/utils";
import { Donut } from "./Donut";
import { MotivationCard } from "./MotivationCard";
import { WeeklyBar } from "./WeeklyBar";

export function Dashboard() {
  const { state, setDailyGoal, showToast, questionPool, poolCategories, prepBrand } =
    useApp();
  const [editGoal, setEditGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(state.dailyGoal));

  const total = questionPool.length;
  const done = questionPool.filter(
    (q) => (state.questions[q.id] || {}).status === "done",
  ).length;
  const review = questionPool.filter(
    (q) => (state.questions[q.id] || {}).status === "review",
  ).length;
  const starred = questionPool.filter(
    (q) => (state.questions[q.id] || {}).status === "starred",
  ).length;
  const pct = Math.round((done / total) * 100);
  const todayStr = today();
  const todayDone = state.dailyDone[todayStr] || 0;
  const goalPct = Math.min(100, Math.round((todayDone / state.dailyGoal) * 100));

  const catStats = useMemo(
    () =>
      poolCategories
        .map((cat) => {
          const qs = questionPool.filter((q) => q.cat === cat);
          const d = qs.filter(
            (q) => (state.questions[q.id] || {}).status === "done",
          ).length;
          return { cat, total: qs.length, done: d };
        })
        .sort((a, b) => b.done / b.total - a.done / a.total),
    [questionPool, poolCategories, state.questions],
  );

  const diffColors: Record<string, string> = {
    Easy: "var(--easy)",
    Medium: "var(--amber)",
    Hard: "var(--coral)",
  };

  const streakDots = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.now() - (6 - i) * 86400000).toISOString().slice(0, 10);
    return {
      date,
      done: (state.dailyDone[date] || 0) > 0,
      isToday: i === 6,
    };
  });

  const weekTotal = Object.entries(state.dailyDone)
    .filter(([k]) => (Date.now() - new Date(k).getTime()) / 86400000 <= 7)
    .reduce((s, [, v]) => s + v, 0);

  function saveGoal() {
    const g = Math.max(1, Math.min(50, parseInt(goalInput, 10) || 5));
    setDailyGoal(g);
    setEditGoal(false);
    showToast(`Daily goal → ${g}`);
  }

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Dashboard</h2>
          <p>{prepBrand.trackBlurb}</p>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
      <div className="streak-widget">
        <div className="streak-fire">🔥</div>
        <div className="streak-info">
          <h3 style={{ fontFamily: "var(--mono)" }}>
            {state.streak.current} day streak
            {state.streak.best > 0 && (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text3)",
                  fontWeight: 400,
                  marginLeft: 8,
                }}
              >
                Best: {state.streak.best}d
              </span>
            )}
          </h3>
          <p>Solve at least 1 question/day to maintain streak</p>
        </div>
        <div className="streak-days">
          {streakDots.map((d) => (
            <div
              key={d.date}
              className={`s-day${d.done ? " done" : ""}${d.isToday ? " today" : ""}`}
            >
              {["M", "T", "W", "T", "F", "S", "S"][(new Date(d.date).getDay() + 6) % 7]}
            </div>
          ))}
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card" style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ position: "relative", display: "inline-flex" }}>
            <Donut pct={pct} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 600,
                  fontFamily: "var(--mono)",
                  color: "var(--accent)",
                }}
              >
                {pct}%
              </span>
            </div>
          </div>
          <div>
            <div className="stat-label">Overall</div>
            <div className="stat-value" style={{ color: "var(--accent)" }}>
              {done}
            </div>
            <div className="stat-sub">of {total} solved</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Today&apos;s goal</div>
          {editGoal ? (
            <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 6 }}>
              <input
                className="input"
                type="number"
                min={1}
                max={50}
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                style={{ width: 70, padding: "4px 8px", fontSize: 14 }}
                autoFocus
              />
              <button type="button" className="btn btn-sm btn-p" onClick={saveGoal}>
                Save
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <div
                  className="stat-value"
                  style={{ color: goalPct >= 100 ? "var(--accent)" : "var(--amber)" }}
                >
                  {todayDone}
                </div>
                <span style={{ fontSize: 14, color: "var(--text3)" }}>
                  / {state.dailyGoal}
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 4,
                  background: "var(--bg4)",
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${goalPct}%`,
                    background: goalPct >= 100 ? "var(--accent)" : "var(--amber)",
                    borderRadius: 2,
                    transition: "width 0.4s",
                  }}
                />
              </div>
              <div
                className="stat-sub"
                style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}
              >
                <span>
                  {goalPct >= 100 ? "🎉 Done!" : `${state.dailyGoal - todayDone} left`}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditGoal(true);
                    setGoalInput(String(state.dailyGoal));
                  }}
                  style={{
                    fontSize: 11,
                    color: "var(--blue)",
                    cursor: "pointer",
                    padding: 0,
                    background: "none",
                    border: "none",
                  }}
                >
                  Edit
                </button>
              </div>
            </>
          )}
        </div>

        <div className="stat-card">
          <div className="stat-label">Review / Starred</div>
          <div className="stat-value" style={{ color: "var(--amber)" }}>
            {review}
          </div>
          <div className="stat-sub">
            {starred} starred · {total - done - review - starred} untouched
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-label">This week</div>
          <div className="stat-value" style={{ color: "var(--blue)" }}>
            {weekTotal}
          </div>
          <div className="stat-sub">questions solved</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Progress by topic</h3>
            <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
              {done}/{total}
            </span>
          </div>
          {catStats.map(({ cat, total: t, done: d }) => (
            <div key={cat} className="cat-bar-row">
              <div className="cat-bar-label" title={cat}>
                {cat}
              </div>
              <div className="cat-bar-track">
                <div className="cat-bar-fill" style={{ width: `${Math.round((d / t) * 100)}%` }} />
              </div>
              <div className="cat-bar-count">
                {d}/{t}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="card">
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
              Difficulty breakdown
            </h3>
            {DIFFS.map((d) => {
              const qs = questionPool.filter((q) => q.diff === d);
              const dn = qs.filter(
                (q) => (state.questions[q.id] || {}).status === "done",
              ).length;
              return (
                <div key={d} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: diffColors[d] }}>{d}</span>
                    <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                      {dn}/{qs.length}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "var(--bg4)",
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.round((dn / qs.length) * 100)}%`,
                        background: diffColors[d],
                        borderRadius: 3,
                        transition: "width 0.4s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 14,
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 600 }}>Weekly activity</h3>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>
                goal: {state.dailyGoal}/day
              </span>
            </div>
            <WeeklyBar dailyDone={state.dailyDone} goal={state.dailyGoal} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
          Company question coverage
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {COMPANY_HIGHLIGHTS.map((co) => {
            const qs = questionPool.filter((q) => q.companies.includes(co));
            const cd = qs.filter(
              (q) => (state.questions[q.id] || {}).status === "done",
            ).length;
            const cp = Math.round((cd / qs.length) * 100);
            return (
              <div
                key={co}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r)",
                  padding: "10px 14px",
                  minWidth: 110,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{co}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                    {cd}/{qs.length}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color:
                        cp >= 70 ? "var(--accent)" : cp >= 40 ? "var(--amber)" : "var(--text3)",
                    }}
                  >
                    {cp}%
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    background: "var(--bg4)",
                    borderRadius: 2,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${cp}%`,
                      background:
                        cp >= 70 ? "var(--accent)" : cp >= 40 ? "var(--amber)" : "var(--coral)",
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
        </div>

        <aside className="dashboard-motivation" aria-label="Daily motivation">
          <MotivationCard done={done} total={total} variant="aside" />
        </aside>
      </div>
    </div>
  );
}
