import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWallet,
  getMyStakes,
  getReferralStats,
  getTransactionHistory,
  updateProfile,
  changePassword,
} from "../api";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const NAV_ITEMS = [
  { icon: "🏠", label: "Dashboard", id: "dashboard" },
  { icon: "💰", label: "Staking", id: "staking" },
  { icon: "👥", label: "My Team", id: "team" },
  { icon: "📥", label: "Deposit", id: "deposit" },
  { icon: "📤", label: "Withdraw", id: "withdraw" },
  { icon: "📜", label: "Transactions", id: "transactions" },
  { icon: "⚙️", label: "Settings", id: "settings" },
  { icon: "🛡️", label: "Admin Panel", id: "admin", adminOnly: true },
];

const chartData = [
  { day: "Mon", val: 42 },
  { day: "Tue", val: 68 },
  { day: "Wed", val: 55 },
  { day: "Thu", val: 90 },
  { day: "Fri", val: 73 },
  { day: "Sat", val: 61 },
  { day: "Sun", val: 85 },
];

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}25`,
        borderRadius: 16,
        padding: "20px 18px",
        transition: "all 0.3s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}55`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}25`;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 10,
            background: `${color}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
          }}
        >
          {icon}
        </div>
        <div
          style={{
            background: `${color}15`,
            borderRadius: 20,
            padding: "3px 10px",
          }}
        >
          <span
            style={{
              color,
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            Live
          </span>
        </div>
      </div>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 900,
          color: "#fff",
          fontFamily: "Georgia,serif",
          marginBottom: 4,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.45)",
          fontFamily: "Segoe UI,sans-serif",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            color,
            fontFamily: "Segoe UI,sans-serif",
            fontWeight: 600,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

function MiniChart() {
  const max = Math.max(...chartData.map((d) => d.val));
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "22px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 15,
              fontFamily: "Georgia,serif",
            }}
          >
            Earnings This Week
          </div>
          <div
            style={{
              color: "#22c55e",
              fontSize: 13,
              fontFamily: "Segoe UI,sans-serif",
              fontWeight: 600,
            }}
          >
            ↑ Growing
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}
      >
        {chartData.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: "4px 4px 0 0",
                height: `${(d.val / max) * 68}px`,
                background:
                  i === 3
                    ? "linear-gradient(180deg,#1a6fd4,#0d4fa0)"
                    : "rgba(26,111,212,0.25)",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(180deg,#1a6fd4,#0d4fa0)")
              }
              onMouseLeave={(e) => {
                if (i !== 3)
                  e.currentTarget.style.background = "rgba(26,111,212,0.25)";
              }}
            />
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                fontFamily: "Segoe UI,sans-serif",
              }}
            >
              {d.day}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReferralLinkBox({ referralCode, referralStats }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/login?ref=${referralCode || "loading..."}`;
  const copy = () => {
    navigator.clipboard?.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,rgba(26,111,212,0.12),rgba(26,111,212,0.04))",
        border: "1px solid rgba(26,111,212,0.3)",
        borderRadius: 16,
        padding: "20px 18px",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: 15,
          fontFamily: "Georgia,serif",
          marginBottom: 4,
        }}
      >
        🔗 Your Referral Link
      </div>
      <div
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 12,
          fontFamily: "Segoe UI,sans-serif",
          marginBottom: 14,
        }}
      >
        Share & earn from 10 levels
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div
          style={{
            flex: 1,
            background: "rgba(0,0,0,0.3)",
            borderRadius: 8,
            padding: "10px 12px",
            color: "#5ba3f5",
            fontSize: 12,
            fontFamily: "monospace",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {link}
        </div>
        <button
          onClick={copy}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            background: copied ? "#22c55e" : GWC_BLUE,
            border: "none",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "Segoe UI,sans-serif",
            whiteSpace: "nowrap",
            transition: "all 0.3s",
          }}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
        {[
          {
            label: "Direct Referrals",
            val: referralStats?.directReferrals || "0",
          },
          { label: "Total Team", val: referralStats?.totalTeam || "0" },
          {
            label: "Referral Earned",
            val: `$${referralStats?.totalReferralEarned?.toFixed(2) || "0.00"}`,
          },
        ].map((s, i) => (
          <div key={i}>
            <div
              style={{
                color: "#5ba3f5",
                fontWeight: 800,
                fontSize: 15,
                fontFamily: "Georgia,serif",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 11,
                fontFamily: "Segoe UI,sans-serif",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActiveStakesList({ stakes }) {
  if (!stakes || stakes.length === 0) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16,
          padding: "20px 18px",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            fontFamily: "Georgia,serif",
            marginBottom: 16,
          }}
        >
          ⚡ Active Stakes
        </div>
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          No active stakes yet.
          <br />
          <span style={{ color: GWC_BLUE, cursor: "pointer", fontWeight: 600 }}>
            Start staking →
          </span>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            fontFamily: "Georgia,serif",
          }}
        >
          ⚡ Active Stakes
        </div>
        <span
          style={{
            background: "rgba(26,111,212,0.2)",
            color: "#5ba3f5",
            fontSize: 11,
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          {stakes.filter((s) => s.status === "active").length} Active
        </span>
      </div>
      {stakes.slice(0, 3).map((s, i) => {
        const start = new Date(s.startDate);
        const end = new Date(s.endDate);
        const now = new Date();
        const total = end - start;
        const elapsed = now - start;
        const progress = Math.min(100, Math.round((elapsed / total) * 100));
        return (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 12,
              padding: "14px",
              marginBottom: i < stakes.length - 1 ? 10 : 0,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div>
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "Georgia,serif",
                  }}
                >
                  ${s.amount.toLocaleString()}
                </span>
                <span
                  style={{
                    color: "rgba(255,255,255,0.35)",
                    fontSize: 11,
                    marginLeft: 8,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  {s.plan} Plan
                </span>
              </div>
              <span
                style={{
                  background:
                    s.status === "active"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(255,255,255,0.08)",
                  color:
                    s.status === "active" ? "#22c55e" : "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontFamily: "Segoe UI,sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {s.status}
              </span>
            </div>
            <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
              <div>
                <div
                  style={{
                    color: "#22c55e",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "Georgia,serif",
                  }}
                >
                  ${s.dailyReward?.toFixed(2)}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  Daily
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "#5ba3f5",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "Georgia,serif",
                  }}
                >
                  ${s.earnedSoFar?.toFixed(2)}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  Earned
                </div>
              </div>
              <div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontWeight: 700,
                    fontSize: 13,
                    fontFamily: "Georgia,serif",
                  }}
                >
                  {new Date(s.endDate).toLocaleDateString()}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 10,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  End Date
                </div>
              </div>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                borderRadius: 4,
                height: 5,
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "linear-gradient(90deg,#1a6fd4,#22c55e)",
                  borderRadius: 4,
                }}
              />
            </div>
            <div
              style={{
                fontSize: 10,
                color: "rgba(255,255,255,0.3)",
                marginTop: 4,
                fontFamily: "Segoe UI,sans-serif",
              }}
            >
              {progress}% complete
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RecentTransactions({ transactions }) {
  const typeIcon = {
    deposit: "📥",
    withdrawal: "📤",
    referral_bonus: "👥",
    staking_reward: "💰",
    stake: "🔒",
    unstake: "🔓",
  };
  const typeColor = {
    deposit: "#1a6fd4",
    withdrawal: "#f59e0b",
    referral_bonus: "#22c55e",
    staking_reward: "#22c55e",
    stake: "#a855f7",
    unstake: "#ef4444",
  };
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px 18px",
      }}
    >
      <div
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: 15,
          fontFamily: "Georgia,serif",
          marginBottom: 16,
        }}
      >
        📜 Recent Transactions
      </div>
      {!transactions || transactions.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "24px",
            color: "rgba(255,255,255,0.3)",
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          No transactions yet
        </div>
      ) : (
        transactions.slice(0, 5).map((tx, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${typeColor[tx.type] || "#1a6fd4"}15`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                }}
              >
                {typeIcon[tx.type] || "💰"}
              </div>
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 700,
                    fontFamily: "Segoe UI,sans-serif",
                    textTransform: "capitalize",
                  }}
                >
                  {tx.type?.replace(/_/g, " ")}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  {new Date(tx.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  color: tx.amount > 0 ? "#22c55e" : "#ef4444",
                  fontSize: 14,
                  fontWeight: 800,
                  fontFamily: "Georgia,serif",
                }}
              >
                {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  fontFamily: "Segoe UI,sans-serif",
                  textTransform: "capitalize",
                }}
              >
                {tx.status}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ── User Profile Card ─────────────────────────────────────────────────────────
function UserProfileCard({ user, wallet, stakes, referralStats, todayStats }) {
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";
  const activeStakes = stakes?.filter((s) => s.status === "active") || [];
  const todayEarning =
    todayStats?.totalEarning ??
    activeStakes.reduce((sum, s) => sum + (s.dailyReward || 0), 0);
  const todayReferral = todayStats?.referralEarning ?? 0;
  const todayStaking =
    todayStats?.stakingEarning ??
    activeStakes.reduce((sum, s) => sum + (s.dailyReward || 0), 0);

  const statRows = [
    {
      label: "Today's Total",
      value: `$${todayEarning.toFixed(2)}`,
      color: "#22c55e",
      icon: "📈",
      bg: "rgba(34,197,94,0.1)",
    },
    {
      label: "Today Staking",
      value: `$${todayStaking.toFixed(2)}`,
      color: "#0ea5e9",
      icon: "⚡",
      bg: "rgba(14,165,233,0.1)",
    },
    {
      label: "Today Referral",
      value: `$${todayReferral.toFixed(2)}`,
      color: "#f59e0b",
      icon: "👥",
      bg: "rgba(245,158,11,0.1)",
    },
    {
      label: "Total Earned",
      value: `$${(wallet?.totalEarned || 0).toFixed(2)}`,
      color: "#1a6fd4",
      icon: "💰",
      bg: "rgba(26,111,212,0.1)",
    },
    {
      label: "Total Deposited",
      value: `$${(wallet?.totalDeposited || 0).toFixed(2)}`,
      color: "#a855f7",
      icon: "📥",
      bg: "rgba(168,85,247,0.1)",
    },
    {
      label: "Withdrawable",
      value: `$${(wallet?.withdrawableBalance || 0).toFixed(2)}`,
      color: "#ef4444",
      icon: "💸",
      bg: "rgba(239,68,68,0.1)",
    },
  ];

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 20,
        marginBottom: 20,
        overflow: "hidden",
      }}
    >
      {/* Top banner */}
      <div
        style={{
          background: "linear-gradient(135deg,#0d2a5e,#1a3a7a,#0d2a5e)",
          padding: "24px 24px 60px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(26,111,212,0.15)",
            transform: "translate(30%,-30%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "30%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.08)",
            transform: "translateY(50%)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 12,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontFamily: "Segoe UI,sans-serif",
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Profile
            </div>
            <div
              style={{
                color: "#fff",
                fontWeight: 800,
                fontSize: 22,
                fontFamily: "Georgia,serif",
              }}
            >
              {user?.name || "User"}
            </div>
            <div
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 13,
                fontFamily: "Segoe UI,sans-serif",
                marginTop: 3,
              }}
            >
              {user?.email || ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(34,197,94,0.2)",
                color: "#22c55e",
                fontSize: 11,
                fontWeight: 700,
                padding: "5px 12px",
                borderRadius: 20,
                fontFamily: "Segoe UI,sans-serif",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              ✅ Active
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.7)",
                fontSize: 11,
                padding: "5px 12px",
                borderRadius: 20,
                fontFamily: "Segoe UI,sans-serif",
              }}
            >
              📅 {joinDate}
            </span>
          </div>
        </div>
      </div>

      {/* Avatar overlapping */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          padding: "0 24px",
          marginTop: -36,
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#1a6fd4,#22c55e)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "Georgia,serif",
              border: "4px solid #0a0f1e",
              flexShrink: 0,
              position: "relative",
              zIndex: 2,
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div style={{ paddingBottom: 4 }}>
            <div
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 11,
                fontFamily: "Segoe UI,sans-serif",
                marginBottom: 4,
              }}
            >
              Referral Code
            </div>
            <span
              style={{
                background: "rgba(26,111,212,0.2)",
                color: "#5ba3f5",
                fontSize: 13,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 20,
                fontFamily: "monospace",
                border: "1px solid rgba(26,111,212,0.3)",
                letterSpacing: 1,
              }}
            >
              {user?.referralCode || "GWC-XXXX"}
            </span>
          </div>
        </div>
        <div style={{ paddingBottom: 4, textAlign: "right" }}>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 11,
              fontFamily: "Segoe UI,sans-serif",
              marginBottom: 4,
            }}
          >
            Active Stakes
          </div>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 18,
              fontFamily: "Georgia,serif",
            }}
          >
            {activeStakes.length}{" "}
            <span style={{ color: "#0ea5e9", fontSize: 13 }}>stakes</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12,
          padding: "0 20px 20px",
        }}
      >
        {statRows.map((s, i) => (
          <div
            key={i}
            style={{
              background: s.bg,
              border: `1px solid ${s.color}25`,
              borderRadius: 14,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${s.color}20`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {s.icon}
            </div>
            <div>
              <div
                style={{
                  color: s.color,
                  fontWeight: 800,
                  fontSize: 15,
                  fontFamily: "Georgia,serif",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 11,
                  fontFamily: "Segoe UI,sans-serif",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage({ user, onProfileUpdate }) {
  const [activeTab, setActiveTab] = useState("profile");
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: "", text: "" }), 3000);
  };

  const handleProfileSave = async () => {
    setLoading(true);
    try {
      const res = await updateProfile(profileForm);
      const updatedUser = res.data.user;
      localStorage.setItem("gwc_user", JSON.stringify(updatedUser));
      onProfileUpdate(updatedUser);
      showMsg("success", "✅ Profile updated successfully!");
    } catch (err) {
      showMsg(
        "error",
        "❌ " + (err.response?.data?.message || "Update failed"),
      );
    }
    setLoading(false);
  };

  const handlePassChange = async () => {
    if (passForm.newPassword !== passForm.confirm)
      return showMsg("error", "❌ Passwords do not match");
    if (passForm.newPassword.length < 8)
      return showMsg("error", "❌ Password must be at least 8 characters");
    setLoading(true);
    try {
      await changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      setPassForm({ currentPassword: "", newPassword: "", confirm: "" });
      showMsg("success", "✅ Password changed successfully!");
    } catch (err) {
      showMsg(
        "error",
        "❌ " + (err.response?.data?.message || "Failed to change password"),
      );
    }
    setLoading(false);
  };

  const tabs = [
    { id: "profile", label: "👤 Profile" },
    { id: "security", label: "🔒 Security" },
    { id: "referral", label: "🔗 Referral" },
  ];

  const inputStyle = {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "0 14px",
  };

  const inputInner = {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 14,
    padding: "13px 0",
    fontFamily: "Segoe UI,sans-serif",
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 7,
    fontFamily: "Segoe UI,sans-serif",
  };

  const btnStyle = {
    width: "100%",
    padding: "13px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "Segoe UI,sans-serif",
    boxShadow: "0 4px 15px rgba(26,111,212,0.4)",
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2
        style={{
          color: "#fff",
          fontFamily: "Georgia,serif",
          fontSize: 22,
          marginBottom: 20,
        }}
      >
        ⚙️ Settings
      </h2>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: "9px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background:
                activeTab === t.id ? "#1a6fd4" : "rgba(255,255,255,0.06)",
              color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.5)",
              fontWeight: 600,
              fontSize: 13,
              fontFamily: "Segoe UI,sans-serif",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {msg.text && (
        <div
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 16,
            fontSize: 14,
            fontFamily: "Segoe UI,sans-serif",
            background:
              msg.type === "success"
                ? "rgba(34,197,94,0.15)"
                : "rgba(239,68,68,0.15)",
            border: `1px solid ${msg.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            color: msg.type === "success" ? "#22c55e" : "#ef4444",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: "28px 24px",
        }}
      >
        {/* ── Profile Tab ── */}
        {activeTab === "profile" && (
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "Segoe UI,sans-serif",
                marginBottom: 20,
              }}
            >
              Edit Profile
            </h3>

            {/* Avatar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#1a6fd4,#0a3d7a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "Georgia,serif",
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  {user?.name}
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 13,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  {user?.email}
                </div>
              </div>
            </div>

            {/* Name Field */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Full Name</label>
              <div style={inputStyle}>
                <span style={{ marginRight: 10, opacity: 0.5 }}>👤</span>
                <input
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  style={inputInner}
                />
              </div>
            </div>

            {/* Phone Field */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Phone Number</label>
              <div style={inputStyle}>
                <span style={{ marginRight: 10, opacity: 0.5 }}>📱</span>
                <input
                  value={profileForm.phone}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, phone: e.target.value })
                  }
                  placeholder="+92 300 0000000"
                  style={inputInner}
                />
              </div>
            </div>

            {/* Email readonly */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email Address</label>
              <div
                style={{
                  ...inputStyle,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <span style={{ marginRight: 10, opacity: 0.3 }}>✉️</span>
                <input
                  value={user?.email || ""}
                  readOnly
                  style={{ ...inputInner, color: "rgba(255,255,255,0.3)" }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.2)",
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  Cannot change
                </span>
              </div>
            </div>

            <button
              onClick={handleProfileSave}
              disabled={loading}
              style={btnStyle}
            >
              {loading ? "Saving..." : "💾 Save Profile"}
            </button>
          </div>
        )}

        {/* ── Security Tab ── */}
        {activeTab === "security" && (
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "Segoe UI,sans-serif",
                marginBottom: 20,
              }}
            >
              Change Password
            </h3>

            {[
              {
                label: "Current Password",
                field: "currentPassword",
                placeholder: "Enter current password",
              },
              {
                label: "New Password",
                field: "newPassword",
                placeholder: "Min 8 characters",
              },
              {
                label: "Confirm New Password",
                field: "confirm",
                placeholder: "Repeat new password",
              },
            ].map(({ label, field, placeholder }) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={labelStyle}>{label}</label>
                <div style={inputStyle}>
                  <span style={{ marginRight: 10, opacity: 0.5 }}>🔒</span>
                  <input
                    type="password"
                    value={passForm[field]}
                    onChange={(e) =>
                      setPassForm({ ...passForm, [field]: e.target.value })
                    }
                    placeholder={placeholder}
                    style={inputInner}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={handlePassChange}
              disabled={loading}
              style={btnStyle}
            >
              {loading ? "Changing..." : "🔐 Change Password"}
            </button>
          </div>
        )}

        {/* ── Referral Tab ── */}
        {activeTab === "referral" && (
          <div>
            <h3
              style={{
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "Segoe UI,sans-serif",
                marginBottom: 20,
              }}
            >
              Your Referral Info
            </h3>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Your Referral Code</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(26,111,212,0.1)",
                  border: "1px solid rgba(26,111,212,0.3)",
                  borderRadius: 10,
                  padding: "13px 14px",
                }}
              >
                <span
                  style={{
                    flex: 1,
                    color: "#5ba3f5",
                    fontWeight: 700,
                    fontSize: 16,
                    fontFamily: "Segoe UI,sans-serif",
                    letterSpacing: 2,
                  }}
                >
                  {user?.referralCode || "Loading..."}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user?.referralCode || "");
                    showMsg("success", "✅ Code copied!");
                  }}
                  style={{
                    background: "#1a6fd4",
                    border: "none",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                >
                  Copy
                </button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Your Referral Link</label>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "13px 14px",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    flex: 1,
                    color: "rgba(255,255,255,0.5)",
                    fontSize: 12,
                    fontFamily: "Segoe UI,sans-serif",
                    wordBreak: "break-all",
                  }}
                >
                  {window.location.origin}/login?ref={user?.referralCode}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/login?ref=${user?.referralCode}`,
                    );
                    showMsg("success", "✅ Link copied!");
                  }}
                  style={{
                    background: "#1a6fd4",
                    border: "none",
                    color: "#fff",
                    padding: "6px 14px",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "Segoe UI,sans-serif",
                    flexShrink: 0,
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function SidebarContent({ active, setActive, collapsed, onToggle, user }) {
  const navigate = useNavigate();

  const handleNav = (id) => {
    if (id === "staking") navigate("/staking");
    else if (id === "team") navigate("/referral");
    else if (id === "deposit") navigate("/finance");
    else if (id === "withdraw") navigate("/finance");
    else if (id === "transactions") navigate("/finance");
    else if (id === "admin") navigate("/admin");
    else setActive(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("gwc_token");
    localStorage.removeItem("gwc_user");
    navigate("/login");
  };

  return (
    <>
      <div
        style={{
          padding: "0 16px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#1a6fd4,#0a3d7a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              fontWeight: 900,
              color: "#fff",
              fontFamily: "Georgia,serif",
              flexShrink: 0,
            }}
          >
            G
          </div>
          {!collapsed && (
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#fff",
                  fontFamily: "Georgia,serif",
                }}
              >
                Global Wealth
              </div>
              <div
                style={{
                  fontSize: 8,
                  color: GWC_BLUE,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  fontFamily: "Segoe UI,sans-serif",
                }}
              >
                Community
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, padding: "0 10px" }}>
        {NAV_ITEMS.filter(
          (item) => !item.adminOnly || user?.role === "admin",
        ).map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: collapsed ? "12px" : "12px 14px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              background:
                active === item.id
                  ? "linear-gradient(135deg,rgba(26,111,212,0.25),rgba(26,111,212,0.1))"
                  : "transparent",
              color: active === item.id ? "#fff" : "rgba(255,255,255,0.4)",
              marginBottom: 4,
              transition: "all 0.2s",
              borderLeft:
                active === item.id
                  ? `3px solid ${GWC_BLUE}`
                  : "3px solid transparent",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: active === item.id ? 700 : 500,
                  fontFamily: "Segoe UI,sans-serif",
                }}
              >
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {onToggle && (
        <div
          style={{
            padding: "12px 10px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: 12,
          }}
        >
          <button
            onClick={onToggle}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>
      )}

      {!collapsed && (
        <div
          style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            marginTop: 4,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#1a6fd4,#22c55e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 900,
                color: "#fff",
                flexShrink: 0,
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: "Segoe UI,sans-serif",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {user?.name || "User"}
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontFamily: "Segoe UI,sans-serif",
                }}
              >
                {user?.referralCode || "GWC-XXXX"}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: 8,
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </>
  );
}

function Sidebar({
  active,
  setActive,
  collapsed,
  setCollapsed,
  isMobile,
  mobileOpen,
  setMobileOpen,
  user,
}) {
  const width = collapsed ? 68 : 220;
  if (isMobile) {
    if (!mobileOpen) return null;
    return (
      <>
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 200,
          }}
        />
        <div
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            width: 230,
            background: "#060a15",
            borderRight: "1px solid rgba(26,111,212,0.2)",
            zIndex: 201,
            padding: "24px 0",
            overflowY: "auto",
          }}
        >
          <SidebarContent
            active={active}
            setActive={(id) => {
              setActive(id);
              setMobileOpen(false);
            }}
            collapsed={false}
            user={user}
          />
        </div>
      </>
    );
  }
  return (
    <div
      style={{
        width,
        flexShrink: 0,
        background: "#060a15",
        borderRight: "1px solid rgba(26,111,212,0.15)",
        padding: "24px 0",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s",
        overflowX: "hidden",
      }}
    >
      <SidebarContent
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        user={user}
      />
    </div>
  );
}

function TopBar({ activeLabel, isMobile, onMenuOpen, user, onSettingsClick }) {
  return (
    <div
      style={{
        height: 64,
        background: "rgba(6,10,21,0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        backdropFilter: "blur(10px)",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isMobile && (
          <button
            onClick={onMenuOpen}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 22,
              cursor: "pointer",
              padding: 0,
            }}
          >
            ☰
          </button>
        )}
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 16,
              fontFamily: "Georgia,serif",
            }}
          >
            {activeLabel}
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 11,
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            Welcome back, {user?.name || "User"} 👋
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🔔
        </button>
        <div
          onClick={onSettingsClick}
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#1a6fd4,#22c55e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 15,
            fontWeight: 900,
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ⚙️
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile] = useState(window.innerWidth < 768);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [stakes, setStakes] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("gwc_token");
    const savedUser = localStorage.getItem("gwc_user");
    if (!token) {
      navigate("/login");
      return;
    }
    if (savedUser) setUser(JSON.parse(savedUser));

    const fetchData = async () => {
      try {
        const [walletRes, stakesRes, referralRes, txRes] = await Promise.all([
          getWallet(),
          getMyStakes(),
          getReferralStats(),
          getTransactionHistory(),
        ]);
        setWallet(walletRes.data.wallet);
        setStakes(stakesRes.data.stakes);
        setReferralStats(referralRes.data);
        setTransactions(txRes.data.transactions || []);
      } catch (err) {
        console.error("Data fetch error:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, [navigate]);

  const activeLabel =
    NAV_ITEMS.find((n) => n.id === active)?.label || "Dashboard";

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: GWC_DARK,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div
            style={{ color: "#fff", fontSize: 18, fontFamily: "Georgia,serif" }}
          >
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: GWC_DARK,
        overflow: "hidden",
      }}
    >
      <Sidebar
        active={active}
        setActive={setActive}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        user={user}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TopBar
          activeLabel={activeLabel}
          isMobile={isMobile}
          onMenuOpen={() => setMobileOpen(true)}
          user={user}
          onSettingsClick={() => setActive("settings")}
        />

        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          {/* ── Settings Page ── */}
          {active === "settings" && (
            <SettingsPage
              user={user}
              onProfileUpdate={(updatedUser) => setUser(updatedUser)}
            />
          )}

          {/* ── Dashboard Content ── */}
          {active !== "settings" && (
            <>
              {/* User Profile Card */}
              <UserProfileCard
                user={user}
                wallet={wallet}
                stakes={stakes}
                referralStats={referralStats}
              />

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <StatCard
                  icon="💼"
                  label="Main Wallet"
                  value={`$${wallet?.mainWallet?.toFixed(2) || "0.00"}`}
                  sub="Available balance"
                  color="#1a6fd4"
                />
                <StatCard
                  icon="🔒"
                  label="Total Staked"
                  value={`$${wallet?.stakingWallet?.toFixed(2) || "0.00"}`}
                  sub={`${stakes.filter((s) => s.status === "active").length} active stakes`}
                  color="#0ea5e9"
                />
                <StatCard
                  icon="📈"
                  label="Total Earned"
                  value={`$${wallet?.totalEarned?.toFixed(2) || "0.00"}`}
                  sub="All time earnings"
                  color="#22c55e"
                />
                <StatCard
                  icon="👥"
                  label="Referral Earned"
                  value={`$${wallet?.referralWallet?.toFixed(2) || "0.00"}`}
                  sub={`${referralStats?.directReferrals || 0} direct referrals`}
                  color="#f59e0b"
                />
                <StatCard
                  icon="💸"
                  label="Withdrawable"
                  value={`$${wallet?.withdrawableBalance?.toFixed(2) || "0.00"}`}
                  sub="Available to withdraw"
                  color="#a855f7"
                />
                <StatCard
                  icon="🏆"
                  label="Total Deposited"
                  value={`$${wallet?.totalDeposited?.toFixed(2) || "0.00"}`}
                  sub="All time deposits"
                  color="#ef4444"
                />
              </div>

              {/* Chart + Referral */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                  gap: 14,
                  marginBottom: 20,
                }}
              >
                <MiniChart />
                <ReferralLinkBox
                  referralCode={referralStats?.referralCode}
                  referralStats={referralStats}
                />
              </div>

              {/* Stakes + Transactions */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                  gap: 14,
                }}
              >
                <ActiveStakesList stakes={stakes} />
                <RecentTransactions transactions={transactions} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
