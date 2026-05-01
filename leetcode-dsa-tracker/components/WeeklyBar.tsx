export function WeeklyBar({
  dailyDone,
  goal,
}: {
  dailyDone: Record<string, number>;
  goal: number;
}) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const k = d.toISOString().slice(0, 10);
    const label = ["S", "M", "T", "W", "T", "F", "S"][d.getDay()];
    const count = dailyDone[k] || 0;
    return {
      k,
      label,
      count,
      pct: Math.min(1, count / Math.max(goal, 1)),
      isToday: i === 6,
    };
  });

  return (
    <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 60 }}>
      {days.map((d) => (
        <div
          key={d.k}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 44,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                width: "100%",
                height: `${Math.max(d.pct * 44, d.count > 0 ? 4 : 0)}px`,
                background: d.isToday
                  ? "var(--accent)"
                  : d.count > 0
                    ? "var(--teal)"
                    : "var(--bg4)",
                borderRadius: "3px 3px 0 0",
                transition: "height 0.4s",
              }}
            />
          </div>
          <span
            style={{
              fontSize: 10,
              color: d.isToday ? "var(--accent)" : "var(--text3)",
              fontFamily: "var(--mono)",
            }}
          >
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}
