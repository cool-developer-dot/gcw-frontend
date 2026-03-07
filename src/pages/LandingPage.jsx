import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function CountUp({ end, duration = 2000, prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = end / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["How It Works", "Features", "Referral", "FAQ"];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled || menuOpen ? "rgba(10,15,30,0.98)" : "transparent",
      borderBottom: scrolled ? "1px solid rgba(26,111,212,0.2)" : "none",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      transition: "all 0.3s ease",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#0a3d7a)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(26,111,212,0.5)", fontSize: 17, fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif" }}>G</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>Global Wealth</div>
            <div style={{ fontSize: 9, color: GWC_BLUE, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif" }}>Community</div>
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, textDecoration: "none", fontFamily: "Segoe UI,sans-serif", fontWeight: 500, transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#fff"}
                onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.7)"}
              >{item}</a>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!isMobile && (
            <>
              <button style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid rgba(26,111,212,0.5)", background: "transparent", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }} onClick={() => navigate('/login')}>Login</button>
              <button style={{ padding: "8px 18px", borderRadius: 8, background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", boxShadow: "0 4px 16px rgba(26,111,212,0.4)" }} onClick={() => navigate('/login')}>Join Now</button>
            </>
          )}
          {isMobile && (
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", fontSize: 24, padding: 4 }}>
              {menuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {isMobile && menuOpen && (
        <div style={{ background: "rgba(10,15,30,0.98)", padding: "1rem 1.5rem 1.5rem", borderTop: "1px solid rgba(26,111,212,0.15)" }}>
          {navLinks.map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: 15, textDecoration: "none", fontFamily: "Segoe UI,sans-serif", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >{item}</a>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(26,111,212,0.5)", background: "transparent", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>Login</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>Join Now</button>
          </div>
        </div>
      )}
    </nav>
  );
}

function Hero() {
  const isMobile = useIsMobile();
  return (
    <section style={{ minHeight: "100vh", background: GWC_DARK, position: "relative", overflow: "hidden", display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(26,111,212,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,0.05) 1px,transparent 1px)`, backgroundSize: "50px 50px" }} />
      <div style={{ position: "absolute", top: "20%", left: "60%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(26,111,212,0.18) 0%,transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: isMobile ? "110px 1.25rem 70px" : "130px 2rem 90px", position: "relative", zIndex: 2, width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 40 : 60, alignItems: "center" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(26,111,212,0.12)", border: "1px solid rgba(26,111,212,0.3)", borderRadius: 20, padding: "6px 14px", marginBottom: 24 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#00e676", boxShadow: "0 0 8px #00e676" }} />
              <span style={{ color: "#a0c4ff", fontSize: 12, fontFamily: "Segoe UI,sans-serif", fontWeight: 500 }}>Platform Live — Join 50,000+ Members</span>
            </div>
            <h1 style={{ fontSize: isMobile ? "2rem" : "clamp(2.2rem,5vw,3.8rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 18, fontFamily: "Georgia,'Times New Roman',serif" }}>
              Build Your Wealth<br />
              <span style={{ background: "linear-gradient(90deg,#1a6fd4,#5ba3f5,#1a6fd4)", backgroundSize: "200%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Globally. Together.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: isMobile ? 15 : 17, lineHeight: 1.7, marginBottom: 32, fontFamily: "Segoe UI,sans-serif" }}>
              Stake your assets, earn daily rewards, and grow through a powerful 10-level referral network. Transparent. Secure. Community-driven.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ padding: isMobile ? "12px 28px" : "14px 36px", borderRadius: 10, background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: isMobile ? 14 : 16, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif", boxShadow: "0 6px 24px rgba(26,111,212,0.5)" }}>
                🚀 Join Now — It's Free
              </button>
              <button style={{ padding: isMobile ? "12px 24px" : "14px 30px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.85)", fontSize: isMobile ? 14 : 16, fontWeight: 600, cursor: "pointer", fontFamily: "Segoe UI,sans-serif" }}>
                Watch Demo ▶
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { label: "Total Users", value: 52480, prefix: "", suffix: "+", icon: "👥", color: "#1a6fd4" },
              { label: "Total Staked", value: 8420000, prefix: "$", suffix: "", icon: "💰", color: "#0ea5e9" },
              { label: "Total Paid", value: 3150000, prefix: "$", suffix: "", icon: "💸", color: "#22c55e" },
              { label: "Daily Active", value: 12300, prefix: "", suffix: "+", icon: "⚡", color: "#f59e0b" },
            ].map((stat, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: isMobile ? "18px 14px" : "24px 20px" }}>
                <div style={{ fontSize: isMobile ? 22 : 28, marginBottom: 6 }}>{stat.icon}</div>
                <div style={{ fontSize: isMobile ? "1.1rem" : "1.6rem", fontWeight: 800, color: stat.color, fontFamily: "Georgia,serif" }}>
                  <CountUp end={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, fontFamily: "Segoe UI,sans-serif" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const isMobile = useIsMobile();
  const steps = [
    { num: "01", icon: "📝", title: "Register Account", desc: "Create your free account with email verification in under 2 minutes.", color: "#1a6fd4" },
    { num: "02", icon: "💳", title: "Deposit Funds", desc: "Deposit USDT via TRC20 or BEP20. Instant wallet credit after confirmation.", color: "#0ea5e9" },
    { num: "03", icon: "🔒", title: "Stake Amount", desc: "Choose your staking plan. Set duration from 30 to 80 days.", color: "#22c55e" },
    { num: "04", icon: "💎", title: "Earn Daily Rewards", desc: "Watch your balance grow daily. Withdraw anytime to your wallet.", color: "#f59e0b" },
  ];
  return (
    <section id="how-it-works" style={{ background: "#080c1a", padding: isMobile ? "70px 1.25rem" : "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ color: GWC_BLUE, fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif", marginBottom: 10 }}>Simple Process</div>
          <h2 style={{ fontSize: isMobile ? "1.7rem" : "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 12 }}>How It Works</h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 480, margin: "0 auto", fontFamily: "Segoe UI,sans-serif" }}>Four simple steps to start earning passive income</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 16 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: isMobile ? "20px 16px" : 28, position: "relative", overflow: "hidden", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${step.color}50`; e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ position: "absolute", top: 10, right: 14, fontSize: 36, fontWeight: 900, color: "rgba(255,255,255,0.04)", fontFamily: "Georgia,serif" }}>{step.num}</div>
              <div style={{ fontSize: isMobile ? 28 : 36, marginBottom: 12 }}>{step.icon}</div>
              <div style={{ width: 28, height: 3, background: step.color, borderRadius: 2, marginBottom: 12 }} />
              <h3 style={{ fontSize: isMobile ? 14 : 17, fontWeight: 800, color: "#fff", marginBottom: 8, fontFamily: "Georgia,serif" }}>{step.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 12 : 13, lineHeight: 1.6, fontFamily: "Segoe UI,sans-serif" }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const isMobile = useIsMobile();
  const features = [
    { icon: "📈", title: "Daily Rewards", desc: "Earn consistent daily returns on your staked assets. Auto-credited every 24 hours.", badge: "Auto" },
    { icon: "🌐", title: "10-Level Referral", desc: "Earn commissions from 10 levels deep in your network. Maximum earning potential.", badge: "10 Levels" },
    { icon: "🛡️", title: "Secure Wallet", desc: "Military-grade encryption, 2FA, IP tracking, and anti-DDoS protection built-in.", badge: "Protected" },
    { icon: "📊", title: "Transparent History", desc: "Full transaction history with real-time tracking. Every activity fully visible.", badge: "Live" },
    { icon: "🔐", title: "Admin 2FA", desc: "Two-factor authentication for all admin operations.", badge: "Secure" },
    { icon: "⚡", title: "Instant Deposits", desc: "USDT deposits via TRC20 confirmed and credited instantly.", badge: "Fast" },
  ];
  return (
    <section id="features" style={{ background: GWC_DARK, padding: isMobile ? "70px 1.25rem" : "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ color: GWC_BLUE, fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif", marginBottom: 10 }}>Platform Benefits</div>
          <h2 style={{ fontSize: isMobile ? "1.7rem" : "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif" }}>Why Choose GWC?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: "linear-gradient(135deg,rgba(26,111,212,0.06),rgba(255,255,255,0.02))", border: "1px solid rgba(26,111,212,0.15)", borderRadius: 16, padding: "22px 18px", display: "flex", gap: 14, alignItems: "flex-start", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(26,111,212,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,111,212,0.15)"; }}
            >
              <div style={{ width: 48, height: 48, flexShrink: 0, background: "rgba(26,111,212,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, border: "1px solid rgba(26,111,212,0.25)" }}>{f.icon}</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>{f.title}</h3>
                  <span style={{ background: "rgba(26,111,212,0.25)", color: "#5ba3f5", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontFamily: "Segoe UI,sans-serif" }}>{f.badge}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6, fontFamily: "Segoe UI,sans-serif" }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReferralSection() {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);

  const levels = [
    { level: "Level 1",  label: "Direct Referral",    percent: "10%",  color: "#1a6fd4", width: "100%", desc: "You → Direct Friends" },
    { level: "Level 2",  label: "Friends' Network",   percent: "8%",   color: "#1a8fd4", width: "90%",  desc: "Friends → Their Friends" },
    { level: "Level 3",  label: "Extended Network",   percent: "6%",   color: "#0ea5e9", width: "78%",  desc: "3rd Degree Network" },
    { level: "Level 4",  label: "Deep Network",       percent: "5%",   color: "#22c55e", width: "66%",  desc: "4th Degree Network" },
    { level: "Level 5",  label: "Community Layer",    percent: "4%",   color: "#16a34a", width: "56%",  desc: "5th Degree Network" },
    { level: "Level 6",  label: "Growth Layer",       percent: "3%",   color: "#84cc16", width: "46%",  desc: "6th Degree Network" },
    { level: "Level 7",  label: "Expansion Layer",    percent: "2%",   color: "#f59e0b", width: "36%",  desc: "7th Degree Network" },
    { level: "Level 8",  label: "Power Network",      percent: "1.5%", color: "#f97316", width: "28%",  desc: "8th Degree Network" },
    { level: "Level 9",  label: "Elite Network",      percent: "0.5%", color: "#ef4444", width: "20%",  desc: "9th Degree Network" },
    { level: "Level 10", label: "Master Network",     percent: "0.5%", color: "#a855f7", width: "12%",  desc: "10th Degree Network" },
  ];

  const visibleLevels = showAll ? levels : levels.slice(0, 5);

  return (
    <section id="referral" style={{ background: "#080c1a", padding: isMobile ? "70px 1.25rem" : "100px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ color: GWC_BLUE, fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif", marginBottom: 10 }}>Passive Income</div>
          <h2 style={{ fontSize: isMobile ? "1.7rem" : "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 14 }}>
            10-Level Referral Income Model
          </h2>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 560, margin: "0 auto", fontFamily: "Segoe UI,sans-serif", lineHeight: 1.7 }}>
            Earn passive income from 10 levels deep. Total combined commission up to <strong style={{ color: "#5ba3f5" }}>41%</strong>
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 14, marginBottom: 36 }}>
          {[
            { icon: "🏆", label: "Total Levels", value: "10" },
            { icon: "💰", label: "Max Commission", value: "41%" },
            { icon: "👥", label: "Network Depth", value: "Unlimited" },
            { icon: "⚡", label: "Auto Credit", value: "Daily" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(26,111,212,0.08)", border: "1px solid rgba(26,111,212,0.2)", borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: isMobile ? "1rem" : "1.3rem", fontWeight: 900, color: "#5ba3f5", fontFamily: "Georgia,serif" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "Segoe UI,sans-serif", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Levels List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {visibleLevels.map((l, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: isMobile ? "14px 16px" : "18px 24px", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${l.color}50`; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${l.color}20`, border: `1px solid ${l.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: l.color, fontFamily: "Georgia,serif", flexShrink: 0 }}>{i + 1}</div>
                  <div>
                    <span style={{ color: "#fff", fontWeight: 800, fontSize: isMobile ? 13 : 15, fontFamily: "Georgia,serif" }}>{l.level}</span>
                    {!isMobile && <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, marginLeft: 8, fontFamily: "Segoe UI,sans-serif" }}>— {l.label}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {!isMobile && <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>{l.desc}</span>}
                  <span style={{ color: l.color, fontWeight: 900, fontSize: isMobile ? 15 : 20, fontFamily: "Georgia,serif", minWidth: 46, textAlign: "right" }}>{l.percent}</span>
                </div>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div style={{ width: l.width, height: "100%", background: `linear-gradient(90deg,${l.color},${l.color}80)`, borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 22 }}>
          <button onClick={() => setShowAll(!showAll)} style={{
            padding: "11px 30px", borderRadius: 10,
            background: showAll ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#1a6fd4,#0d4fa0)",
            border: showAll ? "1px solid rgba(255,255,255,0.15)" : "none",
            color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Segoe UI,sans-serif"
          }}>
            {showAll ? "▲ Show Less" : "▼ Show All 10 Levels"}
          </button>
        </div>

        {/* Example Earnings */}
        <div style={{ marginTop: 36, background: "rgba(26,111,212,0.08)", border: "1px solid rgba(26,111,212,0.25)", borderRadius: 20, padding: isMobile ? "22px 16px" : "30px 36px" }}>
          <div style={{ textAlign: "center", marginBottom: 22 }}>
            <h3 style={{ color: "#fff", fontWeight: 800, fontSize: isMobile ? "1rem" : "1.2rem", fontFamily: "Georgia,serif" }}>💡 Example: If Team Stakes $100,000</h3>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(5,1fr)", gap: 10 }}>
            {levels.map((l, i) => (
              <div key={i} style={{ textAlign: "center", background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: "12px 8px", border: `1px solid ${l.color}20` }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "Segoe UI,sans-serif", marginBottom: 4 }}>{l.level}</div>
                <div style={{ fontSize: isMobile ? 13 : 15, fontWeight: 900, color: l.color, fontFamily: "Georgia,serif" }}>
                  ${(100000 * parseFloat(l.percent) / 100).toLocaleString()}
                </div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", fontFamily: "Segoe UI,sans-serif", marginTop: 3 }}>per cycle</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Security() {
  const isMobile = useIsMobile();
  return (
    <section style={{ background: GWC_DARK, padding: isMobile ? "60px 1.25rem" : "80px 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: isMobile ? "1.5rem" : "clamp(1.6rem,3vw,2.4rem)", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif" }}>Enterprise-Grade Security</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(3,1fr)" : "repeat(6,1fr)", gap: 12 }}>
          {[
            { icon: "🔒", text: "SSL Encrypted" },
            { icon: "🛡️", text: "Admin 2FA" },
            { icon: "💼", text: "Secure Wallet" },
            { icon: "🌐", text: "IP Tracking" },
            { icon: "⚡", text: "Anti-DDoS" },
            { icon: "💾", text: "Daily Backup" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(26,111,212,0.06)", border: "1px solid rgba(26,111,212,0.15)", borderRadius: 12, padding: "16px 10px", textAlign: "center", transition: "all 0.3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(26,111,212,0.12)"; e.currentTarget.style.borderColor = "rgba(26,111,212,0.4)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(26,111,212,0.06)"; e.currentTarget.style.borderColor = "rgba(26,111,212,0.15)"; }}
            >
              <div style={{ fontSize: isMobile ? 22 : 26, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ color: "#fff", fontSize: isMobile ? 11 : 13, fontWeight: 700, fontFamily: "Segoe UI,sans-serif" }}>{s.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(null);
  const faqs = [
    { q: "What is the minimum stake amount?", a: "The minimum stake amount is set by the admin. Typically starts from $50 USDT. Check your dashboard after registration for current limits." },
    { q: "How long does withdrawal take?", a: "Withdrawals are processed within 24-48 hours after admin approval. Once approved, funds are sent directly to your USDT wallet instantly." },
    { q: "How does the 10-level referral commission work?", a: "You earn from 10 levels: L1 (10%), L2 (8%), L3 (6%), L4 (5%), L5 (4%), L6 (3%), L7 (2%), L8 (1.5%), L9 (0.5%), L10 (0.5%) — total up to 41% combined." },
    { q: "Can I unstake early?", a: "Early unstake option is available based on admin settings. An early unstake fee may apply. Check your active stakes panel for current policies." },
    { q: "What wallets are supported for deposit?", a: "We support USDT deposits via TRC20 (Tron Network) and BEP20 (BNB Chain). Always verify the network before sending." },
    { q: "Is my investment secure?", a: "Yes. We use SSL encryption, 2FA, IP tracking, and anti-DDoS protection. All funds are stored in secure wallets with daily backups." },
  ];
  return (
    <section id="faq" style={{ background: "#080c1a", padding: isMobile ? "70px 1.25rem" : "100px 2rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <div style={{ color: GWC_BLUE, fontSize: 12, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", fontFamily: "Segoe UI,sans-serif", marginBottom: 10 }}>Got Questions?</div>
          <h2 style={{ fontSize: isMobile ? "1.7rem" : "clamp(1.8rem,4vw,2.8rem)", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif" }}>Frequently Asked</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: open === i ? "rgba(26,111,212,0.1)" : "rgba(255,255,255,0.03)", border: `1px solid ${open === i ? "rgba(26,111,212,0.4)" : "rgba(255,255,255,0.07)"}`, borderRadius: 12, overflow: "hidden", transition: "all 0.3s" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "16px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", color: "#fff", fontSize: isMobile ? 13 : 15, fontWeight: 700, fontFamily: "Segoe UI,sans-serif", textAlign: "left", gap: 12 }}>
                <span>{faq.q}</span>
                <span style={{ color: GWC_BLUE, fontSize: 20, transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s", flexShrink: 0 }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 18px 16px", color: "rgba(255,255,255,0.6)", fontSize: 13, lineHeight: 1.7, fontFamily: "Segoe UI,sans-serif" }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  const isMobile = useIsMobile();
  return (
    <section style={{ background: GWC_DARK, padding: isMobile ? "70px 1.25rem" : "100px 2rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(26,111,212,0.15) 0%,transparent 70%)", transform: "translate(-50%,-50%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 680, margin: "0 auto", textAlign: "center", position: "relative" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🌐</div>
        <h2 style={{ fontSize: isMobile ? "1.7rem" : "clamp(2rem,4vw,3rem)", fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif", marginBottom: 14 }}>Ready to Grow Your Wealth?</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: isMobile ? 14 : 17, marginBottom: 34, fontFamily: "Segoe UI,sans-serif", lineHeight: 1.7 }}>
          Join 50,000+ members already earning daily rewards across a 10-level network.
        </p>
        <button style={{ padding: isMobile ? "13px 34px" : "16px 48px", borderRadius: 12, background: "linear-gradient(135deg,#1a6fd4,#0d4fa0)", border: "none", color: "#fff", fontSize: isMobile ? 15 : 17, fontWeight: 800, cursor: "pointer", fontFamily: "Georgia,serif", boxShadow: "0 8px 32px rgba(26,111,212,0.5)" }}>
          Create Free Account →
        </button>
      </div>
    </section>
  );
}

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: "#050810", borderTop: "1px solid rgba(26,111,212,0.2)", padding: isMobile ? "48px 1.25rem 28px" : "60px 2rem 30px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 28 : 40, marginBottom: 36 }}>
          <div style={{ gridColumn: isMobile ? "1/-1" : "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg,#1a6fd4,#0a3d7a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#fff", fontFamily: "Georgia,serif" }}>G</div>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", fontFamily: "Georgia,serif" }}>Global Wealth Community</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, lineHeight: 1.7, fontFamily: "Segoe UI,sans-serif", maxWidth: 240, marginBottom: 14 }}>
              Building financial freedom through community and blockchain technology.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {["𝕏", "📘", "💬", "📢"].map((s, i) => (
                <div key={i} style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(26,111,212,0.15)", border: "1px solid rgba(26,111,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{s}</div>
              ))}
            </div>
          </div>
          {[
            { title: "Platform", links: ["How It Works", "Features", "Staking Plans", "10-Level Referral"] },
            { title: "Account", links: ["Register", "Login", "Dashboard", "Withdraw"] },
            { title: "Legal", links: ["Terms & Conditions", "Privacy Policy", "Contact Us"] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 800, marginBottom: 14, fontFamily: "Georgia,serif" }}>{col.title}</div>
              {col.links.map((link, j) => (
                <div key={j} style={{ marginBottom: 8 }}>
                  <a href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, textDecoration: "none", fontFamily: "Segoe UI,sans-serif" }}
                    onMouseEnter={e => e.target.style.color = "#5ba3f5"}
                    onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.35)"}
                  >{link}</a>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>© 2025 Global Wealth Community. All rights reserved.</div>
          <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 12, fontFamily: "Segoe UI,sans-serif" }}>📧 support@globalwealthcommunity.io</div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div style={{ margin: 0, padding: 0, background: GWC_DARK, minHeight: "100vh" }}>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <ReferralSection />
      <Security />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
