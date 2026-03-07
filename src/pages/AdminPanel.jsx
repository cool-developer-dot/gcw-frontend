import { useState } from "react";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const ADMIN_NAV = [
  { icon: "📊", label: "Dashboard", id: "dashboard" },
  { icon: "👥", label: "Users", id: "users" },
  { icon: "💰", label: "Deposits", id: "deposits" },
  { icon: "📤", label: "Withdrawals", id: "withdrawals" },
  { icon: "🔒", label: "Staking", id: "staking" },
  { icon: "⚙️", label: "Settings", id: "settings" },
  { icon: "📢", label: "Announcements", id: "announcements" },
];

const USERS = [
  { name: "Ali Hassan",    id: "GWC-2201", email: "ali@email.com",    balance: "$1,247", staked: "$500",  status: "Active",   joined: "Dec 01" },
  { name: "Sara Ahmed",   id: "GWC-2202", email: "sara@email.com",   balance: "$340",   staked: "$200",  status: "Active",   joined: "Dec 05" },
  { name: "Umar Farooq",  id: "GWC-2203", email: "umar@email.com",   balance: "$2,800", staked: "$1000", status: "Active",   joined: "Dec 08" },
  { name: "Zainab Malik", id: "GWC-2204", email: "zainab@email.com", balance: "$0",     staked: "$0",    status: "Blocked",  joined: "Dec 10" },
  { name: "Bilal Khan",   id: "GWC-2205", email: "bilal@email.com",  balance: "$520",   staked: "$300",  status: "Active",   joined: "Dec 14" },
];

const PENDING_DEPOSITS = [
  { user: "Ali Hassan",  id: "DEP001", amount: "$500", network: "TRC20", date: "Dec 30", txn: "TRX8f2a...4d9c" },
  { user: "Bilal Khan",  id: "DEP002", amount: "$200", network: "BEP20", date: "Dec 30", txn: "TRX3b1e...8f2d" },
  { user: "Sara Ahmed",  id: "DEP003", amount: "$150", network: "TRC20", date: "Dec 29", txn: "TRX9c4b...2e1a" },
];

const PENDING_WITHDRAWALS = [
  { user: "Umar Farooq", id: "WTH001", amount: "$100", fee: "$2", net: "$98", date: "Dec 29", wallet: "TRX1234...5678" },
  { user: "Ali Hassan",  id: "WTH002", amount: "$200", fee: "$2", net: "$198", date: "Dec 28", wallet: "TRX8765...4321" },
];

function StatusBadge({ status }) {
  const c = { Active: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" }, Blocked: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" }, Pending: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" }, Approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" }, Rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" } };
  const s = c[status] || c.Pending;
  return <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", background: s.bg, color: s.color }}>{status}</span>;
}

function AdminDashboard() {
  const stats = [
    { icon: "👥", label: "Total Users", val: "654", sub: "+12 today", color: "#1a6fd4" },
    { icon: "✅", label: "Active Users", val: "521", sub: "79.6% active", color: "#22c55e" },
    { icon: "📥", label: "Total Deposits", val: "$248,500", sub: "+$2,400 today", color: "#0ea5e9" },
    { icon: "📤", label: "Total Withdrawals", val: "$89,200", sub: "$300 pending", color: "#f59e0b" },
    { icon: "🔒", label: "Active Stakes", val: "1,234", sub: "$700K staked", color: "#a855f7" },
    { icon: "💰", label: "Rewards Paid", val: "$42,800", sub: "All time", color: "#ef4444" },
  ];

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}25`, borderRadius: 16, padding: "18px 16px", transition: "all 0.3s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.color}55`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${s.color}25`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: "1.4rem", fontWeight: 900, fontFamily: "Georgia,serif" }}>{s.val}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", marginTop: 4 }}>{s.label}</div>
            <div style={{ color: s.color, fontSize: 11, fontFamily: "Segoe UI,sans-serif", marginTop: 4, fontWeight: 600 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px", marginBottom: 20 }}>
        <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 16 }}>⚡ Quick Actions</h3>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            { label: "Approve Deposits", count: 3, color: "#22c55e", icon: "📥" },
            { label: "Approve Withdrawals", count: 2, color: "#f59e0b", icon: "📤" },
            { label: "Pending Users", count: 5, color: "#1a6fd4", icon: "👥" },
            { label: "Send Rewards", count: 0, color: "#a855f7", icon: "💰" },
          ].map((a, i) => (
            <button key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 10, background: `${a.color}12`, border: `1px solid ${a.color}30`, color: "#fff", cursor: "pointer", fontFamily: "Segoe UI,sans-serif", transition: "all 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = `${a.color}22`}
              onMouseLeave={e => e.currentTarget.style.background = `${a.color}12`}
            >
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</span>
              {a.count > 0 && <span style={{ background: a.color, color: "#fff", fontSize: 11, fontWeight: 800, padding: "2px 8px", borderRadius: 20 }}>{a.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
        <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 16 }}>📋 Recent Activity</h3>
        {[
          { msg: "New user registered: Nadia Raza", time: "2 min ago", color: "#22c55e", icon: "👤" },
          { msg: "Deposit approved: Ali Hassan $500", time: "15 min ago", color: "#1a6fd4", icon: "📥" },
          { msg: "Withdrawal request: Umar Farooq $100", time: "1 hr ago", color: "#f59e0b", icon: "📤" },
          { msg: "New stake: Bilal Khan $300 Gold Plan", time: "2 hr ago", color: "#a855f7", icon: "🔒" },
          { msg: "Daily rewards distributed: 1,234 users", time: "6 hr ago", color: "#22c55e", icon: "💰" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${a.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{a.msg}</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsersPanel() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const filtered = USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <input placeholder="🔍 Search user..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", fontFamily: "Segoe UI,sans-serif", width: 220 }} />
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                {["User", "ID", "Email", "Balance", "Staked", "Status", "Joined", "Actions"].map(h => (
                  <th key={h} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, padding: "14px 14px", textAlign: "left", fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)", transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#22c55e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0 }}>{u.name[0]}</div>
                      <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>{u.id}</td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>{u.email}</td>
                  <td style={{ padding: "12px 14px", color: "#22c55e", fontSize: 13, fontWeight: 700, fontFamily: "Georgia,serif" }}>{u.balance}</td>
                  <td style={{ padding: "12px 14px", color: "#5ba3f5", fontSize: 13, fontWeight: 700, fontFamily: "Georgia,serif" }}>{u.staked}</td>
                  <td style={{ padding: "12px 14px" }}><StatusBadge status={u.status} /></td>
                  <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{u.joined}</td>
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={{ padding: "5px 10px", borderRadius: 6, background: "rgba(26,111,212,0.2)", border: "none", color: "#5ba3f5", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>View</button>
                      <button style={{ padding: "5px 10px", borderRadius: 6, background: u.status === "Blocked" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", border: "none", color: u.status === "Blocked" ? "#22c55e" : "#ef4444", fontSize: 11, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
                        {u.status === "Blocked" ? "Unblock" : "Block"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DepositsPanel() {
  const [deposits, setDeposits] = useState(PENDING_DEPOSITS.map(d => ({ ...d, action: null })));
  const approve = (id) => setDeposits(prev => prev.map(d => d.id === id ? { ...d, action: "approved" } : d));
  const reject = (id) => setDeposits(prev => prev.map(d => d.id === id ? { ...d, action: "rejected" } : d));

  return (
    <div>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "Georgia,serif", marginBottom: 20 }}>📥 Pending Deposits</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {deposits.map((d, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${d.action === "approved" ? "rgba(34,197,94,0.3)" : d.action === "rejected" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "18px 20px", transition: "all 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Georgia,serif" }}>{d.amount}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Amount</div></div>
                <div><div style={{ color: "#5ba3f5", fontWeight: 600, fontSize: 14, fontFamily: "Segoe UI,sans-serif" }}>{d.user}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>User</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{d.network}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Network</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "monospace" }}>{d.txn}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>TXN ID</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{d.date}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Date</div></div>
              </div>
              {!d.action ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => approve(d.id)} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>✅ Approve</button>
                  <button onClick={() => reject(d.id)} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>❌ Reject</button>
                </div>
              ) : (
                <StatusBadge status={d.action === "approved" ? "Approved" : "Rejected"} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WithdrawalsPanel() {
  const [withdrawals, setWithdrawals] = useState(PENDING_WITHDRAWALS.map(w => ({ ...w, action: null })));
  const approve = (id) => setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, action: "approved" } : w));
  const reject = (id) => setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, action: "rejected" } : w));

  return (
    <div>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "Georgia,serif", marginBottom: 20 }}>📤 Pending Withdrawals</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {withdrawals.map((w, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${w.action === "approved" ? "rgba(34,197,94,0.3)" : w.action === "rejected" ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`, borderRadius: 16, padding: "18px 20px", transition: "all 0.3s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div><div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Georgia,serif" }}>{w.amount}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Requested</div></div>
                <div><div style={{ color: "#22c55e", fontWeight: 700, fontSize: 15, fontFamily: "Georgia,serif" }}>{w.net}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Net (after fee)</div></div>
                <div><div style={{ color: "#5ba3f5", fontWeight: 600, fontSize: 14, fontFamily: "Segoe UI,sans-serif" }}>{w.user}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>User</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "monospace" }}>{w.wallet}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Wallet</div></div>
                <div><div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{w.date}</div><div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Date</div></div>
              </div>
              {!w.action ? (
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => approve(w.id)} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)", color: "#22c55e", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>✅ Approve</button>
                  <button onClick={() => reject(w.id)} style={{ padding: "9px 20px", borderRadius: 8, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>❌ Reject</button>
                </div>
              ) : (
                <StatusBadge status={w.action === "approved" ? "Approved" : "Rejected"} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [settings, setSettings] = useState({ minStake: 50, maxStake: 99999, minWithdraw: 20, withdrawFee: 2, l1: 10, l2: 8, l3: 6, l4: 5, l5: 4, l6: 3, l7: 2, l8: 1.5, l9: 0.5, l10: 0.5, maintenance: false });
  const set = (k) => (e) => setSettings({ ...settings, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "Georgia,serif", marginBottom: 20 }}>⚙️ Platform Settings</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 20 }}>
        {/* Staking Settings */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
          <h4 style={{ color: "#5ba3f5", fontSize: 14, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", marginBottom: 16 }}>🔒 Staking Limits</h4>
          {[{ label: "Min Stake ($)", key: "minStake" }, { label: "Max Stake ($)", key: "maxStake" }, { label: "Min Withdrawal ($)", key: "minWithdraw" }, { label: "Withdrawal Fee ($)", key: "withdrawFee" }].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", marginBottom: 6 }}>{f.label}</label>
              <input type="number" value={settings[f.key]} onChange={set(f.key)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "Segoe UI,sans-serif", boxSizing: "border-box" }} />
            </div>
          ))}
        </div>

        {/* Commission Settings */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
          <h4 style={{ color: "#5ba3f5", fontSize: 14, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", marginBottom: 16 }}>💰 Commission % (10 Levels)</h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[1,2,3,4,5,6,7,8,9,10].map(l => (
              <div key={l}>
                <label style={{ display: "block", color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Segoe UI,sans-serif", marginBottom: 4 }}>Level {l} %</label>
                <input type="number" step="0.1" value={settings[`l${l}`]} onChange={set(`l${l}`)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "Segoe UI,sans-serif", boxSizing: "border-box" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "20px 18px" }}>
          <h4 style={{ color: "#5ba3f5", fontSize: 14, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", marginBottom: 16 }}>🔧 Platform Control</h4>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: settings.maintenance ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.03)", borderRadius: 12, border: `1px solid ${settings.maintenance ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)"}`, marginBottom: 14 }}>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>🔧 Maintenance Mode</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>Temporarily disable platform</div>
            </div>
            <div onClick={() => setSettings({ ...settings, maintenance: !settings.maintenance })} style={{ width: 44, height: 24, borderRadius: 12, background: settings.maintenance ? "#ef4444" : "rgba(255,255,255,0.15)", cursor: "pointer", position: "relative", transition: "all 0.3s" }}>
              <div style={{ position: "absolute", top: 3, left: settings.maintenance ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "all 0.3s" }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} style={{ padding: "12px 32px", borderRadius: 10, background: saved ? "#22c55e" : "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", transition: "all 0.3s" }}>
          {saved ? "✅ Saved!" : "💾 Save Settings"}
        </button>
      </div>
    </div>
  );
}

function AnnouncementsPanel() {
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("popup");
  const [sent, setSent] = useState(false);

  return (
    <div>
      <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 17, fontFamily: "Georgia,serif", marginBottom: 20 }}>📢 Announcements</h3>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "24px 20px", maxWidth: 600 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 8, fontFamily: "Segoe UI,sans-serif" }}>Announcement Type</label>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ id: "popup", label: "📣 Popup" }, { id: "email", label: "📧 Email" }, { id: "banner", label: "📌 Banner" }].map(t => (
              <button key={t.id} onClick={() => setType(t.id)} style={{ padding: "9px 16px", borderRadius: 8, background: type === t.id ? "rgba(26,111,212,0.25)" : "rgba(255,255,255,0.04)", border: `1px solid ${type === t.id ? GWC_BLUE : "rgba(255,255,255,0.08)"}`, color: type === t.id ? "#5ba3f5" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 8, fontFamily: "Segoe UI,sans-serif" }}>Message</label>
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Write your announcement here..." rows={4} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "Segoe UI,sans-serif", resize: "vertical", boxSizing: "border-box" }} />
        </div>
        <button onClick={() => { if (msg) { setSent(true); setTimeout(() => { setSent(false); setMsg(""); }, 2500); } }} disabled={!msg} style={{ padding: "12px 28px", borderRadius: 10, background: msg ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "rgba(255,255,255,0.06)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: msg ? "pointer" : "not-allowed", fontFamily: "Segoe UI,sans-serif" }}>
          {sent ? "✅ Sent to all users!" : "📤 Send Announcement"}
        </button>
      </div>
    </div>
  );
}

export default function AdminPanel() {
  const [active, setActive] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = window.innerWidth < 768;

  const panels = { dashboard: <AdminDashboard />, users: <UsersPanel />, deposits: <DepositsPanel />, withdrawals: <WithdrawalsPanel />, staking: <SettingsPanel />, settings: <SettingsPanel />, announcements: <AnnouncementsPanel /> };
  const activeLabel = ADMIN_NAV.find(n => n.id === active)?.label || "Dashboard";

  return (
    <div style={{ display: "flex", height: "100vh", background: GWC_DARK, overflow: "hidden" }}>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }} />}

      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, background: "#060a15",
        borderRight: "1px solid rgba(239,68,68,0.15)",
        padding: "20px 0", display: "flex", flexDirection: "column",
        ...(isMobile ? { position: "fixed", left: mobileOpen ? 0 : -220, top: 0, bottom: 0, zIndex: 201, transition: "left 0.3s" } : {})
      }}>
        {/* Admin Logo */}
        <div style={{ padding: "0 16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#ef4444,#dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛡️</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>GWC Admin</div>
              <div style={{ fontSize: 9, color: "#ef4444", letterSpacing: 2, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif" }}>Control Panel</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: "0 10px" }}>
          {ADMIN_NAV.map(item => (
            <button key={item.id} onClick={() => { setActive(item.id); setMobileOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: active === item.id ? "rgba(239,68,68,0.12)" : "transparent",
              color: active === item.id ? "#fff" : "rgba(255,255,255,0.4)",
              marginBottom: 3, transition: "all 0.2s",
              borderLeft: active === item.id ? "3px solid #ef4444" : "3px solid transparent"
            }}>
              <span style={{ fontSize: 17 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: active === item.id ? 700 : 500, fontFamily: "Segoe UI,sans-serif" }}>{item.label}</span>
            </button>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif", textAlign: "center" }}>Logged as Super Admin</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar */}
        <div style={{ height: 62, background: "rgba(6,10,21,0.9)", borderBottom: "1px solid rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && <button onClick={() => setMobileOpen(true)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>☰</button>}
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif" }}>
              {ADMIN_NAV.find(n => n.id === active)?.icon} {activeLabel}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "5px 12px" }}>
              <span style={{ color: "#ef4444", fontSize: 12, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>🔴 ADMIN</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "22px 20px" }}>
          {panels[active] || <AdminDashboard />}
        </div>
      </div>
    </div>
  );
}
