import { useState } from "react";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const LEVELS = [
  { level: 1, percent: "10%", color: "#1a6fd4", members: 12, active: 10, volume: "$6,200", earned: "$62.00" },
  { level: 2, percent: "8%",  color: "#0ea5e9", members: 35, active: 28, volume: "$14,800", earned: "$118.40" },
  { level: 3, percent: "6%",  color: "#22c55e", members: 89, active: 64, volume: "$31,500", earned: "$189.00" },
  { level: 4, percent: "5%",  color: "#16a34a", members: 143, active: 98, volume: "$52,000", earned: "$260.00" },
  { level: 5, percent: "4%",  color: "#84cc16", members: 210, active: 145, volume: "$78,400", earned: "$313.60" },
  { level: 6, percent: "3%",  color: "#f59e0b", members: 89,  active: 60,  volume: "$33,000", earned: "$99.00" },
  { level: 7, percent: "2%",  color: "#f97316", members: 45,  active: 30,  volume: "$18,000", earned: "$36.00" },
  { level: 8, percent: "1.5%",color: "#ef4444", members: 20,  active: 12,  volume: "$8,000",  earned: "$12.00" },
  { level: 9, percent: "0.5%",color: "#a855f7", members: 8,   active: 5,   volume: "$3,200",  earned: "$1.60" },
  { level: 10,percent: "0.5%",color: "#ec4899", members: 3,   active: 2,   volume: "$1,000",  earned: "$0.50" },
];

const DIRECT_TEAM = [
  { name: "Ali Hassan",    id: "GWC-2201", joined: "Dec 01", staked: "$500",  status: "Active",   team: 24 },
  { name: "Sara Ahmed",   id: "GWC-2202", joined: "Dec 05", staked: "$200",  status: "Active",   team: 11 },
  { name: "Umar Farooq",  id: "GWC-2203", joined: "Dec 08", staked: "$1000", status: "Active",   team: 37 },
  { name: "Zainab Malik", id: "GWC-2204", joined: "Dec 10", staked: "$0",    status: "Inactive", team: 0 },
  { name: "Bilal Khan",   id: "GWC-2205", joined: "Dec 14", staked: "$300",  status: "Active",   team: 8 },
  { name: "Nadia Raza",   id: "GWC-2206", joined: "Dec 18", staked: "$750",  status: "Active",   team: 15 },
];

function ReferralLink() {
  const [copied, setCopied] = useState(false);
  const link = "https://gwc.io/ref/USER123";
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(26,111,212,0.15),rgba(26,111,212,0.05))", border: "1px solid rgba(26,111,212,0.3)", borderRadius: 18, padding: "24px 22px", marginBottom: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "Georgia,serif", marginBottom: 6 }}>🔗 Your Referral Link</h3>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>Share this link to grow your 10-level team</p>
        </div>
        <div style={{ display: "flex", gap: 14 }}>
          {[
            { label: "Total Team", val: "654" },
            { label: "Direct", val: "12" },
            { label: "Total Earned", val: "$1,092" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ color: "#5ba3f5", fontWeight: 900, fontSize: 18, fontFamily: "Georgia,serif" }}>{s.val}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, background: "rgba(0,0,0,0.35)", borderRadius: 10, padding: "12px 16px", color: "#5ba3f5", fontSize: 14, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", border: "1px solid rgba(26,111,212,0.2)" }}>{link}</div>
        <button onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "12px 22px", borderRadius: 10, background: copied ? "#22c55e" : GWC_BLUE, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", transition: "all 0.3s", whiteSpace: "nowrap" }}>
          {copied ? "✓ Copied!" : "📋 Copy Link"}
        </button>
        <button style={{ padding: "12px 18px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>📤 Share</button>
      </div>
    </div>
  );
}

function LevelsSummary() {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 20px", marginBottom: 24 }}>
      <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 17, fontFamily: "Georgia,serif", marginBottom: 18 }}>📊 All 10 Levels Overview</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {LEVELS.map((l, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.02)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.04)", flexWrap: "wrap" }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: `${l.color}20`, border: `1px solid ${l.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: l.color, fontFamily: "Georgia,serif", flexShrink: 0 }}>{l.level}</div>
            <div style={{ minWidth: 80 }}>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>Level {l.level}</div>
              <div style={{ color: l.color, fontWeight: 800, fontSize: 12, fontFamily: "Georgia,serif" }}>{l.percent} commission</div>
            </div>
            <div style={{ flex: 1, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{l.members}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>Members</div></div>
              <div><div style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{l.active}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>Active</div></div>
              <div><div style={{ color: "#5ba3f5", fontWeight: 700, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{l.volume}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>Volume</div></div>
              <div><div style={{ color: "#f59e0b", fontWeight: 700, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{l.earned}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>Earned</div></div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 6, width: 80, overflow: "hidden", flexShrink: 0 }}>
              <div style={{ width: `${(l.active / l.members) * 100}%`, height: "100%", background: l.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DirectTeam() {
  const [search, setSearch] = useState("");
  const filtered = DIRECT_TEAM.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search));

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 17, fontFamily: "Georgia,serif" }}>👥 Direct Team (Level 1)</h3>
        <input
          placeholder="Search member..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", fontFamily: "Segoe UI,sans-serif", width: 180 }}
        />
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["Member", "User ID", "Joined", "Staked", "My Team", "Status"].map(h => (
                <th key={h} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, padding: "10px 12px", textAlign: "left", fontFamily: "Segoe UI,sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <td style={{ padding: "12px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0 }}>{m.name[0]}</div>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{m.name}</span>
                </td>
                <td style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>{m.id}</td>
                <td style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{m.joined}</td>
                <td style={{ padding: "12px", color: "#5ba3f5", fontSize: 13, fontWeight: 700, fontFamily: "Georgia,serif" }}>{m.staked}</td>
                <td style={{ padding: "12px", color: "rgba(255,255,255,0.6)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{m.team} members</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", background: m.status === "Active" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.07)", color: m.status === "Active" ? "#22c55e" : "rgba(255,255,255,0.35)" }}>{m.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ minHeight: "100vh", background: GWC_DARK, padding: "20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>👥 Referral & Team</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "Segoe UI,sans-serif" }}>Manage your 10-level referral network</p>
        </div>

        <ReferralLink />

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)", width: "fit-content", gap: 4 }}>
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "direct", label: "👥 Direct Team" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 22px", borderRadius: 9,
              background: tab === t.id ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "transparent",
              border: "none", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", transition: "all 0.3s"
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "overview" && <LevelsSummary />}
        {tab === "direct" && <DirectTeam />}
      </div>
    </div>
  );
}
