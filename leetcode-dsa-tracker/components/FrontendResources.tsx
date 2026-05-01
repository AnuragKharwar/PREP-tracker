"use client";

import { useState } from "react";
import { FE_HOT_TOPICS, FE_INTERVIEW_QUESTIONS, FE_RESOURCES } from "@/lib/frontend-feed";

const TABS = [
  { id: "topics", label: "Hot topics" },
  { id: "resources", label: "Resources" },
  { id: "questions", label: "Interview questions" },
];

const QUESTION_FILTERS = [
  { id: "all", label: "All" },
  { id: "javascript", label: "JavaScript" },
  { id: "react", label: "React" },
  { id: "machineCoding", label: "Machine Coding" },
];

type QuickRef = {
  note: string;
  youtube: string;
  blog: string;
  other: string;
};

function listLabel(count: number) {
  return count > 0 ? `${count} hot` : "";
}

const emptyQuickRef: QuickRef = {
  note: "",
  youtube: "",
  blog: "",
  other: "",
};

export function FrontendResources() {
  const [activeTab, setActiveTab] = useState("topics");
  const [topicExpanded, setTopicExpanded] = useState<Record<number, boolean>>({});
  const [questionExpanded, setQuestionExpanded] = useState<Record<string, boolean>>({});
  const [topicRefs, setTopicRefs] = useState<Record<number, QuickRef>>({});
  const [questionRefs, setQuestionRefs] = useState<Record<string, QuickRef>>({});
  const [questionFilter, setQuestionFilter] = useState("all");

  function toggleTopic(rank: number) {
    setTopicExpanded((prev) => ({ ...prev, [rank]: !prev[rank] }));
  }

  function toggleQuestion(key: string) {
    setQuestionExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function updateTopicRef(rank: number, field: keyof QuickRef, value: string) {
    setTopicRefs((prev) => ({
      ...prev,
      [rank]: { ...(prev[rank] || emptyQuickRef), [field]: value },
    }));
  }

  function updateQuestionRef(key: string, field: keyof QuickRef, value: string) {
    setQuestionRefs((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || emptyQuickRef), [field]: value },
    }));
  }

  return (
    <div>
      <div className="ph">
        <div>
          <h2>Frontend resources & topics</h2>
          <p>Curated senior frontend prep signals: hot topics, interview questions, and best study resources.</p>
        </div>
      </div>

      <div className="tabs" style={{ marginBottom: 20 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "topics" && (
        <section className="card">
          <div className="section-header">
            <div>
              <h3>Hot frontend topics</h3>
              <p>Interview themes seen across recent FE SDE2 rounds.</p>
            </div>
            <span className="badge b-pat">Top 14</span>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {FE_HOT_TOPICS.map((topic) => {
              const expanded = topicExpanded[topic.rank];
              const ref = topicRefs[topic.rank] || emptyQuickRef;
              return (
                <div key={topic.rank}>
                  <div className="content-card">
                    <div className="content-card__left">
                      <div className="content-card__top">
                        <strong>{topic.topic}</strong>
                        <span className="badge b-cat">{topic.mentions} mentions</span>
                      </div>
                      <div className="content-card__meta">{topic.sources.join(" • ")}</div>
                      <div className="content-card__body">{topic.why}</div>
                    </div>
                    <div className="content-card__right">
                      {ref.youtube && (
                        <a href={ref.youtube} target="_blank" rel="noreferrer" className="link-icon">
                          ▶️
                        </a>
                      )}
                      {ref.blog && (
                        <a href={ref.blog} target="_blank" rel="noreferrer" className="link-icon">
                          📝
                        </a>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`tab-btn${expanded ? " active" : ""}`}
                    style={{ marginTop: 16, width: "auto" }}
                    onClick={() => toggleTopic(topic.rank)}
                  >
                    {expanded ? "Hide quick reference" : "Add quick reference"}
                  </button>
                  {expanded ? (
                    <div className="quick-ref-panel">
                      <div className="quick-ref-row">
                        <label>Notes</label>
                        <textarea
                          className="input"
                          value={ref.note}
                          onChange={(e) => updateTopicRef(topic.rank, "note", e.target.value)}
                          placeholder="Write a quick note or memory hook"
                        />
                      </div>
                      <div className="quick-ref-row">
                        <label>YouTube link</label>
                        <input
                          className="input"
                          value={ref.youtube}
                          onChange={(e) => updateTopicRef(topic.rank, "youtube", e.target.value)}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div className="quick-ref-row">
                        <label>Blog / article link</label>
                        <input
                          className="input"
                          value={ref.blog}
                          onChange={(e) => updateTopicRef(topic.rank, "blog", e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="quick-ref-row">
                        <label>Other reference</label>
                        <input
                          className="input"
                          value={ref.other}
                          onChange={(e) => updateTopicRef(topic.rank, "other", e.target.value)}
                          placeholder="Code snippet, article, or tip"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {activeTab === "resources" && (
        <section className="card">
          <div className="section-header">
            <div>
              <h3>Frontend resources</h3>
              <p>Books, docs, videos, and practice hubs recommended for FE interview prep.</p>
            </div>
            <span className="badge b-pat">{FE_RESOURCES.length}</span>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {FE_RESOURCES.map((resource) => (
              <a
                key={resource.url}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                className="card resource-card"
              >
                <div className="resource-card__top">
                  <div className="resource-card__title">
                    <strong>{resource.name}</strong>
                    {resource.hot ? <span className="badge b-technical">hot</span> : null}
                  </div>
                  <span className="badge b-cat">{resource.category}</span>
                </div>
                <div className="resource-card__note">{resource.note}</div>
              </a>
            ))}
          </div>
        </section>
      )}

      {activeTab === "questions" && (
        <section className="card">
          <div className="section-header">
            <div>
              <h3>Frontend interview questions</h3>
              <p>Question themes for JavaScript, React, system design, machine coding, and behavioral rounds.</p>
            </div>
            <span className="badge b-pat">{Object.keys(FE_INTERVIEW_QUESTIONS).length} categories</span>
          </div>

          <div className="tabs" style={{ marginBottom: 16 }}>
            {QUESTION_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`tab-btn${questionFilter === filter.id ? " active" : ""}`}
                onClick={() => setQuestionFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gap: 18 }}>
            {Object.entries(FE_INTERVIEW_QUESTIONS)
              .filter(([category]) => questionFilter === "all" || category === questionFilter)
              .map(([category, questions]) => (
                <div key={category} style={{ display: "grid", gap: 10 }}>
                  <div className="section-subheader">
                    <strong>{category.replace(/([A-Z])/g, " $1")}</strong>
                    <span className="badge b-easy">{listLabel(questions.filter((q) => q.hot).length)}</span>
                  </div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {questions.map((question, index) => {
                      const key = `${category}-${index}`;
                      const expanded = questionExpanded[key];
                      const ref = questionRefs[key] || emptyQuickRef;
                      return (
                        <div key={key}>
                          <div className="content-card">
                            <div className="content-card__left">
                              <div className="content-card__body">{question.q}</div>
                              <div className="content-card__meta">
                                <span>{question.source}</span>
                                {question.hot ? <span className="badge b-technical">hot</span> : null}
                              </div>
                            </div>
                            <div className="content-card__right">
                              {ref.youtube && (
                                <a href={ref.youtube} target="_blank" rel="noreferrer" className="link-icon">
                                  ▶️
                                </a>
                              )}
                              {ref.blog && (
                                <a href={ref.blog} target="_blank" rel="noreferrer" className="link-icon">
                                  📝
                                </a>
                              )}
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`tab-btn${expanded ? " active" : ""}`}
                            style={{ marginTop: 16, width: "auto" }}
                            onClick={() => toggleQuestion(key)}
                          >
                            {expanded ? "Hide quick reference" : "Add quick reference"}
                          </button>
                          {expanded ? (
                            <div className="quick-ref-panel">
                              <div className="quick-ref-row">
                                <label>Notes</label>
                                <textarea
                                  className="input"
                                  value={ref.note}
                                  onChange={(e) => updateQuestionRef(key, "note", e.target.value)}
                                  placeholder="Write a quick note or insight"
                                />
                              </div>
                              <div className="quick-ref-row">
                                <label>YouTube link</label>
                                <input
                                  className="input"
                                  value={ref.youtube}
                                  onChange={(e) => updateQuestionRef(key, "youtube", e.target.value)}
                                  placeholder="https://youtube.com/..."
                                />
                              </div>
                              <div className="quick-ref-row">
                                <label>Blog / article link</label>
                                <input
                                  className="input"
                                  value={ref.blog}
                                  onChange={(e) => updateQuestionRef(key, "blog", e.target.value)}
                                  placeholder="https://..."
                                />
                              </div>
                              <div className="quick-ref-row">
                                <label>Other reference</label>
                                <input
                                  className="input"
                                  value={ref.other}
                                  onChange={(e) => updateQuestionRef(key, "other", e.target.value)}
                                  placeholder="Code snippet, article, or tip"
                                />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
