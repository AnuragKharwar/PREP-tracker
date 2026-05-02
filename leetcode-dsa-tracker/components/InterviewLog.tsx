"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import { STATUS_CLS, STATUS_OPTS } from "@/lib/constants";
import type { Interview, InterviewRound } from "@/lib/types";
import { today } from "@/lib/utils";

function emptyForm() {
  return {
    company: "",
    role: "Frontend Developer",
    status: "Applied",
    date: today(),
    notes: "",
    rounds: [] as InterviewRound[],
  };
}

function IVModal({
  onClose,
  onSave,
  initial,
}: {
  onClose: () => void;
  onSave: (iv: Interview) => void;
  initial?: Interview | null;
}) {
  const [form, setForm] = useState(() =>
    initial
      ? {
          company: initial.company,
          role: initial.role,
          status: initial.status,
          date: initial.date,
          notes: initial.notes,
          rounds: [...(initial.rounds || [])],
        }
      : emptyForm(),
  );
  const [nr, setNr] = useState("");

  function addRound() {
    if (!nr.trim()) return;
    setForm((f) => ({ ...f, rounds: [...f.rounds, { name: nr.trim(), status: "Pending" }] }));
    setNr("");
  }

  function save() {
    if (!form.company.trim()) return;
    const id = initial?.id ?? Date.now().toString();
    onSave({ ...form, id });
    onClose();
  }

  const isEdit = Boolean(initial);

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{isEdit ? "Edit interview" : "Log Interview"}</h3>
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Company *</label>
            <input
              className="input"
              placeholder="e.g. Razorpay"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              autoFocus
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                className="input"
                value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date applied</label>
              <input
                className="input"
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Rounds</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <input
                className="input"
                placeholder="e.g. DSA Round 1"
                value={nr}
                onChange={(e) => setNr(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addRound()}
              />
              <button type="button" className="btn btn-sm" onClick={addRound}>
                Add
              </button>
            </div>
            {form.rounds.map((r, i) => (
              <div key={r.name + String(i)} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ flex: 1, fontSize: 13, color: "var(--text2)" }}>• {r.name}</span>
                <select
                  style={{
                    fontSize: 12,
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    padding: "3px 6px",
                    color: "var(--text)",
                    cursor: "pointer",
                  }}
                  value={r.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      rounds: f.rounds.map((rr, ii) =>
                        ii === i ? { ...rr, status: e.target.value } : rr,
                      ),
                    }))
                  }
                >
                  <option>Pending</option>
                  <option>Done</option>
                  <option>Passed</option>
                  <option>Failed</option>
                </select>
                <button
                  type="button"
                  onClick={() =>
                    setForm((f) => ({
                      ...f,
                      rounds: f.rounds.filter((_, ii) => ii !== i),
                    }))
                  }
                  style={{
                    color: "var(--coral)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              className="input"
              placeholder="Recruiter name, offer details, impressions..."
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-p" onClick={save}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function IVCard({
  iv,
  onUpdate,
  onDelete,
  onEdit,
}: {
  iv: Interview;
  onUpdate: (id: string, data: Partial<Interview>) => void;
  onDelete: (id: string) => void;
  onEdit: (iv: Interview) => void;
}) {
  const dotC: Record<string, string> = {
    Pending: "var(--text3)",
    Done: "var(--blue)",
    Passed: "var(--accent)",
    Failed: "var(--coral)",
  };

  return (
    <div className="iv-card">
      <div className="iv-hdr">
        <div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>{iv.company}</div>
          <div style={{ fontSize: 12, color: "var(--text2)", fontFamily: "var(--mono)" }}>
            {iv.role}
          </div>
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <span className={`badge ${STATUS_CLS[iv.status] || "b-co"}`}>{iv.status}</span>
          <select
            className="input"
            style={{ fontSize: 12, padding: "3px 8px", width: "auto" }}
            value={iv.status}
            onChange={(e) => onUpdate(iv.id, { status: e.target.value })}
          >
            {STATUS_OPTS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => onEdit(iv)}
            style={{ padding: "4px 8px", fontSize: 12 }}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => onDelete(iv.id)}
            style={{ color: "var(--coral)", padding: "4px 8px", fontSize: 12 }}
          >
            ✕
          </button>
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--text3)",
          fontFamily: "var(--mono)",
          marginBottom: iv.notes ? 8 : 0,
        }}
      >
        Applied: {iv.date}
      </div>
      {iv.notes && (
        <div style={{ fontSize: 13, color: "var(--text2)", whiteSpace: "pre-wrap", marginBottom: 8 }}>
          {iv.notes}
        </div>
      )}
      {iv.rounds?.length ? (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 4 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>ROUNDS</div>
          {iv.rounds.map((r, i) => (
            <div key={`${r.name}-${i}`} style={{ display: "flex", alignItems: "center", gap: 10, padding: "4px 0" }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: dotC[r.status] || "var(--text3)",
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 13, flex: 1 }}>{r.name}</span>
              <span style={{ fontSize: 11, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                {r.status}
              </span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function InterviewLog() {
  const { state, addInterview, updateInterview, deleteInterview } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Interview | null>(null);
  const [fs, setFs] = useState("");
  const ivs = state.interviews || [];
  const filtered = fs ? ivs.filter((iv) => iv.status === fs) : ivs;
  const cts = STATUS_OPTS.reduce(
    (a, s) => {
      a[s] = ivs.filter((iv) => iv.status === s).length;
      return a;
    },
    {} as Record<string, number>,
  );

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Interview Log</h2>
          <p>Track your applications and round progress</p>
        </div>
        <div className="ph-actions">
          <button type="button" className="btn btn-p" onClick={() => setShowAdd(true)}>
            + Log Interview
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {(
          [
            ["All", ivs.length, ""],
            ...STATUS_OPTS.filter((s) => cts[s] > 0).map((s) => [s, cts[s], s] as const),
          ] as const
        ).map(([lbl, cnt, val]) => (
          <button
            key={String(lbl)}
            type="button"
            className={`badge ${fs === val ? STATUS_CLS[val] || "b-cat" : "b-co"}`}
            style={{ cursor: "pointer", padding: "5px 12px", fontSize: 12 }}
            onClick={() => setFs(fs === val ? "" : val)}
          >
            {lbl} ({cnt})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 36 }}>📋</div>
          <p>{ivs.length === 0 ? "No interviews logged yet." : "No interviews match this filter."}</p>
          {ivs.length === 0 && (
            <button type="button" className="btn btn-p" style={{ marginTop: 16 }} onClick={() => setShowAdd(true)}>
              + Log first interview
            </button>
          )}
        </div>
      ) : (
        filtered.map((iv) => (
          <IVCard
            key={iv.id}
            iv={iv}
            onUpdate={updateInterview}
            onDelete={deleteInterview}
            onEdit={setEditing}
          />
        ))
      )}

      {showAdd && (
        <IVModal
          key="iv-new"
          onClose={() => setShowAdd(false)}
          onSave={(iv) => {
            addInterview(iv);
            setShowAdd(false);
          }}
        />
      )}
      {editing && (
        <IVModal
          key={editing.id}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(iv) => {
            updateInterview(iv.id, {
              company: iv.company,
              role: iv.role,
              status: iv.status,
              date: iv.date,
              notes: iv.notes,
              rounds: iv.rounds,
            });
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
