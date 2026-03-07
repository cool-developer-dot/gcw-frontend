import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

// Sidebar nav items
const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard", id: "dashboard" },
  { icon: "💰", label: "Staking", id: "staking" },
  { icon: "👥", label: "My Team", id: "team" },
  { icon: "📥", label: "Deposit", id: "deposit" },
  { icon: "📤", label: "Withdraw", id: "withdraw" },
  { icon: "📜", label: "Transactions", id: "transactions" },
  { icon: "⚙️", label: "Settings", id: "settings" },
];

// Fake chart bars
const chartData = [
  { day: "Mon", val: 42 }, { day: "Tue", val: 68 }, { day: "Wed", val: 55 },
  { day: "Thu", val: 90 }, { day: "Fri", val: 73 }, { day: "Sat", val: 61 }, { day: "Sun", val: 85 },
];

const recentTx = [
  { type: "Staking Reward", amount: "+$12.50", date: "Today, 10:30 AM", status: "Completed", color: "#22c55e" },
  { type: "Referral Bonus", amount: "+$8.00", date: "Today, 08:15 AM", status: "Completed", color: "#22c55e" },
  { type: "Deposit", amount: "+$500.00", date: "Yesterday", status: "Completed", color: "#1a6fd4" },
  { type: "Withdrawal", amount: "-$100.00", date: "Dec 28", status: "Pending", color: "#f59e0b" },
  { type: "Staking Reward", amount: "+$12.50", date: "Dec 27", status: "Completed", color: "#22c55e" },
];

function StatCard({ icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: bg || "rgba(255,255,255,0.03)",
      border: `1px solid ${color}25`,
      borderRadius: 16, padding: "20px 18px",
      transition: "all 0.3s", cursor: "default",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}25`; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ width: 42, height: 42, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
        <div style={{ background: `${color}15`, borderRadius: 20, padding: "3px 10px" }}>
          <span style={{ color, fontSize: 11, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>Live</span>
        </div>
      </div>
      <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "Segoe UI,sans-serif", marginBottom: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 12, color, fontFamily: "Segoe UI,sans-serif", fontWeight: 600 }}>{sub}</div>}
    </div>
  );
}

function MiniChart() {
  const max = Math.max(...chartData.map(d => d.val));
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "22px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Georgia,serif" }}>Earnings This Week</div>
          <div style={{ color: "#22c55e", fontSize: 13, fontFamily: "Segoe UI,sans-serif", fontWeight: 600 }}>↑ +18.4% from last week</div>
        </div>
        <div style={{ color: "#fff", fontSize: 22, fontWeight: 900, fontFamily: "Georgia,serif" }}>$87.50</div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
        {chartData.map((d, i) => (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{
              width: "100%", borderRadius: "4px 4px 0 0",
              height: `${(d.val / max) * 68}px`,
              background: i === 3 ? "linear-gradient(180deg,#1a6fd4,#0d4fa0)" : "rgba(26,111,212,0.25)",
              transition: "all 0.3s", cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "linear-gradient(180deg,#1a6fd4,#0d4fa0)"}
              onMouseLeave={e => { if (i !== 3) e.currentTarget.style.background = "rgba(26,111,212,0.25)"; }}
            />
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "Segoe UI,sans-serif" }}>{d.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralLinkBox() {
  const [copied, setCopied] = useState(false);
  const link = "https://gwc.io/ref/USER123";
  const copy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ background: "linear-gradient(135deg,rgba(26,111,212,0.12),rgba(26,111,212,0.04))", border: "1px solid rgba(26,111,212,0.3)", borderRadius: 16, padding: "20px 18px" }}>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Georgia,serif", marginBottom: 4 }}>🔗 Your Referral Link</div>
      <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", marginBottom: 14 }}>Share & earn from 10 levels</div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1, background: "rgba(0,0,0,0.3)", borderRadius: 8, padding: "10px 12px", color: "#5ba3f5", fontSize: 13, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{link}</div>
        <button onClick={copy} style={{ padding: "10px 16px", borderRadius: 8, background: copied ? "#22c55e" : GWC_BLUE, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap", transition: "all 0.3s" }}>
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        {[{ label: "Direct Referrals", val: "12" }, { label: "Total Team", val: "48" }, { label: "Referral Earned", val: "$124.00" }].map((s, i) => (
          <div key={i}>
            <div style={{ color: "#5ba3f5", fontWeight: 800, fontSize: 15, fontFamily: "Georgia,serif" }}>{s.val}</div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveStakes() {
  const stakes = [
    { id: "STK001", amount: "$500", daily: "$5.00", earned: "$45.00", end: "Jan 30, 2025", progress: 60, status: "Active" },
    { id: "STK002", amount: "$200", daily: "$2.00", earned: "$12.00", end: "Feb 14, 2025", progress: 25, status: "Active" },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Georgia,serif" }}>⚡ Active Stakes</div>
        <span style={{ background: "rgba(26,111,212,0.2)", color: "#5ba3f5", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "Segoe UI,sans-serif" }}>2 Active</span>
      </div>
      {stakes.map((s, i) => (
        <div key={i} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px", marginBottom: i < stakes.length - 1 ? 10 : 0, border: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Georgia,serif" }}>{s.amount}</span>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginLeft: 8, fontFamily: "Segoe UI,sans-serif" }}>#{s.id}</span>
            </div>
            <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "Segoe UI,sans-serif" }}>{s.status}</span>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
            <div><div style={{ color: "#22c55e", fontWeight: 700, fontSize: 13, fontFamily: "Georgia,serif" }}>{s.daily}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>Daily</div></div>
            <div><div style={{ color: "#5ba3f5", fontWeight: 700, fontSize: 13, fontFamily: "Georgia,serif" }}>{s.earned}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>Earned</div></div>
            <div><div style={{ color: "rgba(255,255,255,0.6)", fontWeight: 700, fontSize: 13, fontFamily: "Georgia,serif" }}>{s.end}</div><div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontFamily: "Segoe UI,sans-serif" }}>End Date</div></div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 5 }}>
            <div style={{ width: `${s.progress}%`, height: "100%", background: "linear-gradient(90deg,#1a6fd4,#22c55e)", borderRadius: 4 }} />
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4, fontFamily: "Segoe UI,sans-serif" }}>{s.progress}% complete</div>
        </div>
      ))}
    </div>
  );
}

function RecentTransactions() {
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Georgia,serif" }}>📜 Recent Transactions</div>
        <button style={{ background: "none", border: "none", color: GWC_BLUE, fontSize: 13, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", fontWeight: 600 }}>View All</button>
      </div>
      {recentTx.map((tx, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: i < recentTx.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `${tx.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
              {tx.type === "Deposit" ? "📥" : tx.type === "Withdrawal" ? "📤" : tx.type === "Referral Bonus" ? "👥" : "💰"}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>{tx.type}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{tx.date}</div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: tx.color, fontSize: 14, fontWeight: 800, fontFamily: "Georgia,serif" }}>{tx.amount}</div>
            <div style={{ fontSize: 10, color: tx.status === "Pending" ? "#f59e0b" : "rgba(255,255,255,0.3)", fontFamily: "Segoe UI,sans-serif" }}>{tx.status}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeamSummary() {
  const levels = [
    { l: "L1", members: 12, active: 10, volume: "$6,200" },
    { l: "L2", members: 35, active: 28, volume: "$14,800" },
    { l: "L3", members: 89, active: 64, volume: "$31,500" },
  ];
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
      <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Georgia,serif", marginBottom: 16 }}>👥 Team Summary</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {levels.map((l, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(26,111,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#5ba3f5", fontSize: 11, fontWeight: 900, fontFamily: "Georgia,serif" }}>{l.l}</div>
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>{l.members} Members</div>
                <div style={{ color: "#22c55e", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{l.active} Active</div>
              </div>
            </div>
            <div style={{ color: "#5ba3f5", fontWeight: 800, fontSize: 14, fontFamily: "Georgia,serif" }}>{l.volume}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ active, setActive, collapsed, setCollapsed, isMobile, mobileOpen, setMobileOpen }) {
  const width = collapsed ? 68 : 220;

  if (isMobile) {
    if (!mobileOpen) return null;
    return (
      <>
        <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }} />
        <div style={{ position: "fixed", left: 0, top: 0, bottom: 0, width: 230, background: "#060a15", borderRight: "1px solid rgba(26,111,212,0.2)", zIndex: 201, padding: "24px 0", overflowY: "auto" }}>
          <SidebarContent active={active} setActive={(id) => { setActive(id); setMobileOpen(false); }} collapsed={false} />
        </div>
      </>
    );
  }

  return (
    <div style={{ width, flexShrink: 0, background: "#060a15", borderRight: "1px solid rgba(26,111,212,0.15)", padding: "24px 0", display: "flex", flexDirection: "column", transition: "width 0.3s", overflowX: "hidden" }}>
      <SidebarContent active={active} setActive={setActive} collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
    </div>
  );
}

function SidebarContent({ active, setActive, collapsed, onToggle }) {
  const navigate = useNavigate();

  const handleNav = (id) => {
    if (id === 'staking')           navigate('/staking');
    else if (id === 'team')         navigate('/referral');
    else if (id === 'deposit')      navigate('/finance');
    else if (id === 'withdraw')     navigate('/finance');
    else if (id === 'transactions') navigate('/finance');
    else setActive(id);
  };

  return (
    <>
      {/* Logo */}
      <div style={{ padding: "0 16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#0a3d7a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif", flexShrink: 0 }}>G</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>Global Wealth</div>
              <div style={{ fontSize: 8, color: GWC_BLUE, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif" }}>Community</div>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, padding: "0 10px" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => handleNav(item.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            padding: collapsed ? "12px" : "12px 14px",
            borderRadius: 10, border: "none", cursor: "pointer",
            background: active === item.id ? "linear-gradient(135deg,rgba(26,111,212,0.25),rgba(26,111,212,0.1))" : "transparent",
            color: active === item.id ? "#fff" : "rgba(255,255,255,0.4)",
            marginBottom: 4, transition: "all 0.2s",
            borderLeft: active === item.id ? `3px solid ${GWC_BLUE}` : "3px solid transparent",
            justifyContent: collapsed ? "center" : "flex-start"
          }}
            onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { if (active !== item.id) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; } }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && <span style={{ fontSize: 14, fontWeight: active === item.id ? 700 : 500, fontFamily: "Segoe UI,sans-serif" }}>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      {onToggle && (
        <div style={{ padding: "12px 10px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 12 }}>
          <button onClick={onToggle} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16 }}>
            {collapsed ? "→" : "←"}
          </button>
        </div>
      )}

      {/* User */}
      {!collapsed && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", flexShrink: 0 }}>A</div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Ahmed Khan</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>ID: GWC-1234</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TopBar({ activeLabel, isMobile, onMenuOpen }) {
  return (
    <div style={{ height: 64, background: "rgba(6,10,21,0.8)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", backdropFilter: "blur(10px)", flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isMobile && (
          <button onClick={onMenuOpen} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer", padding: 0 }}>☰</button>
        )}
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif" }}>{activeLabel}</div>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Welcome back, Ahmed 👋</div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Notification */}
        <div style={{ position: "relative" }}>
          <button style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🔔</button>
          <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: "#ef4444", border: "2px solid #060a15" }} />
        </div>
        {/* Avatar */}
        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 900, color: "#fff", cursor: "pointer" }}>A</div>
      </div>
    </div>
  );
}

function DashboardContent() {
  return (
    <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 20 }}>
        <StatCard icon="💼" label="Main Wallet" value="$1,247.50" sub="+$12.50 today" color="#1a6fd4" />
        <StatCard icon="🔒" label="Total Staked" value="$700.00" sub="2 active stakes" color="#0ea5e9" />
        <StatCard icon="📈" label="Daily Reward" value="$7.00" sub="Auto credited" color="#22c55e" />
        <StatCard icon="👥" label="Referral Earned" value="$124.00" sub="48 team members" color="#f59e0b" />
        <StatCard icon="💸" label="Withdrawable" value="$547.50" sub="Available now" color="#a855f7" />
        <StatCard icon="🏆" label="Total Earned" value="$671.50" sub="All time" color="#ef4444" />
      </div>

      {/* Chart + Referral */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 20 }}>
        <MiniChart />
        <ReferralLinkBox />
      </div>

      {/* Stakes + Team */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14, marginBottom: 20 }}>
        <ActiveStakes />
        <TeamSummary />
      </div>

      {/* Transactions */}
      <RecentTransactions />
    </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeLabel = NAV_ITEMS.find(n => n.id === active)?.label || "Dashboard";

  return (
    <div style={{ display: "flex", height: "100vh", background: GWC_DARK, overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar
        active={active} setActive={setActive}
        collapsed={collapsed} setCollapsed={setCollapsed}
        isMobile={isMobile} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen}
      />

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <TopBar activeLabel={activeLabel} isMobile={isMobile} onMenuOpen={() => setMobileOpen(true)} />

        {/* Content Area */}
        {active === "dashboard" && <DashboardContent />}
        {active !== "dashboard" && (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
            <div style={{ fontSize: 56 }}>{NAV_ITEMS.find(n => n.id === active)?.icon}</div>
            <div style={{ color: "#fff", fontSize: 22, fontWeight: 800, fontFamily: "Georgia,serif" }}>{activeLabel}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "Segoe UI,sans-serif" }}>This section is being built — coming soon!</div>
            <button onClick={() => setActive("dashboard")} style={{ padding: "10px 24px", borderRadius: 10, background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
              ← Back to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}