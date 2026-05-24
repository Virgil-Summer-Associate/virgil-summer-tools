const H = ({ children, size = 30, style = {} }) => (
  <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: size, color: "#1A1A18", letterSpacing: "-0.02em", lineHeight: 1.15, margin: 0, ...style }}>{children}</h2>
);

const P = ({ children, style = {} }) => (
  <p style={{ fontSize: 14, lineHeight: 1.8, color: "#3A3A36", margin: 0, ...style }}>{children}</p>
);

const Label = ({ children }) => (
  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A8680", marginBottom: 8 }}>{children}</div>
);

const TOOLS = [
  {
    id: "tracker",
    number: "01",
    title: "Assignment Tracker",
    color: "#3B5BDB",
    bg: "#E8F0FE",
    tagline: "Every matter on your desk, in one place.",
    body: `By week three, you'll be staffed on more work than you expected, across more attorneys than you expected. The summer associates who look sharp are the ones who can tell any partner exactly where their matter stands without checking their notes. That kind of command isn't a personality trait — it's a system.

At Virgil, you're working virtually. Nobody is walking past your desk to check in. No one sees whether you're on top of things or quietly falling behind. That's the whole point of the tracker — it's your own accountability system in an environment where there's no built-in one. A SAFE on Monday, an offer letter by Wednesday, a cap table question on Friday. Without something tracking it all, it blurs fast.

Update it at the end of every working day. The discipline of opening it before you close your laptop will catch the dropped ball before the partner even knows to ask.`,
    howto: [
      "Add a new row every time an assignment lands.",
      "Update the status at the end of each day — not the end of the week.",
      "When you receive feedback on a piece of work, check the box.",
      "If a deadline is overdue it turns red. Handle it before you close your laptop.",
    ],
  },
  {
    id: "feedback",
    number: "02",
    title: "Feedback Journal",
    color: "#C8692A",
    bg: "#FEF0E8",
    tagline: "The good feedback disappears faster than the bad. Log both.",
    body: `The brain weighs criticism more heavily than praise, and the criticism sticks longer. One redline from a partner will outweigh five compliments by the end of the week. By the end of the summer the positive moments are almost impossible to recall — even though they happened.

The feedback journal captures both sides. Every win, logged the same day in the exact words you heard. Every piece of critical feedback, logged the same way — plus one field: what you'll do differently next time. That second field is the difference between feedback that stings once and feedback that actually changes how you work.

It pays off in three places: your end-of-summer self-evaluation, the memo your supervising attorney writes for the offer decision where specific examples carry real weight, and the harder days when the critical feedback is drowning out everything else. The wins are still there. You just have to have written them down.`,
    howto: [
      "Log every entry the same day — wins and critical feedback both.",
      "Write what they said verbatim. Not your interpretation, not a paraphrase.",
      "For critical feedback, write one concrete thing you'll do differently next time.",
      "Use the filter to review only wins before your self-evaluation. Use it.",
    ],
  },
  {
    id: "supervisors",
    number: "03",
    title: "Supervisor Manual",
    color: "#2B7A3B",
    bg: "#EBFBEE",
    tagline: "The work is learnable. The relationships are harder and matter more.",
    body: `Every attorney you work with has a different definition of "urgent," a different idea of what a good draft looks like, and a different way they want to be communicated with. Figure that out early and your work gets better fast. Miss it and you'll spend the summer getting redlines you could have avoided.

Working virtually makes this harder and more important at the same time. You can't read a room. You can't pick up on body language in the hallway. Every signal you get comes through a Slack message, a redline, or a comment on a Documenso envelope. So you have to be more deliberate about learning who you're working with and what they actually want.

The supervisor manual is a profile card for every attorney you work with. Communication style, what "urgent" actually means to them, what they value in a draft, what keeps coming back in their feedback. At Virgil you're also navigating real systems — Solve.It, Documenso, Airtable, Discord — and every person uses them slightly differently. The manual is where you note who introduced you to what, who to ask when something breaks, and what each person's workflow actually looks like. That institutional knowledge is invisible until you need it. You will need it.`,
    howto: [
      "Create a card after your first assignment with a new supervising attorney.",
      "Update it after every interaction — especially after feedback.",
      "Note their communication preference early. In a virtual firm, how someone wants to hear from you matters as much as what you say.",
      "Add the tools they use and how they use them. Ask if you're not sure — nobody expects you to already know.",
    ],
  },
];

export default function Home({ onNavigate }) {
  return (
    <div style={{ fontFamily: "'DM Mono', 'Courier New', monospace", maxWidth: 860, margin: "0 auto", padding: "64px 28px 100px" }}>

      {/* Hero */}
      <div style={{ marginBottom: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8B89A", display: "inline-block" }} />
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#8A8680" }}>Virgil · Summer Associate Tools</span>
        </div>
        <H size={42} style={{ marginBottom: 20 }}>Ten weeks goes faster than you think.</H>
        <P style={{ fontSize: 15, maxWidth: 640, color: "#5A5A56" }}>
          You'll spend the first two weeks figuring out the systems. The next four doing the most interesting work you've done. The last four wondering where the time went. At Virgil, all of that happens remotely — which means nobody is watching over your shoulder, and the only person keeping track of your progress is you. These three tools help you do that.
        </P>
        <div style={{ marginTop: 20, padding: "16px 20px", background: "white", border: "1px solid #E8E4DC", borderRadius: 3, borderLeft: "3px solid #C8B89A", maxWidth: 600 }}>
          <P style={{ fontSize: 13, fontStyle: "italic", color: "#5A5A56" }}>
            "The work at Virgil is learnable. What they're actually evaluating is how fast you adapt — to the people, to the tools, to a workflow that doesn't look like anything you've seen in school."
          </P>
        </div>
      </div>

      {/* Tool sections */}
      {TOOLS.map((tool, i) => (
        <div key={tool.id} style={{ marginBottom: 72 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 24 }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 13, color: tool.color, background: tool.bg, borderRadius: 2, padding: "4px 10px", flexShrink: 0, letterSpacing: "0.06em", marginTop: 4 }}>
              {tool.number}
            </div>
            <div>
              <H size={24} style={{ marginBottom: 4 }}>{tool.title}</H>
              <P style={{ fontSize: 13, color: tool.color, fontStyle: "italic" }}>{tool.tagline}</P>
            </div>
          </div>

          <div>
            {tool.body.split("\n\n").map((para, j) => (
              <P key={j} style={{ marginBottom: 14 }}>{para}</P>
            ))}
          </div>

          <div style={{ marginTop: 24, background: "white", border: "1px solid #E8E4DC", borderRadius: 3, padding: "20px 24px" }}>
            <Label>How to use it</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
              {tool.howto.map((step, j) => (
                <div key={j} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 10, fontWeight: 700, color: tool.color, background: tool.bg, borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{j + 1}</span>
                  <P style={{ fontSize: 13 }}>{step}</P>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => onNavigate(tool.id)}
              style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", background: "#1A1A18", color: "#F7F5F0", border: "none", padding: "10px 20px", cursor: "pointer", borderRadius: 2 }}
            >
              Open {tool.title} →
            </button>
          </div>

          {i < TOOLS.length - 1 && <div style={{ marginTop: 72, borderTop: "1px solid #E8E4DC" }} />}
        </div>
      ))}

      <div style={{ borderTop: "1px solid #E8E4DC", paddingTop: 40 }}>
        <P style={{ fontSize: 12, color: "#8A8680", fontStyle: "italic", textAlign: "center" }}>
          Built for Virgil summer associates. Your data stays in your browser — private to you, persistent all summer.
        </P>
      </div>
    </div>
  );
}
