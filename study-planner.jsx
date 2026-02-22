import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #12121a;
    --surface2: #1c1c28;
    --border: #2a2a3d;
    --accent: #c8f135;
    --accent2: #7c5cfc;
    --accent3: #ff6b6b;
    --text: #e8e8f0;
    --muted: #6b6b8a;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-mono); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    position: relative;
    overflow-x: hidden;
  }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  .grid-bg {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
                      linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
    opacity: 0.3;
    mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
  }

  .glow {
    position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
    width: 700px; height: 400px; pointer-events: none; z-index: 0;
    background: radial-gradient(ellipse, rgba(124,92,252,0.15) 0%, transparent 70%);
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    padding: 40px 24px;
    position: relative; z-index: 1;
  }

  .header {
    display: flex; align-items: flex-start; justify-content: space-between;
    margin-bottom: 48px; gap: 16px; flex-wrap: wrap;
  }

  .logo { display: flex; align-items: center; gap: 12px; }

  .logo-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(22px, 4vw, 30px);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  h1 span { color: var(--accent); }

  .badge {
    background: rgba(200,241,53,0.1);
    border: 1px solid rgba(200,241,53,0.3);
    color: var(--accent);
    font-size: 11px; font-family: var(--font-mono);
    padding: 4px 10px; border-radius: 20px;
    letter-spacing: 0.08em;
    align-self: center;
  }

  .layout { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  @media(max-width: 680px) { .layout { grid-template-columns: 1fr; } }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .panel-header {
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }

  .panel-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
  }

  .panel-title {
    font-family: var(--font-head);
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .panel-body { padding: 20px; }

  .field { margin-bottom: 14px; }

  label {
    display: block;
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 6px;
  }

  input, select {
    width: 100%; padding: 10px 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text); font-family: var(--font-mono); font-size: 13px;
    outline: none; transition: border-color 0.2s;
    appearance: none;
  }

  input:focus, select:focus { border-color: var(--accent2); }
  input::placeholder { color: var(--muted); }
  input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }

  .difficulty-row { display: flex; gap: 6px; }

  .diff-btn {
    flex: 1; padding: 8px 4px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--muted); font-size: 12px;
    cursor: pointer; transition: all 0.15s;
    font-family: var(--font-mono);
  }

  .diff-btn.active {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(200,241,53,0.08);
  }

  .diff-btn:hover:not(.active) { border-color: var(--muted); color: var(--text); }

  .tasks-panel { grid-column: 1 / -1; }

  .task-row {
    display: grid;
    grid-template-columns: 1fr 80px 70px 60px 28px;
    gap: 8px; align-items: center;
    padding: 10px 12px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 8px;
    font-size: 12px;
    transition: border-color 0.2s;
  }

  .task-row:hover { border-color: var(--border); }

  .task-course {
    font-family: var(--font-head); font-weight: 700; font-size: 12px;
  }

  .task-name { color: var(--muted); font-size: 11px; margin-top: 2px; }

  .tag {
    display: inline-block; padding: 2px 8px; border-radius: 4px;
    font-size: 10px; letter-spacing: 0.06em; text-align: center;
  }

  .tag-date { background: rgba(124,92,252,0.15); color: #a78bfa; border: 1px solid rgba(124,92,252,0.3); }
  .tag-hours { background: rgba(200,241,53,0.1); color: var(--accent); border: 1px solid rgba(200,241,53,0.25); }

  .diff-dot {
    width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 3px;
  }

  .remove-btn {
    background: none; border: none; color: var(--muted);
    cursor: pointer; font-size: 16px; line-height: 1;
    transition: color 0.15s; padding: 0;
  }
  .remove-btn:hover { color: var(--accent3); }

  .generate-btn {
    width: 100%; padding: 14px;
    background: var(--accent);
    border: none; border-radius: 10px;
    color: #0a0a0f; font-family: var(--font-head);
    font-size: 14px; font-weight: 800;
    letter-spacing: 0.04em; text-transform: uppercase;
    cursor: pointer; transition: all 0.2s;
    margin-top: 4px;
  }

  .generate-btn:hover:not(:disabled) {
    background: #d4ff3d;
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(200,241,53,0.25);
  }

  .generate-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .add-btn {
    width: 100%; padding: 10px;
    background: transparent;
    border: 1px dashed var(--border);
    border-radius: 8px;
    color: var(--muted); font-family: var(--font-mono); font-size: 12px;
    cursor: pointer; transition: all 0.15s;
    margin-top: 8px;
  }

  .add-btn:hover { border-color: var(--accent2); color: var(--text); }

  .schedule-section { margin-top: 24px; }

  .schedule-section h2 {
    font-family: var(--font-head); font-size: 18px; font-weight: 800;
    letter-spacing: -0.02em; margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }

  .schedule-section h2::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }

  .day-block {
    margin-bottom: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
    animation: fadeIn 0.4s ease both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .day-header {
    padding: 12px 16px;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }

  .day-label {
    font-family: var(--font-head); font-size: 12px;
    font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  }

  .day-date { color: var(--muted); font-size: 11px; }

  .day-total {
    margin-left: auto; font-size: 11px; color: var(--accent);
    background: rgba(200,241,53,0.1); padding: 2px 8px; border-radius: 4px;
  }

  .session-row {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .session-row:last-child { border-bottom: none; }

  .session-course-badge {
    font-family: var(--font-head); font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    white-space: nowrap;
  }

  .session-task { flex: 1; font-size: 12px; color: var(--text); }
  .session-tip { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .session-hours {
    font-size: 13px; font-weight: 400; color: var(--accent);
    font-family: var(--font-mono);
    white-space: nowrap;
  }

  .loading {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; padding: 48px; color: var(--muted); font-size: 13px;
  }

  .spinner {
    width: 20px; height: 20px; border-radius: 50%;
    border: 2px solid var(--border);
    border-top-color: var(--accent2);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .empty {
    text-align: center; padding: 32px; color: var(--muted); font-size: 12px;
    border: 1px dashed var(--border); border-radius: 10px;
  }

  .empty-icon { font-size: 28px; margin-bottom: 8px; }

  .summary-bar {
    display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 16px;
  }

  .stat {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 16px;
    display: flex; flex-direction: column; gap: 2px;
  }

  .stat-val { font-family: var(--font-head); font-size: 22px; font-weight: 800; color: var(--accent); }
  .stat-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }

  .tip-box {
    margin: 16px 0; padding: 14px 16px;
    background: rgba(124,92,252,0.08);
    border: 1px solid rgba(124,92,252,0.25);
    border-radius: 10px; font-size: 12px; color: #c4b5fd;
    line-height: 1.6;
  }

  .tip-box strong { color: #a78bfa; font-family: var(--font-head); }
`;

const COURSE_COLORS = [
  { bg: "rgba(200,241,53,0.12)", color: "#c8f135", border: "rgba(200,241,53,0.3)" },
  { bg: "rgba(124,92,252,0.15)", color: "#a78bfa", border: "rgba(124,92,252,0.35)" },
  { bg: "rgba(255,107,107,0.12)", color: "#ff8e8e", border: "rgba(255,107,107,0.3)" },
  { bg: "rgba(56,189,248,0.12)", color: "#7dd3fc", border: "rgba(56,189,248,0.3)" },
  { bg: "rgba(251,191,36,0.12)", color: "#fcd34d", border: "rgba(251,191,36,0.3)" },
  { bg: "rgba(52,211,153,0.12)", color: "#6ee7b7", border: "rgba(52,211,153,0.3)" },
];

const diffLabels = ["Easy", "Mild", "Med", "Hard", "Brutal"];
const diffColors = ["#6ee7b7","#fcd34d","#fb923c","#f87171","#ff6b6b"];

function getDiffColor(d) { return diffColors[d - 1] || diffColors[2]; }

export default function App() {
  const [form, setForm] = useState({ course: "", name: "", deadline: "", hours_needed: 2, difficulty: 2 });
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [courseColorMap, setCourseColorMap] = useState({});

  const getCourseColor = (course) => {
    if (courseColorMap[course]) return courseColorMap[course];
    const idx = Object.keys(courseColorMap).length % COURSE_COLORS.length;
    const color = COURSE_COLORS[idx];
    setCourseColorMap(prev => ({ ...prev, [course]: color }));
    return color;
  };

  const addTask = () => {
    if (!form.course || !form.name || !form.deadline) {
      setError("Please fill in Course, Assignment, and Deadline.");
      return;
    }
    setError("");
    setTasks(prev => [...prev, { ...form, id: Date.now() }]);
    setForm(f => ({ ...f, name: "", hours_needed: 2, difficulty: 2 }));
  };

  const removeTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  const generateSchedule = async () => {
    if (tasks.length === 0) { setError("Add at least one task first."); return; }
    setError(""); setLoading(true); setSchedule(null);

    const today = new Date().toISOString().split("T")[0];

    const prompt = `You are an expert academic study planner. Today is ${today}.

I have these assignments:
${tasks.map((t, i) => `${i + 1}. Course: "${t.course}", Task: "${t.name}", Deadline: ${t.deadline}, Hours needed: ${t.hours_needed}, Difficulty (1-5): ${t.difficulty}`).join("\n")}

Generate an optimized study schedule. Rules:
- Spread work across days, don't cram everything before deadlines
- Harder tasks get more focus sessions early in the week
- Max 4-5 study hours per day total across all tasks
- Sessions should be 1-2 hours each
- Include a brief study tip for each session

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "overview": "One sentence overview of the strategy",
  "total_hours": <number>,
  "days": [
    {
      "date": "YYYY-MM-DD",
      "day_name": "Monday",
      "sessions": [
        {
          "course": "course name",
          "task": "task name",
          "hours": <number>,
          "tip": "brief actionable tip"
        }
      ]
    }
  ]
}`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await res.json();
      const text = data.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setSchedule(parsed);
    } catch (e) {
      setError("Failed to generate schedule. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="noise" />
        <div className="grid-bg" />
        <div className="glow" />

        <div className="container">
          <header className="header">
            <div className="logo">
              <div className="logo-icon">📚</div>
              <h1>Study<span>AI</span></h1>
            </div>
            <span className="badge">AI-Powered Scheduler</span>
          </header>

          <div className="layout">
            {/* Add Task Panel */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-icon" style={{ background: "rgba(200,241,53,0.1)" }}>✏️</div>
                <span className="panel-title">New Assignment</span>
              </div>
              <div className="panel-body">
                <div className="field">
                  <label>Course</label>
                  <input placeholder="e.g. Calculus II"
                    value={form.course}
                    onChange={e => setForm(f => ({ ...f, course: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Assignment</label>
                  <input placeholder="e.g. Problem Set 4"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Deadline</label>
                  <input type="date" value={form.deadline}
                    onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
                </div>
                <div className="field">
                  <label>Hours Needed</label>
                  <input type="number" min="0.5" max="40" step="0.5"
                    value={form.hours_needed}
                    onChange={e => setForm(f => ({ ...f, hours_needed: parseFloat(e.target.value) || 1 }))} />
                </div>
                <div className="field">
                  <label>Difficulty</label>
                  <div className="difficulty-row">
                    {[1,2,3,4,5].map(d => (
                      <button key={d} className={`diff-btn${form.difficulty === d ? " active" : ""}`}
                        style={form.difficulty === d ? { borderColor: getDiffColor(d), color: getDiffColor(d), background: `${getDiffColor(d)}18` } : {}}
                        onClick={() => setForm(f => ({ ...f, difficulty: d }))}>
                        {diffLabels[d-1]}
                      </button>
                    ))}
                  </div>
                </div>
                {error && <div style={{ color: "#ff8e8e", fontSize: 11, marginBottom: 8 }}>{error}</div>}
                <button className="add-btn" onClick={addTask}>+ Add Assignment</button>
              </div>
            </div>

            {/* Queue Panel */}
            <div className="panel">
              <div className="panel-header">
                <div className="panel-icon" style={{ background: "rgba(124,92,252,0.1)" }}>📋</div>
                <span className="panel-title">Queue ({tasks.length})</span>
              </div>
              <div className="panel-body">
                {tasks.length === 0 ? (
                  <div className="empty">
                    <div className="empty-icon">🗂️</div>
                    <div>Add assignments to build your queue</div>
                  </div>
                ) : (
                  tasks.map(t => {
                    const col = getCourseColor(t.course);
                    return (
                      <div key={t.id} className="task-row">
                        <div>
                          <div className="task-course" style={{ color: col.color }}>{t.course}</div>
                          <div className="task-name">{t.name}</div>
                        </div>
                        <span className="tag tag-date">{t.deadline}</span>
                        <span className="tag tag-hours">{t.hours_needed}h</span>
                        <span style={{ fontSize: 11, color: getDiffColor(t.difficulty), display: "flex", alignItems: "center" }}>
                          <span className="diff-dot" style={{ background: getDiffColor(t.difficulty) }} />
                          {diffLabels[t.difficulty-1]}
                        </span>
                        <button className="remove-btn" onClick={() => removeTask(t.id)}>×</button>
                      </div>
                    );
                  })
                )}
                <button className="generate-btn" disabled={loading || tasks.length === 0} onClick={generateSchedule}>
                  {loading ? "Generating…" : `Generate Schedule →`}
                </button>
              </div>
            </div>
          </div>

          {/* Schedule Output */}
          {loading && (
            <div className="loading">
              <div className="spinner" />
              <span>Claude is optimizing your study plan…</span>
            </div>
          )}

          {schedule && (
            <div className="schedule-section">
              <h2>Your Study Plan</h2>

              <div className="summary-bar">
                <div className="stat">
                  <span className="stat-val">{schedule.total_hours}</span>
                  <span className="stat-label">Total Hours</span>
                </div>
                <div className="stat">
                  <span className="stat-val">{schedule.days?.length}</span>
                  <span className="stat-label">Study Days</span>
                </div>
                <div className="stat">
                  <span className="stat-val">{tasks.length}</span>
                  <span className="stat-label">Assignments</span>
                </div>
              </div>

              {schedule.overview && (
                <div className="tip-box">
                  <strong>Strategy: </strong>{schedule.overview}
                </div>
              )}

              {schedule.days?.map((day, i) => {
                const total = day.sessions?.reduce((s, sess) => s + sess.hours, 0) || 0;
                return (
                  <div key={i} className="day-block" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="day-header">
                      <span className="day-label">{day.day_name}</span>
                      <span className="day-date">{day.date}</span>
                      <span className="day-total">{total}h total</span>
                    </div>
                    {day.sessions?.map((sess, j) => {
                      const col = getCourseColor(sess.course);
                      return (
                        <div key={j} className="session-row">
                          <span className="session-course-badge"
                            style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}` }}>
                            {sess.course}
                          </span>
                          <div className="session-task">
                            <div>{sess.task}</div>
                            {sess.tip && <div className="session-tip">💡 {sess.tip}</div>}
                          </div>
                          <span className="session-hours">{sess.hours}h</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
