import { useState } from "react";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const PLANS = [
  { id: 1, name: "Starter", min: 50, max: 499, daily: 1.5, duration: 30, color: "#0ea5e9", icon: "🌱", badge: "Beginner" },
  { id: 2, name: "Silver", min: 500, max: 1999, daily: 2.0, duration: 45, color: "#a3a3a3", icon: "🥈", badge: "Popular" },
  { id: 3, name: "Gold", min: 2000, max: 4999, daily: 2.5, duration: 60, color: "#f59e0b", icon: "🥇", badge: "Best Value" },
  { id: 4, name: "Platinum", min: 5000, max: 99999, daily: 3.0, duration: 80, color: "#a855f7", icon: "💎", badge: "Premium" },
];

const ACTIVE_STAKES = [
  { id: "STK001", plan: "Gold", amount: 500, daily: 5.00, earned: 45.00, startDate: "Dec 01, 2024", endDate: "Jan 30, 2025", progress: 60, status: "Active" },
  { id: "STK002", plan: "Starter", amount: 200, daily: 2.00, earned: 12.00, startDate: "Dec 15, 2024", endDate: "Feb 14, 2025", progress: 25, status: "Active" },
  { id: "STK003", plan: "Silver", amount: 1000, daily: 0, earned: 90.00, startDate: "Nov 01, 2024", endDate: "Dec 16, 2024", progress: 100, status: "Completed" },
];

function StakingPlans({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "Georgia,serif", marginBottom: 6 }}>💼 Choose a Staking Plan</h3>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>Select a plan that fits your investment goal</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 24 }}>
        {PLANS.map(plan => (
          <div key={plan.id}
            onClick={() => { setSelected(plan.id); onSelect(plan); }}
            style={{
              background: selected === plan.id ? `${plan.color}15` : "rgba(255,255,255,0.03)",
              border: `2px solid ${selected === plan.id ? plan.color : "rgba(255,255,255,0.07)"}`,
              borderRadius: 18, padding: "24px 20px", cursor: "pointer",
              transition: "all 0.3s", position: "relative", overflow: "hidden"
            }}
            onMouseEnter={e => { if (selected !== plan.id) { e.currentTarget.style.borderColor = `${plan.color}60`; e.currentTarget.style.transform = "translateY(-3px)"; } }}
            onMouseLeave={e => { if (selected !== plan.id) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; } }}
          >
            {/* Badge */}
            <div style={{ position: "absolute", top: 14, right: 14, background: `${plan.color}25`, color: plan.color, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "Segoe UI,sans-serif" }}>{plan.badge}</div>

            <div style={{ fontSize: 36, marginBottom: 12 }}>{plan.icon}</div>
            <div style={{ color: "#fff", fontSize: 20, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 4 }}>{plan.name}</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", marginBottom: 16 }}>
              ${plan.min.toLocaleString()} — ${plan.max.toLocaleString()}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <div style={{ color: plan.color, fontSize: 22, fontWeight: 900, fontFamily: "Georgia,serif" }}>{plan.daily}%</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Daily ROI</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: "#fff", fontSize: 18, fontWeight: 800, fontFamily: "Georgia,serif" }}>{plan.duration}d</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Duration</div>
              </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "8px 12px" }}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>
                Total Return: <span style={{ color: plan.color, fontWeight: 700 }}>{(plan.daily * plan.duration).toFixed(0)}%</span>
              </div>
            </div>

            {selected === plan.id && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg,${plan.color},${plan.color}80)` }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StakeForm({ plan, onClose }) {
  const [amount, setAmount] = useState("");
  const [compound, setCompound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const numAmount = parseFloat(amount) || 0;
  const totalReturn = plan ? (numAmount * plan.daily / 100 * plan.duration) : 0;
  const dailyEarning = plan ? (numAmount * plan.daily / 100) : 0;

  const handleStake = () => {
    if (!plan || numAmount < plan.min) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1500);
  };

  if (success) {
    return (
      <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 18, padding: "32px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h3 style={{ color: "#22c55e", fontSize: 20, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 8 }}>Stake Successful!</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "Segoe UI,sans-serif", marginBottom: 8 }}>
          <strong style={{ color: "#fff" }}>${numAmount.toLocaleString()}</strong> staked on <strong style={{ color: "#fff" }}>{plan?.name}</strong> plan
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif", marginBottom: 24 }}>
          You will earn <strong style={{ color: "#22c55e" }}>${dailyEarning.toFixed(2)}/day</strong> for {plan?.duration} days
        </p>
        <button onClick={() => { setSuccess(false); setAmount(""); onClose?.(); }} style={{ padding: "12px 32px", borderRadius: 10, background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
          View Active Stakes →
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px 20px" }}>
      <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 17, fontFamily: "Georgia,serif", marginBottom: 20 }}>
        {plan ? `Stake on ${plan.name} Plan ${plan.icon}` : "Select a plan above first"}
      </h3>

      {plan && (
        <>
          {/* Amount Input */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 8, fontFamily: "Segoe UI,sans-serif" }}>
              Stake Amount (USDT)
            </label>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0 14px", overflow: "hidden" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 16, marginRight: 8 }}>$</span>
              <input
                type="number"
                placeholder={`Min $${plan.min}`}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 16, padding: "13px 0", fontFamily: "Segoe UI,sans-serif", fontWeight: 700 }}
              />
              <button onClick={() => setAmount(String(plan.max))} style={{ background: "rgba(26,111,212,0.2)", border: "none", color: GWC_BLUE, fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>MAX</button>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, fontFamily: "Segoe UI,sans-serif" }}>
              Range: ${plan.min.toLocaleString()} — ${plan.max.toLocaleString()}
            </div>
          </div>

          {/* Quick amounts */}
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
            {[plan.min, plan.min * 2, plan.min * 5, plan.min * 10].map(v => (
              <button key={v} onClick={() => setAmount(String(v))} style={{
                padding: "7px 14px", borderRadius: 8,
                background: amount == v ? "rgba(26,111,212,0.3)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${amount == v ? GWC_BLUE : "rgba(255,255,255,0.08)"}`,
                color: amount == v ? "#5ba3f5" : "rgba(255,255,255,0.5)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif"
              }}>${v.toLocaleString()}</button>
            ))}
          </div>

          {/* Compound Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 16px", marginBottom: 18, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>🔄 Compounding</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>Auto reinvest daily rewards</div>
            </div>
            <div onClick={() => setCompound(!compound)} style={{
              width: 44, height: 24, borderRadius: 12,
              background: compound ? GWC_BLUE : "rgba(255,255,255,0.15)",
              cursor: "pointer", position: "relative", transition: "all 0.3s"
            }}>
              <div style={{ position: "absolute", top: 3, left: compound ? 22 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "all 0.3s" }} />
            </div>
          </div>

          {/* Calculation Preview */}
          {numAmount >= plan.min && (
            <div style={{ background: "rgba(26,111,212,0.08)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
              <div style={{ color: "#5ba3f5", fontSize: 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", marginBottom: 12 }}>📊 Estimated Returns</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                {[
                  { label: "Daily", val: `$${dailyEarning.toFixed(2)}` },
                  { label: `${plan.duration} Days`, val: `$${totalReturn.toFixed(2)}` },
                  { label: "Total ROI", val: `${(plan.daily * plan.duration).toFixed(0)}%` },
                ].map((s, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ color: "#22c55e", fontWeight: 900, fontSize: 15, fontFamily: "Georgia,serif" }}>{s.val}</div>
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stake Button */}
          <button onClick={handleStake} disabled={numAmount < plan.min || loading} style={{
            width: "100%", padding: "14px", borderRadius: 10,
            background: numAmount >= plan.min ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "rgba(255,255,255,0.06)",
            border: "none", color: numAmount >= plan.min ? "#fff" : "rgba(255,255,255,0.3)",
            fontSize: 15, fontWeight: 700, cursor: numAmount >= plan.min ? "pointer" : "not-allowed",
            fontFamily: "Segoe UI,sans-serif",
            boxShadow: numAmount >= plan.min ? "0 6px 20px rgba(26,111,212,0.4)" : "none",
            transition: "all 0.3s"
          }}>
            {loading ? "Processing..." : numAmount < plan.min ? `Minimum $${plan.min}` : `🔒 Stake $${numAmount.toLocaleString()} Now`}
          </button>
        </>
      )}

      {!plan && (
        <div style={{ textAlign: "center", padding: "32px 0", color: "rgba(255,255,255,0.3)", fontFamily: "Segoe UI,sans-serif", fontSize: 14 }}>
          👆 Select a plan from above to continue
        </div>
      )}
    </div>
  );
}

function ActiveStakesList() {
  const [cancelId, setCancelId] = useState(null);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 18, fontFamily: "Georgia,serif", marginBottom: 6 }}>⚡ My Active Stakes</h3>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>Track all your running and completed stakes</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {ACTIVE_STAKES.map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.03)", border: `1px solid ${s.status === "Active" ? "rgba(26,111,212,0.2)" : "rgba(255,255,255,0.06)"}`,
            borderRadius: 16, padding: "20px", transition: "all 0.3s"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 900, fontFamily: "Georgia,serif" }}>${s.amount.toLocaleString()}</div>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{s.plan} Plan</span>
                  <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>#{s.id}</span>
                </div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 4, fontFamily: "Segoe UI,sans-serif" }}>
                  {s.startDate} → {s.endDate}
                </div>
              </div>
              <span style={{
                padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: "Segoe UI,sans-serif",
                background: s.status === "Active" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.08)",
                color: s.status === "Active" ? "#22c55e" : "rgba(255,255,255,0.4)"
              }}>{s.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Daily Reward", val: s.status === "Active" ? `$${s.daily.toFixed(2)}` : "—", color: "#22c55e" },
                { label: "Total Earned", val: `$${s.earned.toFixed(2)}`, color: "#5ba3f5" },
                { label: "Progress", val: `${s.progress}%`, color: "#f59e0b" },
              ].map((stat, j) => (
                <div key={j} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px", textAlign: "center" }}>
                  <div style={{ color: stat.color, fontWeight: 900, fontSize: 16, fontFamily: "Georgia,serif" }}>{stat.val}</div>
                  <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif", marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: s.status === "Active" ? 14 : 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>Progress</span>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, fontFamily: "Segoe UI,sans-serif" }}>{s.progress}%</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 6, height: 8 }}>
                <div style={{ width: `${s.progress}%`, height: "100%", background: s.progress === 100 ? "#22c55e" : "linear-gradient(90deg,#1a6fd4,#22c55e)", borderRadius: 6, transition: "width 1s ease" }} />
              </div>
            </div>

            {/* Early unstake */}
            {s.status === "Active" && (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setCancelId(cancelId === s.id ? null : s.id)}
                  style={{ padding: "7px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
                  Early Unstake
                </button>
              </div>
            )}

            {cancelId === s.id && (
              <div style={{ marginTop: 12, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "12px 16px" }}>
                <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", marginBottom: 8 }}>⚠️ Early Unstake Warning</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", marginBottom: 12 }}>
                  A 10% penalty will be applied on early unstake. You will receive <strong style={{ color: "#fff" }}>${(s.amount * 0.9).toFixed(2)}</strong>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setCancelId(null)} style={{ flex: 1, padding: "8px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>Cancel</button>
                  <button style={{ flex: 1, padding: "8px", borderRadius: 8, background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)", color: "#ef4444", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>Confirm Unstake</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StakingPage() {
  const [tab, setTab] = useState("plans");
  const [selectedPlan, setSelectedPlan] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: GWC_DARK, padding: "20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>💰 Staking Module</h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "Segoe UI,sans-serif" }}>Stake your USDT and earn daily passive rewards</p>
        </div>

        {/* Summary */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { icon: "🔒", label: "Total Staked", val: "$700.00", color: "#1a6fd4" },
            { icon: "📈", label: "Daily Earning", val: "$7.00", color: "#22c55e" },
            { icon: "💸", label: "Total Earned", val: "$147.00", color: "#f59e0b" },
            { icon: "⚡", label: "Active Stakes", val: "2", color: "#a855f7" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}25`, borderRadius: 14, padding: "16px 14px" }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ color: s.color, fontWeight: 900, fontSize: 20, fontFamily: "Georgia,serif" }}>{s.val}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 28, border: "1px solid rgba(255,255,255,0.06)", width: "fit-content", gap: 4 }}>
          {[
            { id: "plans", label: "📋 Stake Now" },
            { id: "active", label: "⚡ My Stakes" },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 22px", borderRadius: 9,
              background: tab === t.id ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "transparent",
              border: "none", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.4)",
              fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif",
              transition: "all 0.3s"
            }}>{t.label}</button>
          ))}
        </div>

        {/* Content */}
        {tab === "plans" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24 }}>
            <StakingPlans onSelect={setSelectedPlan} />
            <StakeForm plan={selectedPlan} onClose={() => setTab("active")} />
          </div>
        )}

        {tab === "active" && <ActiveStakesList />}
      </div>
    </div>
  );
}
