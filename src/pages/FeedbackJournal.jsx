import { useState, useEffect } from "react";

const generateId = () => Math.random().toString(36).slice(2, 9);
const STORAGE_KEY = "virgil_feedback_journal";

const SAMPLE_ENTRIES = [];

function useLocalStorage(key, fallback) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch { return fallback; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }, [key, value]);
  return [value, setValue];
}

const formatDate = (d) => {
  if (!d) return "";
  const [, m, day] = d.split("-");
  return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m)-1]} ${parseInt(day)}`;
};

const inputBase = {
  width: "100%",
  border: "1px solid #E8E4DC",
  background: "#FAFAF8",
  fontFamily: "'DM Mono', monospace",
  fontSize: 12,
  color: "#1A1A18",
  padding: "9px 12px",
  outline: "none",
  borderRadius: 2,
  boxSizing: "border-box",
};

const MODE = {
  win: {
    label: "Win",
    color: "#C8692A",
    bg: "#FEF0E8",
    dot: "#C8692A",
    quoteLabel: "What they said",
    quotePlaceholder: "Write it down in the exact words you heard.",
    actionLabel: null,
  },
  critical: {
    label: "Critical",
    color: "#3B5BDB",
    bg: "#E8F0FE",
    dot: "#3B5BDB",
    quoteLabel: "What they said",
    quotePlaceholder: "Write it down in the exact words you heard — not your interpretation.",
    actionLabel: "What you'll do differently",
  },
};

function EntryForm({ onSave, onCancel, initialType = "win" }) {
  const [type, setType] = useState(initialType);
  const [draft, setDraft] = useState({
    date: new Date().toISOString().split("T")[0],
    from: "",
    role: "",
    context: "",
    quote: "",
    action: "",
  });

  const m = MODE[type];
  const canSave = draft.from && draft.quote;

  const Label = ({ children, sub }) => (
    <div style={{ marginBottom: 5 }}>
      <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8A8680", fontFamily: "'Syne', sans-serif", fontWeight: 600 }}>{children}</span>
      {sub && <span style={{ fontSize: 10, color: "#C8B89A", marginLeft: 6, fontStyle: "italic" }}>{sub}</span>}
    </div>
  );

  return (
    <div style={{ background: "white", border: `1px solid ${m.color}`, borderRadius: 4, padding: 24, marginBottom: 24 }}>
      {/* Type toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["win", "critical"].map(t => (
          <button
            key={t}
            onClick={() => setType(t)}
            style={{
              fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              background: type === t ? MODE[t].bg : "transparent",
              color: type === t ? MODE[t].color : "#8A8680",
              border: `1px solid ${type === t ? MODE[t].color : "#E8E4DC"}`,
              padding: "6px 14px", cursor: "pointer", borderRadius: 20,
            }}
          >
            {MODE[t].label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <Label>Date</Label>
          <input style={inputBase} type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} />
        </div>
        <div>
          <Label>From</Label>
          <input style={inputBase} value={draft.from} onChange={e => setDraft({ ...draft, from: e.target.value })} placeholder="Name" />
        </div>
        <div>
          <Label>Their role</Label>
          <input style={inputBase} value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })} placeholder="e.g. Partner, Senior Associate" />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <Label>Matter or context</Label>
        <input style={inputBase} value={draft.context} onChange={e => setDraft({ ...draft, context: e.target.value })} placeholder="e.g. Dollaride SAFE review, client call" />
      </div>

      <div style={{ marginBottom: type === "critical" ? 12 : 20 }}>
        <Label sub="(exact words)">{m.quoteLabel}</Label>
        <textarea
          style={{ ...inputBase, resize: "vertical", minHeight: 80, lineHeight: 1.6 }}
          value={draft.quote}
          onChange={e => setDraft({ ...draft, quote: e.target.value })}
          placeholder={m.quotePlaceholder}
        />
      </div>

      {type === "critical" && (
        <div style={{ marginBottom: 20 }}>
          <Label>{m.actionLabel}</Label>
          <textarea
            style={{ ...inputBase, resize: "vertical", minHeight: 64, lineHeight: 1.6 }}
            value={draft.action}
            onChange={e => setDraft({ ...draft, action: e.target.value })}
            placeholder="One concrete thing you'll change next time."
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={() => canSave && onSave({ ...draft, type, id: generateId() })}
          style={{
            fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            background: canSave ? "#1A1A18" : "#C0BAB0", color: "#F7F5F0",
            border: "none", padding: "10px 20px",
            cursor: canSave ? "pointer" : "not-allowed", borderRadius: 2,
          }}
        >
          Save entry
        </button>
        <button
          onClick={onCancel}
          style={{
            fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
            letterSpacing: "0.08em", textTransform: "uppercase",
            background: "transparent", color: "#8A8680",
            border: "1px solid #E8E4DC", padding: "10px 20px",
            cursor: "pointer", borderRadius: 2,
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Entry({ entry, onDelete }) {
  const [open, setOpen] = useState(false);
  const m = MODE[entry.type];

  return (
    <div style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 4, overflow: "hidden" }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 20px", cursor: "pointer" }}>
        {/* Type dot */}
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: m.dot, flexShrink: 0 }} />

        {/* Date */}
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, color: m.color, minWidth: 44, flexShrink: 0 }}>
          {formatDate(entry.date)}
        </div>

        <div style={{ width: 1, height: 24, background: "#E8E4DC", flexShrink: 0 }} />

        {/* From */}
        <div style={{ minWidth: 110, flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "#1A1A18", whiteSpace: "nowrap" }}>{entry.from}</div>
          {entry.role && <div style={{ fontSize: 11, color: "#8A8680", fontStyle: "italic" }}>{entry.role}</div>}
        </div>

        {/* Context */}
        <div style={{ fontSize: 12, color: "#8A8680", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {entry.context}
        </div>

        {/* Quote preview */}
        {!open && (
          <div style={{ fontSize: 12, color: "#A8A49C", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 260, flexShrink: 1 }}>
            "{entry.quote}"
          </div>
        )}

        {/* Type badge */}
        <span style={{ fontSize: 10, background: m.bg, color: m.color, borderRadius: 20, padding: "2px 9px", fontFamily: "'Syne', sans-serif", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0 }}>
          {m.label}
        </span>

        <div style={{ color: "#C0BAB0", fontSize: 14, flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s ease" }}>↓</div>
      </div>

      {open && (
        <div style={{ borderTop: "1px solid #F2F0EB", padding: "20px", background: "#FAFAF8" }}>
          <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8680", fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: 10 }}>
            What they said
          </div>
          <p style={{ fontSize: 13, color: "#1A1A18", lineHeight: 1.8, fontStyle: "italic", borderLeft: `3px solid ${m.color}`, paddingLeft: 14, margin: "0 0 16px 0" }}>
            "{entry.quote}"
          </p>

          {entry.type === "critical" && entry.action && (
            <>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8680", fontFamily: "'Syne', sans-serif", fontWeight: 600, marginBottom: 10 }}>
                What you'll do differently
              </div>
              <p style={{ fontSize: 13, color: "#3B5BDB", lineHeight: 1.8, borderLeft: "3px solid #E8F0FE", paddingLeft: 14, margin: "0 0 16px 0" }}>
                {entry.action}
              </p>
            </>
          )}

          <button
            onClick={() => onDelete(entry.id)}
            style={{ background: "none", border: "none", color: "#C0BAB0", fontSize: 11, cursor: "pointer", fontFamily: "'Syne', sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", padding: 0 }}
          >
            Remove entry
          </button>
        </div>
      )}
    </div>
  );
}

export default function FeedbackJournal() {
  const [entries, setEntries] = useLocalStorage(STORAGE_KEY, SAMPLE_ENTRIES);
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");

  const saveEntry = (entry) => {
    setEntries([entry, ...entries]);
    setAdding(false);
  };

  const deleteEntry = (id) => setEntries(entries.filter(e => e.id !== id));

  const filtered = filter === "all" ? entries : entries.filter(e => e.type === filter);
  const wins = entries.filter(e => e.type === "win").length;
  const critical = entries.filter(e => e.type === "critical").length;

  const FilterBtn = ({ value, label }) => (
    <button
      onClick={() => setFilter(value)}
      style={{
        fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.08em", textTransform: "uppercase",
        background: filter === value ? "#1A1A18" : "transparent",
        color: filter === value ? "#F7F5F0" : "#8A8680",
        border: `1px solid ${filter === value ? "#1A1A18" : "#E8E4DC"}`,
        padding: "6px 14px", cursor: "pointer", borderRadius: 2,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#F7F5F0", minHeight: "100vh", padding: "40px 28px 80px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40, gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A8680", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8B89A", display: "inline-block" }} />
              Virgil <span style={{ color: "#C8B89A", margin: "0 4px" }}>·</span> Summer Associate
            </div>
            <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: "#1A1A18", lineHeight: 1.1, letterSpacing: "-0.02em", margin: 0 }}>Feedback Journal</h1>
            <p style={{ fontSize: 12, color: "#8A8680", marginTop: 6, fontStyle: "italic" }}>Log every piece of feedback — positive and critical — the same day you hear it, in the exact words you heard.</p>
          </div>
          <button
            onClick={() => setAdding(true)}
            style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", background: "#1A1A18", color: "#F7F5F0", border: "none", padding: "12px 22px", cursor: "pointer", borderRadius: 2, whiteSpace: "nowrap", flexShrink: 0 }}
          >
            + Log feedback
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total entries", value: entries.length, color: "#1A1A18" },
            { label: "Wins", value: wins, color: "#C8692A" },
            { label: "Critical", value: critical, color: "#3B5BDB" },
          ].map(s => (
            <div key={s.label} style={{ background: "white", border: "1px solid #E8E4DC", borderRadius: 2, padding: "10px 16px" }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8680" }}>{s.label}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <FilterBtn value="all" label="All" />
          <FilterBtn value="win" label="Wins" />
          <FilterBtn value="critical" label="Critical" />
        </div>

        {/* Form */}
        {adding && <EntryForm onSave={saveEntry} onCancel={() => setAdding(false)} />}

        {/* Entries */}
        {filtered.length === 0 && !adding ? (
          <div style={{ textAlign: "center", padding: "64px 24px", color: "#8A8680" }}>
            <div style={{ fontSize: 28, opacity: 0.3, marginBottom: 12 }}>◎</div>
            <p style={{ fontSize: 13, fontStyle: "italic" }}>
              {filter === "all" ? "No entries yet. The first one is closer than you think." : `No ${filter === "win" ? "wins" : "critical feedback"} logged yet.`}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(entry => <Entry key={entry.id} entry={entry} onDelete={deleteEntry} />)}
          </div>
        )}

        <p style={{ marginTop: 32, textAlign: "center", fontSize: 11, color: "#A8A49C", fontStyle: "italic" }}>
          — Write the entry the same day. You won't remember it a week later. —
        </p>
      </div>
    </div>
  );
}
