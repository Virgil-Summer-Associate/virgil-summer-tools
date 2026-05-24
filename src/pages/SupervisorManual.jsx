import { useState, useEffect } from "react";

const generateId = () => Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "virgil_supervisors";
const COMM_STYLES = ["Email first", "Slack / message", "Stop by in person", "Whatever works"];
const URGENCY_MEANINGS = ["Same day", "Within a few hours", "Drop everything now", "End of day is fine"];
const DRAFT_PREFERENCES = ["Tight and short", "Thorough with options", "Bottom line up front", "Show your work"];

const SAMPLE_SUPERVISORS = [];

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

const inputBase = { width: "100%", border: "1px solid #E8E4DC", background: "#FAFAF8", fontFamily: "'DM Mono', monospace", fontSize: 12, color: "#1A1A18", padding: "9px 12px", outline: "none", borderRadius: 2, boxSizing: "border-box" };
const textareaBase = { ...inputBase, resize: "vertical", minHeight: 64, lineHeight: 1.6 };
const Label = ({ children }) => <div style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A8680", fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: 5 }}>{children}</div>;

function SupervisorCard({ supervisor, onDelete, onEdit }) {
  const [open, setOpen] = useState(false);
  const chip = (value, color, bg) => value ? <span style={{ fontSize: 11, background: bg, color, borderRadius: 20, padding: "3px 10px", whiteSpace: "nowrap" }}>{value}</span> : null;
  return (
    <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 4, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", cursor: "pointer" }}>
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#F2F0EB", border: "1px solid #E8E4DC", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: "#8A8680", flexShrink: 0 }}>
          {supervisor.name ? supervisor.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() : "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, color: "#1A1A18" }}>{supervisor.name || "Unnamed"}</span>
            {supervisor.role && <span style={{ fontSize: 11, color: "#8A8680", fontStyle: "italic" }}>{supervisor.role}</span>}
            {supervisor.practiceArea && <span style={{ fontSize: 11, background: "#F2F0EB", color: "#8A8680", borderRadius: 20, padding: "2px 8px" }}>{supervisor.practiceArea}</span>}
          </div>
          {!open && <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>{chip(supervisor.commStyle, "#2B7A3B", "#EBFBEE")}{chip(supervisor.urgencyMeaning, "#92681A", "#FFF3BF")}{chip(supervisor.draftPreference, "#3B5BDB", "#E8F0FE")}</div>}
        </div>
        <div style={{ color: "#C0BAB0", fontSize: 16, flexShrink: 0, transform: open ? "rotate(180deg)" : "none" }}>↓</div>
      </div>
      {open && (
        <div style={{ borderTop: "1px solid #F2F0EB", padding: "20px", background: "#FAFAF8" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[{ label: "Communication style", value: supervisor.commStyle, color: "#2B7A3B", bg: "#EBFBEE" }, { label: '"Urgent" means', value: supervisor.urgencyMeaning, color: "#92681A", bg: "#FFF3BF" }, { label: "Draft preference", value: supervisor.draftPreference, color: "#3B5BDB", bg: "#E8F0FE" }].map(f => (
              <div key={f.label}><Label>{f.label}</Label><div style={{ fontSize: 12, background: f.bg, color: f.color, borderRadius: 20, padding: "4px 12px", display: "inline-block" }}>{f.value || "—"}</div></div>
            ))}
          </div>
          {[{ label: "Recurring feedback", value: supervisor.recurringFeedback }, { label: "What they value", value: supervisor.whatTheyValue }, { label: "Watch out for", value: supervisor.watchOut }, { label: "Notes", value: supervisor.notes }].map(f => f.value ? (
            <div key={f.label} style={{ marginBottom: 16 }}><Label>{f.label}</Label><p style={{ fontSize: 12, color: "#1A1A18", lineHeight: 1.7, margin: 0, borderLeft: "2px solid #E8E4DC", paddingLeft: 12 }}>{f.value}</p></div>
          ) : null)}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button onClick={() => onEdit(supervisor)} style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "#1A1A18", color: "#F7F5F0", border: "none", padding: "8px 16px", cursor: "pointer", borderRadius: 2 }}>Edit</button>
            <button onClick={() => onDelete(supervisor.id)} style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "#C0BAB0", border: "1px solid #E8E4DC", padding: "8px 16px", cursor: "pointer", borderRadius: 2 }}>Remove</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SupervisorManual() {
  const [supervisors, setSupervisors] = useLocalStorage(STORAGE_KEY, SAMPLE_SUPERVISORS);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(null);

  const startAdd = () => { setDraft({ id: generateId(), name: "", role: "", practiceArea: "", commStyle: "", urgencyMeaning: "", draftPreference: "", recurringFeedback: "", whatTheyValue: "", watchOut: "", notes: "" }); setEditing("new"); };
  const startEdit = (s) => { setDraft({ ...s }); setEditing(s.id); };
  const saveDraft = () => {
    if (!draft.name) return;
    if (editing === "new") setSupervisors([...supervisors, draft]);
    else setSupervisors(supervisors.map(s => s.id === draft.id ? draft : s));
    setEditing(null); setDraft(null);
  };
  const update = (field, value) => setDraft({ ...draft, [field]: value });
  const SelectField = ({ value, onChange, options }) => (
    <select value={value} onChange={e => onChange(e.target.value)} style={{ ...inputBase, cursor: "pointer", appearance: "none", WebkitAppearance: "none" }}>
      <option value="">— select —</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#F7F5F0", minHeight: "100vh", padding: "40px 28px 80px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A8680", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8B89A", display: "inline-block" }} />
              Virgil <span style={{ color: "#C8B89A", margin: "0 4px" }}>·</span> Summer Associate
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: "#1A1A18", lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0 }}>Supervisor Manual</h1>
            <p style={{ fontSize: 12, color: "#8A8680", marginTop: 6, fontStyle: "italic" }}>One profile per supervising attorney. The document gets sharper every time you work with them.</p>
          </div>
          <button onClick={startAdd} style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "#1A1A18", color: "#F7F5F0", border: "none", padding: "12px 22px", cursor: "pointer", borderRadius: 2, whiteSpace: "nowrap" }}>+ Add supervisor</button>
        </div>
        {draft && (
          <div style={{ background: "white", border: "1px solid #C8B89A", borderRadius: 4, padding: 24, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8680", marginBottom: 20 }}>{editing === "new" ? "New supervisor" : `Editing ${draft.name}`}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label>Name</Label><input style={{ ...inputBase, marginBottom: 0 }} value={draft.name} onChange={e => update("name", e.target.value)} placeholder="Full name" /></div>
              <div><Label>Role</Label><input style={{ ...inputBase, marginBottom: 0 }} value={draft.role} onChange={e => update("role", e.target.value)} placeholder="e.g. Partner" /></div>
              <div><Label>Practice area</Label><input style={{ ...inputBase, marginBottom: 0 }} value={draft.practiceArea} onChange={e => update("practiceArea", e.target.value)} placeholder="e.g. Corporate" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label>Communication style</Label><SelectField value={draft.commStyle} onChange={v => update("commStyle", v)} options={COMM_STYLES} /></div>
              <div><Label>"Urgent" means</Label><SelectField value={draft.urgencyMeaning} onChange={v => update("urgencyMeaning", v)} options={URGENCY_MEANINGS} /></div>
              <div><Label>Draft preference</Label><SelectField value={draft.draftPreference} onChange={v => update("draftPreference", v)} options={DRAFT_PREFERENCES} /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <div><Label>Recurring feedback</Label><textarea style={textareaBase} value={draft.recurringFeedback} onChange={e => update("recurringFeedback", e.target.value)} placeholder="What do they keep coming back to?" /></div>
              <div><Label>What they value</Label><textarea style={textareaBase} value={draft.whatTheyValue} onChange={e => update("whatTheyValue", e.target.value)} placeholder="What makes them trust your work?" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
              <div><Label>Watch out for</Label><textarea style={textareaBase} value={draft.watchOut} onChange={e => update("watchOut", e.target.value)} placeholder="What tends to go wrong?" /></div>
              <div><Label>Notes</Label><textarea style={textareaBase} value={draft.notes} onChange={e => update("notes", e.target.value)} placeholder="Tools they use (Solve.It, Documenso, Airtable), how they work, anything else." /></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={saveDraft} disabled={!draft.name} style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: draft.name ? "#1A1A18" : "#C0BAB0", color: "#F7F5F0", border: "none", padding: "10px 20px", cursor: draft.name ? "pointer" : "not-allowed", borderRadius: 2 }}>Save</button>
              <button onClick={() => { setEditing(null); setDraft(null); }} style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "transparent", color: "#8A8680", border: "1px solid #E8E4DC", padding: "10px 20px", cursor: "pointer", borderRadius: 2 }}>Cancel</button>
            </div>
          </div>
        )}
        {supervisors.length === 0 && !draft ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "#8A8680" }}>
            <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 12 }}>◎</div>
            <p style={{ fontSize: 13, fontStyle: "italic" }}>No supervisors yet. Add one after your first assignment.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {supervisors.map(s => <SupervisorCard key={s.id} supervisor={s} onDelete={id => setSupervisors(supervisors.filter(s => s.id !== id))} onEdit={startEdit} />)}
          </div>
        )}
        <p style={{ marginTop: 32, textAlign: "center", fontSize: 11, color: "#A8A49C", fontStyle: "italic" }}>— Keep one for every supervising attorney you work with. The document gets sharper with every interaction. —</p>
      </div>
    </div>
  );
}
