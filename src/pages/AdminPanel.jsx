import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetStats,
  adminGetUsers,
  adminGetDeposits,
  adminApproveDeposit,
  adminRejectDeposit,
  adminGetWithdrawals,
  adminApproveWithdrawal,
  adminRejectWithdrawal,
  adminDistributeRewards,
  SERVER_ORIGIN,
} from "../api";

const GWC_DARK = "#0a0f1e";

const NAV = [
  { id: "dashboard", icon: "📊", label: "Dashboard" },
  { id: "users", icon: "👥", label: "Users" },
  { id: "deposits", icon: "📥", label: "Deposits" },
  { id: "withdrawals", icon: "📤", label: "Withdrawals" },
  { id: "staking", icon: "💰", label: "Staking" },
  { id: "settings", icon: "⚙️", label: "Settings" },
  { id: "announcements", icon: "📢", label: "Announcements" },
];

const statusColor = {
  pending: "#f59e0b",
  approved: "#22c55e",
  rejected: "#ef4444",
  active: "#22c55e",
  inactive: "#ef4444",
};

function StatCard({ icon, label, value, color = "#1a6fd4" }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}25`,
        borderRadius: 14,
        padding: "18px 16px",
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 900,
          color: "#fff",
          fontFamily: "Georgia,serif",
        }}
      >
        {value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
        {label}
      </div>
    </div>
  );
}

// ── DASHBOARD TAB ────────────────────────────────
function DashboardTab() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await adminGetStats();
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDistribute = async () => {
    if (!window.confirm("Sab active users ko daily rewards distribute karein?"))
      return;
    setDistributing(true);
    try {
      const res = await adminDistributeRewards();
      alert(`✅ Rewards distributed! ${res.data.message || ""}`);
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || "Error distributing rewards");
    }
    setDistributing(false);
  };

  if (loading)
    return (
      <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
        ⏳ Loading...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ color: "#fff", fontFamily: "Georgia,serif", margin: 0 }}>
          📊 Admin Dashboard
        </h2>
        <button
          onClick={handleDistribute}
          disabled={distributing}
          style={{
            padding: "10px 20px",
            borderRadius: 10,
            background: distributing
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg,#22c55e,#16a34a)",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          {distributing ? "Distributing..." : "🎁 Distribute Daily Rewards"}
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats?.totalUsers || 0}
          color="#1a6fd4"
        />
        <StatCard
          icon="✅"
          label="Active Users"
          value={stats?.activeUsers || 0}
          color="#22c55e"
        />
        <StatCard
          icon="📥"
          label="Total Deposits"
          value={`$${stats?.totalDeposits?.toFixed(2) || "0.00"}`}
          color="#0ea5e9"
        />
        <StatCard
          icon="📤"
          label="Total Withdrawals"
          value={`$${stats?.totalWithdrawals?.toFixed(2) || "0.00"}`}
          color="#f59e0b"
        />
        <StatCard
          icon="💰"
          label="Total Staked"
          value={`$${stats?.totalStaked?.toFixed(2) || "0.00"}`}
          color="#a855f7"
        />
        <StatCard
          icon="⏳"
          label="Pending Deposits"
          value={stats?.pendingDeposits || 0}
          color="#ef4444"
        />
        <StatCard
          icon="⏳"
          label="Pending Withdrawals"
          value={stats?.pendingWithdrawals || 0}
          color="#f97316"
        />
      </div>
    </div>
  );
}

// ── USERS TAB ────────────────────────────────────
function UsersTab() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminGetUsers();
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading)
    return (
      <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
        ⏳ Loading...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#fff", fontFamily: "Georgia,serif", margin: 0 }}>
          👥 Users ({users.length})
        </h2>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          style={{
            padding: "9px 14px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            color: "#fff",
            fontSize: 13,
            outline: "none",
            width: 220,
          }}
        />
      </div>
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.07)",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
              {[
                "Name",
                "Email",
                "Phone",
                "Wallet",
                "Staked",
                "Referral Code",
                "Joined",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px 14px",
                    textAlign: "left",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((u, i) => (
                <tr
                  key={i}
                  style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                  <td style={{ padding: "12px 14px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg,#1a6fd4,#22c55e)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 900,
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <span
                        style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}
                      >
                        {u.name}
                      </span>
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                    }}
                  >
                    {u.email}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 12,
                    }}
                  >
                    {u.phone || "-"}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "#22c55e",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    ${u.wallet?.mainWallet?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "#5ba3f5",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    ${u.wallet?.stakingWallet?.toFixed(2) || "0.00"}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "#f59e0b",
                      fontSize: 12,
                      fontFamily: "monospace",
                    }}
                  >
                    {u.referralCode}
                  </td>
                  <td
                    style={{
                      padding: "12px 14px",
                      color: "rgba(255,255,255,0.4)",
                      fontSize: 12,
                    }}
                  >
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "12px 14px" }}>
                    <span
                      style={{
                        background: u.isActive
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(239,68,68,0.15)",
                        color: u.isActive ? "#22c55e" : "#ef4444",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                      }}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── DEPOSITS TAB ─────────────────────────────────
function DepositsTab() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

  useEffect(() => { fetchDeposits(); }, []);

  const fetchDeposits = async () => {
    try {
      const res = await adminGetDeposits();
      setDeposits(res.data.deposits || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Is deposit ko approve karein?")) return;
    setActionLoading(id);
    try {
      await adminApproveDeposit(id);
      fetchDeposits();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    if (!window.confirm("Is deposit ko reject karein?")) return;
    setActionLoading(id);
    try {
      await adminRejectDeposit(id);
      fetchDeposits();
    } catch (err) { console.error(err); }
    setActionLoading(null);
  };

  // screenshot URL — Cloudinary ya local dono handle karo
  const getImgUrl = (d) => {
    if (!d.screenshot) return null;
    if (d.screenshot.startsWith("http")) return d.screenshot;
    return `${SERVER_ORIGIN}${d.screenshot}`;
  };

  const filtered = filter === "all" ? deposits : deposits.filter((d) => d.status === filter);

  if (loading) return <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>⏳ Loading...</div>;

  return (
    <div>
      {/* ── Full Image Modal ── */}
      {previewImg && (
        <div
          onClick={() => setPreviewImg(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20, cursor: "zoom-out",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={previewImg}
              alt="Screenshot"
              style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: 12, objectFit: "contain", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setPreviewImg(null)}
              style={{
                position: "absolute", top: -16, right: -16,
                width: 36, height: 36, borderRadius: "50%",
                background: "#ef4444", border: "none", color: "#fff",
                fontSize: 18, cursor: "pointer", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
              }}
            >✕</button>
            <div style={{ textAlign: "center", marginTop: 10, color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              Click outside to close
            </div>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ color: "#fff", fontFamily: "Georgia,serif", margin: 0 }}>📥 Deposits ({deposits.length})</h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "7px 14px", borderRadius: 20,
              background: filter === f ? "#1a6fd4" : "rgba(255,255,255,0.05)",
              border: "none", color: "#fff", cursor: "pointer",
              fontSize: 12, fontWeight: 600, textTransform: "capitalize",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.3)" }}>No {filter} deposits</div>
      ) : (
        filtered.map((d, i) => {
          const imgUrl = getImgUrl(d);
          return (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "16px 18px", marginBottom: 10,
              display: "flex", justifyContent: "space-between",
              alignItems: "center", flexWrap: "wrap", gap: 12,
            }}>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>

                {/* Screenshot thumbnail */}
                {imgUrl ? (
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img
                      src={imgUrl}
                      alt="proof"
                      style={{
                        width: 64, height: 64, borderRadius: 10, objectFit: "cover",
                        border: "2px solid rgba(26,111,212,0.4)", cursor: "pointer",
                        transition: "transform 0.2s",
                      }}
                      onClick={() => setPreviewImg(imgUrl)}
                      onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                      onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                    />
                    <button
                      onClick={() => setPreviewImg(imgUrl)}
                      style={{
                        position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
                        background: "#1a6fd4", border: "none", color: "#fff",
                        fontSize: 9, fontWeight: 700, padding: "2px 8px",
                        borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap",
                      }}
                    >🔍 Full View</button>
                  </div>
                ) : (
                  <div style={{
                    width: 64, height: 64, borderRadius: 10, flexShrink: 0,
                    background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(255,255,255,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "rgba(255,255,255,0.2)", fontSize: 22,
                  }}>📷</div>
                )}

                {/* Info */}
                <div>
                  <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 18, fontFamily: "Georgia,serif" }}>${d.amount}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Amount</div>
                </div>
                <div>
                  <div style={{ color: "#fff", fontWeight: 700 }}>{d.user?.name || "Unknown"}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{d.user?.email}</div>
                </div>
                <div>
                  <div style={{ color: "#5ba3f5" }}>{d.network}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Network</div>
                </div>
                <div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>{new Date(d.createdAt).toLocaleString()}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>Date</div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {d.status === "pending" ? (
                  <>
                    <button onClick={() => handleApprove(d._id)} disabled={actionLoading === d._id} style={{
                      padding: "8px 18px", borderRadius: 8,
                      background: "linear-gradient(135deg,#22c55e,#16a34a)",
                      border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13,
                    }}>
                      {actionLoading === d._id ? "..." : "✅ Approve"}
                    </button>
                    <button onClick={() => handleReject(d._id)} disabled={actionLoading === d._id} style={{
                      padding: "8px 18px", borderRadius: 8,
                      background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
                      color: "#ef4444", fontWeight: 700, cursor: "pointer", fontSize: 13,
                    }}>
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <span style={{
                    background: `${statusColor[d.status]}20`, color: statusColor[d.status],
                    fontSize: 12, fontWeight: 700, padding: "6px 14px",
                    borderRadius: 20, textTransform: "capitalize",
                  }}>{d.status}</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ── WITHDRAWALS TAB ──────────────────────────────
function WithdrawalsTab() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await adminGetWithdrawals();
      setWithdrawals(res.data.withdrawals || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Is withdrawal ko approve karein?")) return;
    setActionLoading(id);
    try {
      await adminApproveWithdrawal(id);
      alert("✅ Withdrawal approved!");
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
    setActionLoading(null);
  };

  const handleReject = async (id) => {
    if (!window.confirm("Is withdrawal ko reject karein?")) return;
    setActionLoading(id);
    try {
      await adminRejectWithdrawal(id);
      alert("❌ Withdrawal rejected. Amount wapas ho gaya.");
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
    setActionLoading(null);
  };

  const filtered =
    filter === "all"
      ? withdrawals
      : withdrawals.filter((w) => w.status === filter);

  if (loading)
    return (
      <div style={{ color: "#fff", textAlign: "center", padding: 40 }}>
        ⏳ Loading...
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={{ color: "#fff", fontFamily: "Georgia,serif", margin: 0 }}>
          📤 Withdrawals ({withdrawals.length})
        </h2>
        <div style={{ display: "flex", gap: 8 }}>
          {["pending", "approved", "rejected", "all"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                background: filter === f ? "#1a6fd4" : "rgba(255,255,255,0.05)",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 40,
            color: "rgba(255,255,255,0.3)",
          }}
        >
          No {filter} withdrawals
        </div>
      ) : (
        filtered.map((w, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding: "16px 18px",
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div>
                <div
                  style={{
                    color: "#f59e0b",
                    fontWeight: 900,
                    fontSize: 18,
                    fontFamily: "Georgia,serif",
                  }}
                >
                  ${w.amount}
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  Amount
                </div>
              </div>
              <div>
                <div style={{ color: "#fff", fontWeight: 700 }}>
                  {w.user?.name || "Unknown"}
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  {w.user?.email}
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#5ba3f5",
                    fontSize: 12,
                    fontFamily: "monospace",
                    maxWidth: 140,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {w.walletAddress}
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  {w.network} Address
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                  {new Date(w.createdAt).toLocaleString()}
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                  Date
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {w.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleApprove(w._id)}
                    disabled={actionLoading === w._id}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      background: "linear-gradient(135deg,#22c55e,#16a34a)",
                      border: "none",
                      color: "#fff",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    {actionLoading === w._id ? "..." : "✅ Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(w._id)}
                    disabled={actionLoading === w._id}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      background: "rgba(239,68,68,0.15)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#ef4444",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: 13,
                    }}
                  >
                    ❌ Reject
                  </button>
                </>
              ) : (
                <span
                  style={{
                    background: `${statusColor[w.status]}20`,
                    color: statusColor[w.status],
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "6px 14px",
                    borderRadius: 20,
                    textTransform: "capitalize",
                  }}
                >
                  {w.status}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── MAIN ADMIN PANEL ─────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("gwc_user") || "{}");
    if (!user?.isAdmin) {
      // Allow access for testing - in production uncomment below
      // navigate('/dashboard');
    }
  }, []);

  const renderTab = () => {
    switch (active) {
      case "dashboard":
        return <DashboardTab />;
      case "users":
        return <UsersTab />;
      case "deposits":
        return <DepositsTab />;
      case "withdrawals":
        return <WithdrawalsTab />;
      case "staking":
        return (
          <div
            style={{ color: "#fff", padding: 20, fontFamily: "Georgia,serif" }}
          >
            ⚡ Staking management coming soon...
          </div>
        );
      case "settings":
        return (
          <div
            style={{ color: "#fff", padding: 20, fontFamily: "Georgia,serif" }}
          >
            ⚙️ Settings coming soon...
          </div>
        );
      case "announcements":
        return (
          <div
            style={{ color: "#fff", padding: 20, fontFamily: "Georgia,serif" }}
          >
            📢 Announcements coming soon...
          </div>
        );
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: GWC_DARK,
        color: "#fff",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          background: "#060a15",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "24px 0",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "0 20px 24px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            marginBottom: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg,#ef4444,#dc2626)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              🛡️
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "Georgia,serif",
                }}
              >
                GWC Admin
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#ef4444",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Control Panel
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div style={{ flex: 1, padding: "0 10px" }}>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 4,
                background:
                  active === item.id ? "rgba(239,68,68,0.15)" : "transparent",
                color: active === item.id ? "#fff" : "rgba(255,255,255,0.4)",
                borderLeft:
                  active === item.id
                    ? "3px solid #ef4444"
                    : "3px solid transparent",
                fontFamily: "Segoe UI,sans-serif",
                fontSize: 14,
                fontWeight: active === item.id ? 700 : 400,
                textAlign: "left",
                transition: "all 0.2s",
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              width: "100%",
              padding: "9px",
              borderRadius: 8,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            ← User Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            height: 60,
            background: "rgba(6,10,21,0.9)",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              fontFamily: "Georgia,serif",
            }}
          >
            {NAV.find((n) => n.id === active)?.icon}{" "}
            {NAV.find((n) => n.id === active)?.label}
          </div>
          <div
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
              padding: "6px 14px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            🔴 ADMIN
          </div>
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {renderTab()}
        </div>
      </div>
    </div>
  );
}