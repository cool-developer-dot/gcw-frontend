import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReferralStats, getTeam } from "../api";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const LEVEL_RATES = [10, 1, 0.7, 0.6, 0.5, 0.4, 0.3, 0.3, 0.2, 0.1];
const LEVEL_COLORS = [
  "#f59e0b",
  "#0ea5e9",
  "#22c55e",
  "#a855f7",
  "#ef4444",
  "#1a6fd4",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
];

export default function ReferralPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    const token = localStorage.getItem("gwc_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchAll();
  }, [navigate]);

  const fetchAll = async () => {
    try {
      const [statsRes, teamRes] = await Promise.all([
        getReferralStats(),
        getTeam(),
      ]);
      setStats(statsRes.data);
      setTeam(teamRes.data.team || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const referralLink = `${window.location.origin}/login?ref=${stats?.referralCode || ""}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
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
        <div
          style={{ color: "#fff", fontSize: 18, fontFamily: "Georgia,serif" }}
        >
          ⏳ Loading...
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: GWC_DARK,
        color: "#fff",
        fontFamily: "Segoe UI,sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "rgba(6,10,21,0.9)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: 20,
          }}
        >
          ←
        </button>
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#fff",
              fontFamily: "Georgia,serif",
            }}
          >
            👥 My Team
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            10 Level Referral System
          </div>
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: "Direct Referrals",
              val: stats?.directReferrals || 0,
              icon: "👤",
              color: "#1a6fd4",
            },
            {
              label: "Total Team",
              val: stats?.totalTeam || 0,
              icon: "👥",
              color: "#22c55e",
            },
            {
              label: "Referral Earned",
              val: `$${stats?.totalReferralEarned?.toFixed(2) || "0.00"}`,
              icon: "💰",
              color: "#f59e0b",
            },
            {
              label: "Active Members",
              val: stats?.activeMembers || 0,
              icon: "⚡",
              color: "#a855f7",
            },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${s.color}25`,
                borderRadius: 14,
                padding: "16px 14px",
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "Georgia,serif",
                }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Referral Link */}
        <div
          style={{
            background:
              "linear-gradient(135deg,rgba(26,111,212,0.15),rgba(26,111,212,0.05))",
            border: "1px solid rgba(26,111,212,0.3)",
            borderRadius: 16,
            padding: "18px",
            marginBottom: 20,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
            🔗 Your Referral Link
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              marginBottom: 12,
            }}
          >
            Share this link and earn from 10 levels!
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
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: copied ? "#22c55e" : GWC_BLUE,
                border: "none",
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.3s",
              }}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div
            style={{
              marginTop: 10,
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
            }}
          >
            Your Code:{" "}
            <span
              style={{
                color: "#5ba3f5",
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {stats?.referralCode}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 20,
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            ["overview", "📊 Level Overview"],
            ["team", "👥 Direct Team"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 9,
                background:
                  tab === id
                    ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
                    : "transparent",
                border: "none",
                color: tab === id ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: 10,
            }}
          >
            {LEVEL_RATES.map((rate, i) => {
              const levelData = stats?.levelStats?.[i] || {
                members: 0,
                earned: 0,
              };
              const color = LEVEL_COLORS[i];
              return (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: `1px solid ${color}20`,
                    borderRadius: 14,
                    padding: "16px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: `${color}20`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color,
                        fontWeight: 800,
                        fontSize: 13,
                      }}
                    >
                      L{i + 1}
                    </div>
                    <div
                      style={{
                        color,
                        fontWeight: 900,
                        fontSize: 16,
                        fontFamily: "Georgia,serif",
                      }}
                    >
                      {rate}%
                    </div>
                  </div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 18,
                      fontFamily: "Georgia,serif",
                    }}
                  >
                    {levelData.members || 0}
                  </div>
                  <div
                    style={{
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 11,
                      marginBottom: 4,
                    }}
                  >
                    Members
                  </div>
                  <div style={{ color, fontWeight: 700, fontSize: 13 }}>
                    ${(levelData.earned || 0).toFixed(2)}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>
                    Earned
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === "team" && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontWeight: 800,
                fontSize: 15,
              }}
            >
              Direct Team ({team.length} members)
            </div>
            {team.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
                <div>No team members yet. Share your referral link!</div>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                      {["Name", "Email", "Joined", "Staking", "Status"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px 16px",
                              textAlign: "left",
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 11,
                              fontWeight: 700,
                              textTransform: "uppercase",
                            }}
                          >
                            {h}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((member, i) => (
                      <tr
                        key={i}
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.04)",
                        }}
                      >
                        <td style={{ padding: "12px 16px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                            }}
                          >
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: "50%",
                                background:
                                  "linear-gradient(135deg,#1a6fd4,#22c55e)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 900,
                                fontSize: 13,
                              }}
                            >
                              {member.name?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600, fontSize: 13 }}>
                              {member.name}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 12,
                          }}
                        >
                          {member.email}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 12,
                          }}
                        >
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: "12px 16px",
                            color: "#22c55e",
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          ${member.totalStaked?.toFixed(2) || "0.00"}
                        </td>
                        <td style={{ padding: "12px 16px" }}>
                          <span
                            style={{
                              background: member.isActive
                                ? "rgba(34,197,94,0.15)"
                                : "rgba(255,255,255,0.08)",
                              color: member.isActive
                                ? "#22c55e"
                                : "rgba(255,255,255,0.4)",
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "3px 10px",
                              borderRadius: 20,
                            }}
                          >
                            {member.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
