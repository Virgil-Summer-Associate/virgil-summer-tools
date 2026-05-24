import { useState } from "react";
import Home from "./pages/Home";
import AssignmentTracker from "./pages/AssignmentTracker";
import FeedbackJournal from "./pages/FeedbackJournal";
import SupervisorManual from "./pages/SupervisorManual";

const NAV_ITEMS = [
  { id: "home", label: "Overview" },
  { id: "tracker", label: "Assignment Tracker" },
  { id: "feedback", label: "Feedback Journal" },
  { id: "supervisors", label: "Supervisor Manual" },
];

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ fontFamily: "'DM Mono', monospace", background: "#F7F5F0", minHeight: "100vh" }}>
      <nav style={{ background: "white", borderBottom: "1px solid #E8E4DC", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, padding: 0 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8B89A", display: "inline-block" }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1A1A18" }}>Virgil</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 400, fontSize: 11, color: "#8A8680", letterSpacing: "0.08em", textTransform: "uppercase" }}>Summer Tools</span>
          </button>
          <div style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                style={{
                  background: page === item.id ? "#F2F0EB" : "none",
                  border: "none", cursor: "pointer",
                  fontFamily: "'Syne', sans-serif", fontSize: 11,
                  fontWeight: page === item.id ? 700 : 500,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  color: page === item.id ? "#1A1A18" : "#8A8680",
                  padding: "6px 12px", borderRadius: 2,
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>
      <div>
        {page === "home" && <Home onNavigate={setPage} />}
        {page === "tracker" && <AssignmentTracker />}
        {page === "feedback" && <FeedbackJournal />}
        {page === "supervisors" && <SupervisorManual />}
      </div>
    </div>
  );
}
