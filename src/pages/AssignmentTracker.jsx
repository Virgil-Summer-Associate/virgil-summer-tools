import { useState, useEffect } from "react";

const STATUSES = ["Not started", "In progress", "With reviewer", "Complete"];
const STATUS_STYLES = {
  "Not started": { bg: "#F2F0EB", color: "#8A8680" },
  "In progress": { bg: "#E8F0FE", color: "#3B5BDB" },
  "With reviewer": { bg: "#FFF3BF", color: "#92681A" },
  "Complete": { bg: "#EBFBEE", color: "#2B7A3B" },
};
const MATTER_TYPES = ["Formation", "Financing / SAFE", "Equity / Cap Table", "Employment / Offer Letter", "Compliance", "People Ops", "Tax", "M&A", "Other"];
const STORAGE_KEY = "virgil_tracker_rows";
const generateId = () => Math.random().toString(36).slice(2, 9);

const SAMPLE_DATA = [];

function isOverdue(deadline, status) {
  if (!deadline || status === "Complete") return false;
  return new Date(deadline) < new Date();
}

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

export default function AssignmentTracker() {
  const [rows, setRows] = useLocalStorage(STORAGE_KEY, SAMPLE_DATA);
  const addRow = () => setRows([...rows, { id: generateId(), client: "", matterType: "", workProduct: "", supervisingAttorney: "", dateAssigned: "", deadline: "", status: "Not started", feedbackReceived: false, notes: "" }]);
  const updateRow = (id, field, value) => setRows(rows.map(r => r.id === id ? { ...r, [field]: value } : r));
  const deleteRow = (id) => setRows(rows.filter(r => r.id !== id));
  const stats = { total: rows.length, inProgress: rows.filter(r => r.status === "In progress").length, overdue: rows.filter(r => isOverdue(r.deadline, r.status)).length, complete: rows.filter(r => r.status === "Complete").length };
  const cell = { width: "100%", border: "none", background: "transparent", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#1A1A18", padding: "13px 14px", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#F7F5F0", minHeight: "100vh", padding: "40px 28px 80px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A8680", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8B89A", display: "inline-block" }} />
              Virgil <span style={{ color: "#C8B89A", margin: "0 4px" }}>·</span> Summer Associate
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: "#1A1A18", lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0 }}>Assignment Tracker</h1>
            <p style={{ fontSize: 12, color: "#8A8680", marginTop: 6, fontStyle: "italic" }}>A one-page dashboard for every matter on your desk. Update it before you leave.</p>
          </div>
          <button onClick={addRow} style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "#1A1A18", color: "#F7F5F0", border: "none", padding: "12px 22px", cursor: "pointer", borderRadius: 2 }}>+ Add matter</button>
        </div>
        <div style={{ display: "flex", gap: 14, marginBottom: 28, flexWrap: "wrap" }}>
          {[{ label: "Total", value: stats.total, color: "#1A1A18" }, { label: "In progress", value: stats.inProgress, color: "#3B5BDB" }, { label: "Overdue", value: stats.overdue, color: stats.overdue > 0 ? "#C0392B" : "#1A1A18" }, { label: "Complete", value: stats.complete, color: "#2B7A3B" }].map(s => (
            <div key={s.label} style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 2, padding: "10px 16px" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8680" }}>{s.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 4, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 800 }}>
            <thead>
              <tr style={{ background: "#F2F0EB", borderBottom: "1px solid #E8E4DC" }}>
                {["Client", "Matter type", "Work product", "Supervising attorney", "Assigned", "Deadline", "Status", "Feedback", "Notes", ""].map(h => (
                  <th key={h} style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8680", padding: "12px 14px", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "64px 24px", textAlign: "center", color: "#8A8680", fontStyle: "italic", fontSize: 13 }}>No matters yet. Add one above.</td></tr>
              ) : rows.map(row => {
                const over = isOverdue(row.deadline, row.status);
                const ss = STATUS_STYLES[row.status] || STATUS_STYLES["Not started"];
                return (
                  <tr key={row.id} style={{ borderBottom: "1px solid #F2F0EB" }}>
                    <td><input style={cell} value={row.client} onChange={e => updateRow(row.id, "client", e.target.value)} placeholder="Client name" /></td>
                    <td><select style={{ ...cell, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }} value={row.matterType} onChange={e => updateRow(row.id, "matterType", e.target.value)}><option value="">— type —</option>{MATTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></td>
                    <td><input style={cell} value={row.workProduct} onChange={e => updateRow(row.id, "workProduct", e.target.value)} placeholder="e.g. SAFE review memo" /></td>
                    <td><input style={cell} value={row.supervisingAttorney} onChange={e => updateRow(row.id, "supervisingAttorney", e.target.value)} placeholder="Attorney" /></td>
                    <td><input style={{ ...cell, color: "#8A8680" }} type="date" value={row.dateAssigned} onChange={e => updateRow(row.id, "dateAssigned", e.target.value)} /></td>
                    <td><input style={{ ...cell, color: over ? "#C0392B" : "#1A1A18", fontWeight: over ? 500 : 400 }} type="date" value={row.deadline} onChange={e => updateRow(row.id, "deadline", e.target.value)} /></td>
                    <td style={{ padding: "10px 14px" }}>
                      <select style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, border: "none", borderRadius: 20, padding: "4px 10px", cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", background: ss.bg, color: ss.color }} value={row.status} onChange={e => updateRow(row.id, "status", e.target.value)}>
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td style={{ padding: "10px 14px", textAlign: "center" }}>
                      <div onClick={() => updateRow(row.id, "feedbackReceived", !row.feedbackReceived)} style={{ width: 18, height: 18, border: row.feedbackReceived ? "none" : "1.5px solid #C0BAB0", borderRadius: 2, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", background: row.feedbackReceived ? "#1A1A18" : "transparent", color: "white", fontSize: 12, userSelect: "none" }}>
                        {row.feedbackReceived ? "✓" : ""}
                      </div>
                    </td>
                    <td><input style={cell} value={row.notes} onChange={e => updateRow(row.id, "notes", e.target.value)} placeholder="Notes" /></td>
                    <td><button onClick={() => deleteRow(row.id)} style={{ background: "none", border: "none", color: "#C0BAB0", cursor: "pointer", padding: "13px 12px", fontSize: 16 }}>×</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p style={{ marginTop: 20, textAlign: "center", fontSize: 11, color: "#A8A49C", fontStyle: "italic" }}>— Review the tracker at the end of every day. Review it again at the end of every week. Nobody else is keeping score for you. —</p>
      </div>
    </div>
  );
}
