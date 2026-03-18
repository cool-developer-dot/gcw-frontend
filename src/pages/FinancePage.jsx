import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  submitDeposit,
  getDepositHistory,
  requestWithdrawal,
  getWithdrawalHistory,
  getWallet,
} from "../api";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

const BEP20_ADDRESS = "0x7c955320094232f83610c9db11b26fc90fad1876";

// ── Professional Toast ────────────────────────────────────────────────────────
const toastIcons = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };

function Toast({ toasts, onRemove }) {
  return (
    <>
      <style>{`
        @keyframes toastIn  { from { transform: translateX(110%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes toastOut { from { transform: translateX(0);    opacity: 1; } to { transform: translateX(110%); opacity: 0; } }
        .toast-item        { animation: toastIn  0.35s cubic-bezier(.21,1.02,.73,1) forwards; }
        .toast-item.hiding { animation: toastOut 0.3s ease forwards; }
        .toast-close-btn:hover { opacity: 1 !important; }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast-item${t.hiding ? " hiding" : ""}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 16px",
              borderRadius: 12,
              fontFamily: "Segoe UI, sans-serif",
              fontSize: 13,
              fontWeight: 600,
              minWidth: 260,
              maxWidth: 340,
              pointerEvents: "auto",
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              ...(t.type === "success" && {
                background: "rgba(20,83,45,0.97)",
                color: "#4ade80",
                border: "1px solid #166534",
              }),
              ...(t.type === "error" && {
                background: "rgba(100,10,10,0.97)",
                color: "#f87171",
                border: "1px solid #7f1d1d",
              }),
              ...(t.type === "warning" && {
                background: "rgba(78,50,0,0.97)",
                color: "#fbbf24",
                border: "1px solid #92400e",
              }),
              ...(t.type === "info" && {
                background: "rgba(15,30,60,0.97)",
                color: "#93c5fd",
                border: "1px solid #1e3a5f",
              }),
            }}
            onClick={() => onRemove(t.id)}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>
              {toastIcons[t.type] || "🔔"}
            </span>
            <span style={{ flex: 1, lineHeight: 1.45 }}>{t.msg}</span>
            <span
              className="toast-close-btn"
              style={{
                fontSize: 14,
                opacity: 0.4,
                flexShrink: 0,
                transition: "opacity 0.2s",
              }}
            >
              ✕
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export default function FinancePage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState("deposit");
  const [depositTab, setDepositTab] = useState("manual");
  const [amount, setAmount] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [depositHistory, setDepositHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const [toasts, setToasts] = useState([]);

  // ── Toast helpers ─────────────────────────────────────────────────────────
  const removeToast = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, hiding: true } : t)),
    );
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 320);
  };

  const showToast = (msg, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, msg, type, hiding: false }]);
    setTimeout(() => removeToast(id), 3000);
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
      const [walletRes, depRes, withRes] = await Promise.all([
        getWallet(),
        getDepositHistory(),
        getWithdrawalHistory(),
      ]);
      setWallet(walletRes.data.wallet);
      setDepositHistory(depRes.data.deposits || []);
      setWithdrawHistory(withRes.data.withdrawals || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeposit = async () => {
    if (!amount || !screenshot) {
      showToast("Amount and screenshot are both required.", "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("amount", amount);
      formData.append("network", "BEP20");
      formData.append("screenshot", screenshot);
      await submitDeposit(formData);
      showToast(
        "Deposit request submitted successfully. Admin will verify shortly.",
        "success",
      );
      setAmount("");
      setScreenshot(null);
      fetchAll();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Deposit submission failed. Please try again.",
        "error",
      );
    }
    setLoading(false);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !withdrawAddress) {
      showToast("Please enter both amount and wallet address.", "error");
      return;
    }
    if (wallet && parseFloat(withdrawAmount) > wallet.withdrawableBalance) {
      showToast("Insufficient withdrawable balance.", "error");
      return;
    }
    setLoading(true);
    try {
      await requestWithdrawal({
        amount: parseFloat(withdrawAmount),
        walletAddress: withdrawAddress,
        network: "BEP20",
      });
      showToast(
        "Withdrawal request submitted. Admin will process it soon.",
        "success",
      );
      setWithdrawAmount("");
      setWithdrawAddress("");
      fetchAll();
    } catch (err) {
      showToast(
        err.response?.data?.message ||
          "Withdrawal request failed. Please try again.",
        "error",
      );
    }
    setLoading(false);
  };

  const copyAddress = () => {
    navigator.clipboard?.writeText(BEP20_ADDRESS);
    setCopied(true);
    showToast("Wallet address copied to clipboard.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const statusColor = {
    pending: "#f59e0b",
    approved: "#22c55e",
    rejected: "#ef4444",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    color: "#fff",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "Segoe UI,sans-serif",
  };

  const labelStyle = {
    display: "block",
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    marginBottom: 8,
    fontFamily: "Segoe UI,sans-serif",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: GWC_DARK,
        color: "#fff",
        fontFamily: "Segoe UI,sans-serif",
      }}
    >
      {/* Toast */}
      <Toast toasts={toasts} onRemove={removeToast} />

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
            💳 Finance
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
            Wallet: ${wallet?.mainWallet?.toFixed(2) || "0.00"} | Withdrawable:
            ${wallet?.withdrawableBalance?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
        {/* Main Tabs */}
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
            ["deposit", "📥 Deposit"],
            ["withdraw", "📤 Withdraw"],
            ["history", "📜 History"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setMainTab(id)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 9,
                background:
                  mainTab === id
                    ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
                    : "transparent",
                border: "none",
                color: mainTab === id ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Segoe UI,sans-serif",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── DEPOSIT ── */}
        {mainTab === "deposit" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["manual", "auto"].map((t) => (
                <button
                  key={t}
                  onClick={() => setDepositTab(t)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 20,
                    background:
                      depositTab === t ? GWC_BLUE : "rgba(255,255,255,0.05)",
                    border: `1px solid ${depositTab === t ? GWC_BLUE : "rgba(255,255,255,0.1)"}`,
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {t === "manual" ? "📋 Manual" : "⚡ Auto"} Deposit
                </button>
              ))}
            </div>

            {depositTab === "manual" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                  gap: 16,
                }}
              >
                {/* Left - Address */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}
                  >
                    💳 Send USDT To
                  </div>

                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      background: "rgba(26,111,212,0.15)",
                      border: "1px solid rgba(26,111,212,0.3)",
                      borderRadius: 8,
                      padding: "8px 16px",
                      marginBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#22c55e",
                      }}
                    />
                    <span
                      style={{
                        color: "#5ba3f5",
                        fontWeight: 700,
                        fontSize: 14,
                        fontFamily: "monospace",
                      }}
                    >
                      BEP20 (BSC)
                    </span>
                    <span
                      style={{
                        background: "rgba(34,197,94,0.2)",
                        color: "#22c55e",
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 20,
                      }}
                    >
                      ACTIVE
                    </span>
                  </div>

                  {/* ── QR CODE ── */}
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 12,
                      padding: "16px",
                      marginBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <QRCodeSVG
                      value={BEP20_ADDRESS}
                      size={160}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  <div
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: 8,
                      padding: "10px 12px",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 10,
                        marginBottom: 4,
                      }}
                    >
                      USDT BEP20 Address
                    </div>
                    <div
                      style={{
                        color: "#5ba3f5",
                        fontSize: 11,
                        wordBreak: "break-all",
                        fontFamily: "monospace",
                      }}
                    >
                      {BEP20_ADDRESS}
                    </div>
                  </div>

                  <button
                    onClick={copyAddress}
                    style={{
                      width: "100%",
                      padding: "10px",
                      borderRadius: 8,
                      background: copied ? "#22c55e" : "rgba(26,111,212,0.2)",
                      border: `1px solid ${copied ? "#22c55e" : GWC_BLUE}`,
                      color: "#fff",
                      cursor: "pointer",
                      fontWeight: 700,
                      fontSize: 13,
                      transition: "all 0.3s",
                    }}
                  >
                    {copied ? "✓ Copied!" : "📋 Copy Address"}
                  </button>

                  <div
                    style={{
                      marginTop: 12,
                      padding: "10px",
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      borderRadius: 8,
                    }}
                  >
                    <div
                      style={{
                        color: "#f59e0b",
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      ⚠️ Important
                    </div>
                    <div
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 11,
                        marginTop: 4,
                      }}
                    >
                      Only send USDT on BEP20 (BSC) network. Wrong network =
                      lost funds.
                    </div>
                  </div>
                </div>

                {/* Right - Submit */}
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 16,
                    padding: "20px",
                  }}
                >
                  <div
                    style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}
                  >
                    📸 Submit Proof
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Amount (USDT)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>Upload Screenshot</label>
                    <label
                      style={{
                        display: "block",
                        border: "2px dashed rgba(26,111,212,0.4)",
                        borderRadius: 10,
                        padding: "24px",
                        textAlign: "center",
                        cursor: "pointer",
                        background: screenshot
                          ? "rgba(34,197,94,0.1)"
                          : "rgba(255,255,255,0.02)",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setScreenshot(e.target.files[0])}
                        style={{ display: "none" }}
                      />
                      {screenshot ? (
                        <div>
                          <div style={{ fontSize: 24, marginBottom: 8 }}>
                            ✅
                          </div>
                          <div style={{ color: "#22c55e", fontSize: 13 }}>
                            {screenshot.name}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 32, marginBottom: 8 }}>
                            📸
                          </div>
                          <div
                            style={{
                              color: "rgba(255,255,255,0.4)",
                              fontSize: 13,
                            }}
                          >
                            Click to upload payment screenshot
                          </div>
                        </div>
                      )}
                    </label>
                  </div>

                  <button
                    onClick={handleDeposit}
                    disabled={loading}
                    style={{
                      width: "100%",
                      padding: "13px",
                      borderRadius: 10,
                      background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)",
                      border: "none",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {loading ? "Submitting..." : "📤 Submit Deposit"}
                  </button>
                </div>
              </div>
            )}

            {depositTab === "auto" && (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 16,
                  padding: "32px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    fontFamily: "Georgia,serif",
                    marginBottom: 8,
                  }}
                >
                  Auto Deposit
                </div>
                <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                  Coming soon! Abhi manual deposit use karein.
                </div>
              </div>
            )}
          </>
        )}

        {/* ── WITHDRAW ── */}
        {mainTab === "withdraw" && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "20px",
              maxWidth: 500,
            }}
          >
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>
              📤 Withdraw USDT
            </div>
            <div style={{ color: "#22c55e", fontSize: 13, marginBottom: 20 }}>
              Withdrawable: ${wallet?.withdrawableBalance?.toFixed(2) || "0.00"}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Network</label>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "rgba(26,111,212,0.15)",
                  border: "1px solid rgba(26,111,212,0.3)",
                  borderRadius: 8,
                  padding: "10px 16px",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#22c55e",
                  }}
                />
                <span
                  style={{
                    color: "#5ba3f5",
                    fontWeight: 700,
                    fontSize: 14,
                    fontFamily: "monospace",
                  }}
                >
                  BEP20 (BSC)
                </span>
                <span
                  style={{
                    background: "rgba(34,197,94,0.2)",
                    color: "#22c55e",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: 20,
                  }}
                >
                  ACTIVE
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Wallet Address (BEP20)</label>
              <input
                value={withdrawAddress}
                onChange={(e) => setWithdrawAddress(e.target.value)}
                placeholder="Enter your BEP20 wallet address"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Amount (USDT)</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount"
                style={inputStyle}
              />
            </div>

            <div
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 10,
                padding: "12px",
                marginBottom: 16,
              }}
            >
              <div style={{ color: "#f59e0b", fontSize: 12 }}>
                ⚠️ Min withdrawal: $20 | Fee: $2 | Processing: 24-48 hours
              </div>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading}
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 10,
                background: "linear-gradient(135deg,#f59e0b,#d97706)",
                border: "none",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? "Processing..." : "💸 Request Withdrawal"}
            </button>
          </div>
        )}

        {/* ── HISTORY ── */}
        {mainTab === "history" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "20px",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>
                📥 Deposit History
              </div>
              {depositHistory.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.3)",
                    padding: "24px",
                    fontSize: 13,
                  }}
                >
                  No deposits yet
                </div>
              ) : (
                depositHistory.map((d, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        ${d.amount}
                      </div>
                      <div
                        style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      >
                        {d.network} •{" "}
                        {new Date(d.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        background: `${statusColor[d.status]}20`,
                        color: statusColor[d.status],
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "capitalize",
                      }}
                    >
                      {d.status}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16,
                padding: "20px",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 16 }}>
                📤 Withdrawal History
              </div>
              {withdrawHistory.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "rgba(255,255,255,0.3)",
                    padding: "24px",
                    fontSize: 13,
                  }}
                >
                  No withdrawals yet
                </div>
              ) : (
                withdrawHistory.map((w, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "10px 0",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        ${w.amount}
                      </div>
                      <div
                        style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}
                      >
                        {w.network} •{" "}
                        {new Date(w.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      style={{
                        background: `${statusColor[w.status]}20`,
                        color: statusColor[w.status],
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: 20,
                        textTransform: "capitalize",
                      }}
                    >
                      {w.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
