import { useState } from "react";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const DEPOSIT_HISTORY = [
  { amount: "$500.00", date: "Dec 28, 2024", status: "Approved", txn: "TRX8f2a...4d9c", network: "TRC20" },
  { amount: "$200.00", date: "Dec 15, 2024", status: "Approved", txn: "TRX3b1e...8f2d", network: "TRC20" },
  { amount: "$100.00", date: "Dec 01, 2024", status: "Rejected", txn: "TRX9c4b...2e1a", network: "BEP20" },
];

const WITHDRAWAL_HISTORY = [
  { amount: "$100.00", fee: "$2.00", net: "$98.00", date: "Dec 27, 2024", status: "Pending", txn: "WTH001" },
  { amount: "$50.00",  fee: "$1.00", net: "$49.00", date: "Dec 20, 2024", status: "Approved", txn: "WTH002" },
  { amount: "$75.00",  fee: "$1.50", net: "$73.50", date: "Dec 10, 2024", status: "Approved", txn: "WTH003" },
];

function StatusBadge({ status }) {
  const colors = { Approved: { bg: "rgba(34,197,94,0.15)", color: "#22c55e" }, Pending: { bg: "rgba(245,158,11,0.15)", color: "#f59e0b" }, Rejected: { bg: "rgba(239,68,68,0.15)", color: "#ef4444" } };
  const c = colors[status] || colors.Pending;
  return <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", background: c.bg, color: c.color }}>{status}</span>;
}

function DepositPage() {
  const [method, setMethod] = useState("manual");
  const [network, setNetwork] = useState("TRC20");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const wallets = {
    TRC20: "TXyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabc",
    BEP20: "0x1234567890abcdef1234567890abcdef12345678",
  };

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 18 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
        <h3 style={{ color: "#22c55e", fontSize: 20, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 8 }}>Deposit Submitted!</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "Segoe UI,sans-serif", marginBottom: 24 }}>
          Your deposit of <strong style={{ color: "#fff" }}>${amount}</strong> is under review.<br />Admin will approve within 1-2 hours.
        </p>
        <button onClick={() => { setSubmitted(false); setAmount(""); setFile(null); }} style={{ padding: "12px 32px", borderRadius: 10, background: GWC_BLUE, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Method Toggle */}
      <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid rgba(255,255,255,0.06)", width: "fit-content", gap: 4 }}>
        {[{ id: "manual", label: "📸 Manual Deposit" }, { id: "auto", label: "⚡ Auto Deposit" }].map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)} style={{ padding: "10px 20px", borderRadius: 9, background: method === m.id ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "transparent", border: "none", color: method === m.id ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", transition: "all 0.3s" }}>{m.label}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
        {/* Left: Wallet Info */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px 20px" }}>
          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 20 }}>💳 Send USDT To</h3>

          {/* Network Select */}
          <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
            {["TRC20", "BEP20"].map(n => (
              <button key={n} onClick={() => setNetwork(n)} style={{
                flex: 1, padding: "10px", borderRadius: 10,
                background: network === n ? "rgba(26,111,212,0.2)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${network === n ? GWC_BLUE : "rgba(255,255,255,0.08)"}`,
                color: network === n ? "#5ba3f5" : "rgba(255,255,255,0.4)",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif"
              }}>{n}</button>
            ))}
          </div>

          {/* QR Placeholder */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 16, textAlign: "center", marginBottom: 16 }}>
            <div style={{ width: 120, height: 120, margin: "0 auto", background: "#f0f0f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>📱</div>
            <div style={{ color: "#333", fontSize: 11, marginTop: 8, fontFamily: "Segoe UI,sans-serif" }}>Scan QR Code</div>
          </div>

          {/* Wallet Address */}
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "12px 14px", marginBottom: 12, border: "1px solid rgba(26,111,212,0.2)" }}>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "Segoe UI,sans-serif", marginBottom: 4 }}>USDT {network} Address</div>
            <div style={{ color: "#5ba3f5", fontSize: 11, fontFamily: "monospace", wordBreak: "break-all" }}>{wallets[network]}</div>
          </div>

          <button onClick={() => navigator.clipboard?.writeText(wallets[network])} style={{ width: "100%", padding: "10px", borderRadius: 10, background: "rgba(26,111,212,0.15)", border: "1px solid rgba(26,111,212,0.3)", color: "#5ba3f5", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
            📋 Copy Address
          </button>

          <div style={{ marginTop: 16, padding: "12px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10 }}>
            <div style={{ color: "#f59e0b", fontSize: 12, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>⚠️ Important</div>
            <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, fontFamily: "Segoe UI,sans-serif", marginTop: 4, lineHeight: 1.5 }}>
              Only send USDT on {network} network. Wrong network = lost funds.
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px 20px" }}>
          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 20 }}>
            {method === "manual" ? "📸 Submit Proof" : "⚡ Auto Deposit"}
          </h3>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 7, fontFamily: "Segoe UI,sans-serif" }}>Amount (USDT)</label>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0 14px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 8 }}>$</span>
              <input type="number" placeholder="Enter amount" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 15, padding: "13px 0", fontFamily: "Segoe UI,sans-serif", fontWeight: 700 }} />
            </div>
          </div>

          {method === "manual" && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 7, fontFamily: "Segoe UI,sans-serif" }}>Upload Screenshot</label>
              <label style={{
                display: "block", border: "2px dashed rgba(26,111,212,0.4)", borderRadius: 12,
                padding: "28px", textAlign: "center", cursor: "pointer",
                background: file ? "rgba(34,197,94,0.06)" : "rgba(26,111,212,0.05)", transition: "all 0.3s"
              }}>
                <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} style={{ display: "none" }} />
                <div style={{ fontSize: 32, marginBottom: 8 }}>{file ? "✅" : "📸"}</div>
                <div style={{ color: file ? "#22c55e" : "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif", fontWeight: file ? 700 : 400 }}>
                  {file ? file.name : "Click to upload payment screenshot"}
                </div>
              </label>
            </div>
          )}

          {method === "auto" && (
            <div style={{ marginBottom: 16, padding: "14px", background: "rgba(26,111,212,0.08)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 12 }}>
              <div style={{ color: "#5ba3f5", fontSize: 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", marginBottom: 6 }}>⚡ Auto Detection</div>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", lineHeight: 1.6 }}>
                Send USDT to the wallet above. Our system auto-detects transactions within 5-10 minutes and credits your account instantly.
              </div>
            </div>
          )}

          <button onClick={() => { if (amount) setSubmitted(true); }} disabled={!amount || (method === "manual" && !file)} style={{
            width: "100%", padding: "14px", borderRadius: 10,
            background: amount ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "rgba(255,255,255,0.06)",
            border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: amount ? "pointer" : "not-allowed", fontFamily: "Segoe UI,sans-serif",
            boxShadow: amount ? "0 6px 20px rgba(26,111,212,0.4)" : "none"
          }}>
            {method === "manual" ? "📤 Submit Deposit" : "✅ Confirm & Watch"}
          </button>
        </div>
      </div>

      {/* History */}
      <div style={{ marginTop: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 20px" }}>
        <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 18 }}>📜 Deposit History</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Amount", "Network", "TXN ID", "Date", "Status"].map(h => <th key={h} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, padding: "10px 12px", textAlign: "left", fontFamily: "Segoe UI,sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {DEPOSIT_HISTORY.map((d, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "12px", color: "#22c55e", fontWeight: 800, fontSize: 14, fontFamily: "Georgia,serif" }}>{d.amount}</td>
                  <td style={{ padding: "12px" }}><span style={{ background: "rgba(26,111,212,0.15)", color: "#5ba3f5", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, fontFamily: "Segoe UI,sans-serif" }}>{d.network}</span></td>
                  <td style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "monospace" }}>{d.txn}</td>
                  <td style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{d.date}</td>
                  <td style={{ padding: "12px" }}><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function WithdrawalPage() {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [network, setNetwork] = useState("TRC20");
  const [submitted, setSubmitted] = useState(false);
  const fee = 2;
  const numAmount = parseFloat(amount) || 0;
  const netAmount = Math.max(0, numAmount - fee);

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(26,111,212,0.06)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 18 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>📤</div>
        <h3 style={{ color: "#5ba3f5", fontSize: 20, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 8 }}>Withdrawal Submitted!</h3>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontFamily: "Segoe UI,sans-serif", marginBottom: 8 }}>
          Withdrawal of <strong style={{ color: "#fff" }}>${netAmount.toFixed(2)}</strong> is pending approval.
        </p>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, fontFamily: "Segoe UI,sans-serif", marginBottom: 24 }}>Processing time: 24-48 hours</p>
        <button onClick={() => { setSubmitted(false); setAmount(""); setAddress(""); }} style={{ padding: "12px 32px", borderRadius: 10, background: GWC_BLUE, border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
          New Withdrawal
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
        {/* Balance Info */}
        <div style={{ background: "linear-gradient(135deg,rgba(26,111,212,0.12),rgba(26,111,212,0.04))", border: "1px solid rgba(26,111,212,0.25)", borderRadius: 18, padding: "24px 20px" }}>
          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 20 }}>💰 Withdrawal Balance</h3>
          {[
            { label: "Available Balance", val: "$547.50", color: "#22c55e", large: true },
            { label: "Minimum Withdrawal", val: "$20.00", color: "rgba(255,255,255,0.5)" },
            { label: "Withdrawal Fee", val: `$${fee}.00 (flat)`, color: "rgba(255,255,255,0.5)" },
            { label: "Processing Time", val: "24-48 Hours", color: "rgba(255,255,255,0.5)" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{s.label}</span>
              <span style={{ color: s.color, fontWeight: s.large ? 900 : 600, fontSize: s.large ? 18 : 13, fontFamily: s.large ? "Georgia,serif" : "Segoe UI,sans-serif" }}>{s.val}</span>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px 20px" }}>
          <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 20 }}>📤 Withdraw Funds</h3>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 7, fontFamily: "Segoe UI,sans-serif" }}>Select Network</label>
            <div style={{ display: "flex", gap: 10 }}>
              {["TRC20", "BEP20"].map(n => (
                <button key={n} onClick={() => setNetwork(n)} style={{ flex: 1, padding: "10px", borderRadius: 10, background: network === n ? "rgba(26,111,212,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${network === n ? GWC_BLUE : "rgba(255,255,255,0.08)"}`, color: network === n ? "#5ba3f5" : "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>{n}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 7, fontFamily: "Segoe UI,sans-serif" }}>USDT Wallet Address</label>
            <input type="text" placeholder={`Enter ${network} address`} value={address} onChange={e => setAddress(e.target.value)} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, marginBottom: 7, fontFamily: "Segoe UI,sans-serif" }}>Amount (USDT)</label>
            <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "0 14px" }}>
              <span style={{ color: "rgba(255,255,255,0.4)", marginRight: 8 }}>$</span>
              <input type="number" placeholder="Min $20" value={amount} onChange={e => setAmount(e.target.value)} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 15, padding: "13px 0", fontFamily: "Segoe UI,sans-serif", fontWeight: 700 }} />
              <button onClick={() => setAmount("547.50")} style={{ background: "rgba(26,111,212,0.2)", border: "none", color: GWC_BLUE, fontSize: 12, fontWeight: 700, padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>MAX</button>
            </div>
          </div>

          {numAmount > 0 && (
            <div style={{ background: "rgba(26,111,212,0.08)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
              {[
                { label: "Amount", val: `$${numAmount.toFixed(2)}` },
                { label: "Fee", val: `-$${fee}.00` },
                { label: "You receive", val: `$${netAmount.toFixed(2)}`, highlight: true },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderTop: i === 2 ? "1px solid rgba(255,255,255,0.08)" : "none", marginTop: i === 2 ? 6 : 0, paddingTop: i === 2 ? 8 : 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>{s.label}</span>
                  <span style={{ color: s.highlight ? "#22c55e" : "rgba(255,255,255,0.6)", fontWeight: s.highlight ? 800 : 500, fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{s.val}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => { if (amount && address) setSubmitted(true); }} disabled={!amount || !address || numAmount < 20} style={{
            width: "100%", padding: "14px", borderRadius: 10,
            background: amount && address && numAmount >= 20 ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "rgba(255,255,255,0.06)",
            border: "none", color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: amount && address && numAmount >= 20 ? "pointer" : "not-allowed",
            fontFamily: "Segoe UI,sans-serif",
            boxShadow: amount && address ? "0 6px 20px rgba(26,111,212,0.4)" : "none"
          }}>
            {!amount || !address ? "Fill all fields" : numAmount < 20 ? "Minimum $20" : "📤 Submit Withdrawal"}
          </button>
        </div>
      </div>

      {/* History */}
      <div style={{ marginTop: 28, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "22px 20px" }}>
        <h3 style={{ color: "#fff", fontWeight: 800, fontSize: 16, fontFamily: "Georgia,serif", marginBottom: 18 }}>📜 Withdrawal History</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>{["Amount", "Fee", "Net Amount", "TXN ID", "Date", "Status"].map(h => <th key={h} style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontWeight: 600, padding: "10px 12px", textAlign: "left", fontFamily: "Segoe UI,sans-serif", borderBottom: "1px solid rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {WITHDRAWAL_HISTORY.map((w, i) => (
                <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <td style={{ padding: "12px", color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Georgia,serif" }}>{w.amount}</td>
                  <td style={{ padding: "12px", color: "#ef4444", fontSize: 13, fontFamily: "Segoe UI,sans-serif" }}>{w.fee}</td>
                  <td style={{ padding: "12px", color: "#22c55e", fontWeight: 700, fontSize: 14, fontFamily: "Georgia,serif" }}>{w.net}</td>
                  <td style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "monospace" }}>{w.txn}</td>
                  <td style={{ padding: "12px", color: "rgba(255,255,255,0.4)", fontSize: 12, fontFamily: "Segoe UI,sans-serif", whiteSpace: "nowrap" }}>{w.date}</td>
                  <td style={{ padding: "12px" }}><StatusBadge status={w.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const [tab, setTab] = useState("deposit");

  return (
    <div style={{ minHeight: "100vh", background: GWC_DARK, padding: "20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 900, fontFamily: "Georgia,serif", marginBottom: 6 }}>
            {tab === "deposit" ? "📥 Deposit" : "📤 Withdraw"}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontFamily: "Segoe UI,sans-serif" }}>Manage your funds securely</p>
        </div>

        <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, marginBottom: 28, border: "1px solid rgba(255,255,255,0.06)", width: "fit-content", gap: 4 }}>
          {[{ id: "deposit", label: "📥 Deposit" }, { id: "withdraw", label: "📤 Withdraw" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "10px 22px", borderRadius: 9, background: tab === t.id ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)" : "transparent", border: "none", color: tab === t.id ? "#fff" : "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", transition: "all 0.3s" }}>{t.label}</button>
          ))}
        </div>

        {tab === "deposit" ? <DepositPage /> : <WithdrawalPage />}
      </div>
    </div>
  );
}
