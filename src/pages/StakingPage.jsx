import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createStake, getMyStakes, getWallet } from "../api";

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{
          background: t.type === "success" ? "rgba(22,101,52,0.95)" : t.type === "error" ? "rgba(127,29,29,0.95)" : "rgba(30,41,59,0.95)",
          color: t.type === "success" ? "#22c55e" : t.type === "error" ? "#ef4444" : "#fff",
          border: `1px solid ${t.type === "success" ? "#166534" : t.type === "error" ? "#7f1d1d" : "#334155"}`,
          padding: "12px 20px", borderRadius: 12,
          fontSize: 14, fontWeight: 600, fontFamily: "Segoe UI,sans-serif",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          minWidth: 260,
        }}>{t.msg}</div>
      ))}
    </div>
  );
}

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const PLAN_COLORS = {
  Starter: "#22c55e",
  Silver: "#0ea5e9",
  Gold: "#f59e0b",
  Platinum: "#a855f7",
};

export default function StakingPage() {
  const navigate = useNavigate();
  const [myStakes, setMyStakes] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [dailyRate, setDailyRate] = useState(1.5);
  const [duration, setDuration] = useState(30);
  const [tab, setTab] = useState("plans");
  const [toasts, setToasts] = useState([]);

  const showToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

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
      const [stakesRes, walletRes] = await Promise.all([
        getMyStakes(),
        getWallet(),
      ]);
      setMyStakes(stakesRes.data.stakes || []);
      setWallet(walletRes.data.wallet);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleStake = async () => {
    const amt = parseFloat(amount);

    if (!amt || amt <= 0) {
      showToast("⚠️ Please enter an amount!", "error");
      return;
    }
    if (amt < 10) {
      showToast("⚠️ Minimum staking amount is $10!", "error");
      return;
    }
    if (wallet && amt > wallet.mainWallet) {
      showToast("❌ Insufficient wallet balance!", "error");
      return;
    }
    if (!dailyRate || dailyRate <= 0) {
      showToast("⚠️ Please enter a valid daily rate!", "error");
      return;
    }
    if (duration < 1 || duration > 365) {
      showToast("⚠️ Duration must be between 1 and 365 days!", "error");
      return;
    }

    // Find matching plan based on amount
    const planName = amt < 500 ? "Starter" : amt < 2000 ? "Silver" : amt < 5000 ? "Gold" : "Platinum";

    setStakeLoading(true);
    try {
      await createStake({ plan: planName, amount: amt });
      showToast("✅ Staking successful! Redirecting to your stakes...", "success");
      setAmount("");
      setDailyRate(1.5);
      setDuration(30);
      setTimeout(() => setTab("mystakes"), 1500);
      fetchAll();
    } catch (err) {
      showToast("❌ " + (err.response?.data?.message || "Staking failed. Please try again."), "error");
    }
    setStakeLoading(false);
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
      <Toast toasts={toasts} />
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
            💰 Staking
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Wallet: ${wallet?.mainWallet?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 24,
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            ["plans", "📊 Stake Now"],
            ["mystakes", "⚡ My Stakes"],
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
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Segoe UI,sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "plans" && (() => {
          const amt = parseFloat(amount || 0);
          const daily = (amt * dailyRate) / 100;
          const total = daily * duration;

          return (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                background: "#0d1f3c",
                borderRadius: 16,
                padding: "1.5rem",
                width: "100%",
                maxWidth: 680,
                border: "1px solid #1e3a5f",
              }}>
                {/* Title + Balance */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Stake Now</div>
                  <div style={{ fontSize: 13, color: "#7fa8cc" }}>
                    Balance: <span style={{ color: "#00c8ff", fontWeight: 700 }}>${wallet?.mainWallet?.toFixed(2) || "0.00"}</span>
                  </div>
                </div>

                {/* Amount Input */}
                <div style={{ fontSize: 13, color: "#7fa8cc", marginBottom: 6 }}>Amount (USDT)</div>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount..."
                  style={{
                    width: "100%", padding: "12px 16px",
                    background: "#0a1628", border: "1px solid #1e3a5f",
                    borderRadius: 10, color: "#fff", fontSize: 15,
                    outline: "none", boxSizing: "border-box",
                    fontFamily: "Segoe UI,sans-serif", marginBottom: 14,
                    transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.target.style.borderColor = "#00c8ff"}
                  onBlur={e => e.target.style.borderColor = "#1e3a5f"}
                />

                {/* Daily Rate + Duration Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ fontSize: 13, color: "#7fa8cc", marginBottom: 6 }}>Daily Rate (%)</div>
                    <input
                      type="number"
                      value={dailyRate}
                      onChange={e => setDailyRate(parseFloat(e.target.value) || 0)}
                      step="0.1" min="0.1" max="10"
                      style={{
                        width: "100%", padding: "12px 16px",
                        background: "#0a1628", border: "1px solid #1e3a5f",
                        borderRadius: 10, color: "#00c8ff", fontSize: 15, fontWeight: 700,
                        outline: "none", boxSizing: "border-box", fontFamily: "Segoe UI,sans-serif",
                      }}
                      onFocus={e => e.target.style.borderColor = "#00c8ff"}
                      onBlur={e => e.target.style.borderColor = "#1e3a5f"}
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: "#7fa8cc", marginBottom: 6 }}>Duration (Days)</div>
                    <input
                      type="number"
                      value={duration}
                      onChange={e => setDuration(parseInt(e.target.value) || 0)}
                      min="1" max="365"
                      style={{
                        width: "100%", padding: "12px 16px",
                        background: "#0a1628", border: "1px solid #1e3a5f",
                        borderRadius: 10, color: "#00c8ff", fontSize: 15, fontWeight: 700,
                        outline: "none", boxSizing: "border-box", fontFamily: "Segoe UI,sans-serif",
                      }}
                      onFocus={e => e.target.style.borderColor = "#00c8ff"}
                      onBlur={e => e.target.style.borderColor = "#1e3a5f"}
                    />
                  </div>
                </div>

                {/* Earnings Info Box */}
                <div style={{
                  background: "#0a1628", borderRadius: 10,
                  padding: "14px 16px", marginBottom: 14,
                  border: "1px solid #1e3a5f",
                }}>
                  <div style={{ fontSize: 12, color: "#7fa8cc", marginBottom: 4 }}>Daily Earnings:</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#00c8ff" }}>
                    {amt > 0 ? `$${daily.toFixed(2)}/day` : "$0.00/day"}
                  </div>
                  <div style={{ fontSize: 13, color: "#7fa8cc", marginTop: 4 }}>
                    {amt > 0
                      ? `Total: $${total.toFixed(2)} in ${duration} days`
                      : "Enter amount to see earnings"}
                  </div>
                </div>

                {/* Balance Warning */}
                {amt > (wallet?.mainWallet || 0) && amt > 0 && (
                  <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#ef4444", fontSize: 13 }}>
                    ⚠️ Insufficient balance! Pehle deposit karo.
                  </div>
                )}

                {/* Stake Button */}
                <button
                  onClick={handleStake}
                  disabled={stakeLoading}
                  style={{
                    width: "100%", padding: 14,
                    background: "linear-gradient(90deg,#00a8e8,#00c8ff)",
                    border: "none", borderRadius: 10,
                    color: "#fff", fontSize: 15, fontWeight: 700,
                    cursor: "pointer", transition: "opacity 0.2s",
                    fontFamily: "Segoe UI,sans-serif",
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >
                  {stakeLoading ? "⏳ Processing..." : "🚀 Stake Now"}
                </button>
              </div>
            </div>
          );
        })()}

                {tab === "mystakes" && (
          <div>
            {myStakes.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
                <div style={{ fontSize: 16, fontFamily: "Georgia,serif" }}>
                  No active stakes yet
                </div>
                <button
                  onClick={() => setTab("plans")}
                  style={{
                    marginTop: 16,
                    padding: "10px 24px",
                    borderRadius: 10,
                    background: GWC_BLUE,
                    border: "none",
                    color: "#fff",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  Start Staking
                </button>
              </div>
            ) : (
              myStakes.map((s, i) => {
                const start = new Date(s.startDate);
                const end = new Date(s.endDate);
                const now = new Date();
                const progress = Math.min(
                  100,
                  Math.round(((now - start) / (end - start)) * 100),
                );
                const color = PLAN_COLORS[s.plan] || GWC_BLUE;
                return (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: `1px solid ${color}25`,
                      borderRadius: 16,
                      padding: "18px",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <span
                          style={{
                            color: "#fff",
                            fontWeight: 800,
                            fontSize: 16,
                            fontFamily: "Georgia,serif",
                          }}
                        >
                          ${s.amount.toLocaleString()}
                        </span>
                        <span
                          style={{
                            color: "rgba(255,255,255,0.4)",
                            fontSize: 12,
                            marginLeft: 8,
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
                          color: s.status === "active" ? "#22c55e" : "#fff",
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "4px 12px",
                          borderRadius: 20,
                          textTransform: "capitalize",
                        }}
                      >
                        {s.status}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color: "#22c55e",
                            fontWeight: 800,
                            fontFamily: "Georgia,serif",
                          }}
                        >
                          ${s.dailyReward?.toFixed(2)}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          Daily
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: "#5ba3f5",
                            fontWeight: 800,
                            fontFamily: "Georgia,serif",
                          }}
                        >
                          ${s.earnedSoFar?.toFixed(2)}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
                          }}
                        >
                          Earned
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.7)",
                            fontWeight: 800,
                            fontFamily: "Georgia,serif",
                          }}
                        >
                          {new Date(s.endDate).toLocaleDateString()}
                        </div>
                        <div
                          style={{
                            color: "rgba(255,255,255,0.3)",
                            fontSize: 11,
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
                        height: 6,
                      }}
                    >
                      <div
                        style={{
                          width: `${progress}%`,
                          height: "100%",
                          background: `linear-gradient(90deg,${color},#22c55e)`,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "rgba(255,255,255,0.3)",
                        marginTop: 4,
                      }}
                    >
                      {progress}% complete
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}