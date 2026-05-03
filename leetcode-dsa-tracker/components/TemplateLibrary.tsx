"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/lib/app-context";
import type { TemplateItem, TemplateType } from "@/lib/types";

const TEMPLATE_TYPES: Array<{ value: TemplateType; label: string }> = [
  { value: "text", label: "Text" },
  { value: "link", label: "Link" },
  { value: "image", label: "Image" },
  { value: "other", label: "Other" },
];

const TYPE_BADGES: Record<TemplateType, string> = {
  text: "Text",
  link: "Link",
  image: "Image",
  other: "Other",
};

function TemplateModal({
  initial,
  onClose,
  onSave,
  onDelete,
}: {
  initial?: TemplateItem | null;
  onClose: () => void;
  onSave: (item: TemplateItem) => void;
  onDelete?: (id: string) => void;
}) {
  const [form, setForm] = useState<TemplateItem>(() =>
    initial
      ? {
          ...initial,
        }
      : {
          id: Date.now().toString(),
          title: "",
          type: "text",
          content: "",
          createdAt: new Date().toISOString(),
        },
  );

  const typeLabel = TYPE_BADGES[form.type];

  function save() {
    if (!form.title.trim() || !form.content.trim()) return;
    onSave({ ...form, title: form.title.trim(), content: form.content.trim() });
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{initial ? "Edit template" : "New template"}</h3>
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Template title"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">Type</label>
            <select
              className="input"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TemplateType }))}
            >
              {TEMPLATE_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{typeLabel} content</label>
            <textarea
              className="input"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder={
                form.type === "link"
                  ? "Paste a URL"
                  : form.type === "image"
                  ? "Paste an image URL"
                  : "Paste text or notes"
              }
            />
          </div>

          {form.type === "image" && form.content.trim() ? (
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", marginTop: 4 }}>
              <img
                src={form.content}
                alt={form.title || "Template image preview"}
                style={{ width: "100%", display: "block", objectFit: "cover", height: 220 }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.opacity = "0.4";
                }}
              />
            </div>
          ) : null}
        </div>

        <div className="modal-actions" style={{ justifyContent: initial ? "space-between" : "flex-end" }}>
          {initial ? (
            <button
              type="button"
              className="btn"
              style={{ color: "var(--coral)", borderColor: "rgba(248,113,113,0.25)" }}
              onClick={() => onDelete?.(initial.id)}
            >
              Delete
            </button>
          ) : null}
          <div style={{ display: "flex", gap: 8, marginLeft: initial ? 0 : "auto" }}>
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-p" onClick={save}>
              Save template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function contentPreview(content: string) {
  const preview = content.trim();
  if (!preview) return "No content";
  return preview.length > 120 ? `${preview.slice(0, 120)}…` : preview;
}

export function TemplateLibrary() {
  const { state, addTemplate, updateTemplate, deleteTemplate, showToast } = useApp();
  const [active, setActive] = useState<TemplateItem | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [filterType, setFilterType] = useState<TemplateType | "all">("all");

  const templates = state.templates || [];
  const filteredTemplates = useMemo(
    () =>
      filterType === "all"
        ? templates
        : templates.filter((template) => template.type === filterType),
    [templates, filterType],
  );

  const typeCounts = useMemo(
    () =>
      templates.reduce((counts, template) => {
        counts[template.type] = (counts[template.type] || 0) + 1;
        return counts;
      }, {} as Record<TemplateType, number>),
    [templates],
  );

  function handleCopy(item: TemplateItem) {
    const textToCopy = item.content;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast("Copied to clipboard");
    });
  }

  function handleSave(item: TemplateItem) {
    if (templates.some((template) => template.id === item.id)) {
      updateTemplate(item.id, item);
      showToast("Template updated");
    } else {
      addTemplate(item);
      showToast("Template saved");
    }
  }

  function handleDelete(id: string) {
    deleteTemplate(id);
    setActive((prev) => (prev?.id === id ? null : prev));
    showToast("Template removed");
  }

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Templates</h2>
          <p>Store text, links, images, or custom snippets for quick recall.</p>
        </div>
        <div className="ph-actions">
          <button type="button" className="btn btn-p" onClick={() => setShowNew(true)}>
            + Add template
          </button>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 18 }}>
        <button
          className={`tab-btn${filterType === "all" ? " active" : ""}`}
          type="button"
          onClick={() => setFilterType("all")}
        >
          All ({templates.length})
        </button>
        {TEMPLATE_TYPES.map((option) => (
          <button
            key={option.value}
            className={`tab-btn${filterType === option.value ? " active" : ""}`}
            type="button"
            onClick={() => setFilterType(option.value)}
          >
            {option.label} ({typeCounts[option.value] || 0})
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 36 }}>✎</div>
          <p>{templates.length === 0 ? "No templates saved yet." : "No templates match this filter."}</p>
          {templates.length === 0 && (
            <button type="button" className="btn btn-p" style={{ marginTop: 16 }} onClick={() => setShowNew(true)}>
              Create your first template
            </button>
          )}
        </div>
      ) : (
        <div className="templates-grid">
          {filteredTemplates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-card__head">
                <div>
                  <div className="template-card__title">{template.title}</div>
                  <span className="badge b-co">{TYPE_BADGES[template.type]}</span>
                </div>
                <div className="template-card__actions">
                  <button type="button" className="btn btn-sm template-card__btn" onClick={() => handleCopy(template)}>
                    <span aria-hidden>📋</span> Copy
                  </button>
                  <button type="button" className="btn btn-sm template-card__btn" onClick={() => setActive(template)}>
                    Edit
                  </button>
                </div>
              </div>
              {template.type === "image" && template.content.trim() ? (
                <div className="template-card__image-wrap">
                  <img src={template.content} alt={template.title} />
                </div>
              ) : null}
              <div className="template-card__meta">{contentPreview(template.content)}</div>
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <TemplateModal
          onClose={() => setShowNew(false)}
          onSave={handleSave}
        />
      )}
      {active && (
        <TemplateModal
          key={active.id}
          initial={active}
          onClose={() => setActive(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
