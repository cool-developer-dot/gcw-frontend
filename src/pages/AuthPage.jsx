import { useState, useEffect } from "react";
import { login, register, verifyOTP } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

const GWC_BLUE = "#1a6fd4";
const GWC_DARK = "#0a0f1e";

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  icon,
}) {
  const [focused, setFocused] = useState(false);
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div style={{ marginBottom: 18 }}>
      <label
        style={{
          display: "block",
          color: "rgba(255,255,255,0.7)",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 7,
          fontFamily: "Segoe UI,sans-serif",
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: focused
            ? "rgba(26,111,212,0.1)"
            : "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(26,111,212,0.6)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 10,
          padding: "0 14px",
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(26,111,212,0.15)" : "none",
        }}
      >
        <span style={{ fontSize: 16, marginRight: 10, opacity: 0.6 }}>
          {icon}
        </span>
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            fontSize: 14,
            padding: "13px 0",
            fontFamily: "Segoe UI,sans-serif",
          }}
        />
        {isPassword && (
          <button
            onClick={() => setShow(!show)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.4)",
              fontSize: 16,
              padding: 0,
            }}
          >
            {show ? "🙈" : "👁️"}
          </button>
        )}
      </div>
    </div>
  );
}

function RegisterForm({ onSwitch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    referral: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const ref = params.get("ref");
    if (ref) {
      setForm(prev => ({ ...prev, referral: ref }));
    }
  }, [location.search]);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const res = await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        referralCode: form.referral,
      });
      setUserId(res.data.userId);
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOTP({ userId, otp: otp.join("") });
      localStorage.setItem("gwc_token", res.data.token);
      localStorage.setItem("gwc_user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");
    }
    setLoading(false);
  };

  if (step === 2) {
    return (
      <div>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
          <h2
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 900,
              fontFamily: "Georgia,serif",
              marginBottom: 8,
            }}
          >
            Verify Your Email
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            We sent a 6-digit OTP to
            <br />
            <span style={{ color: "#5ba3f5", fontWeight: 700 }}>
              {form.email}
            </span>
          </p>
        </div>
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              style={{
                width: 46,
                height: 54,
                textAlign: "center",
                fontSize: 22,
                fontWeight: 900,
                background: digit
                  ? "rgba(26,111,212,0.2)"
                  : "rgba(255,255,255,0.04)",
                border: `2px solid ${digit ? GWC_BLUE : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10,
                color: "#fff",
                outline: "none",
                fontFamily: "Georgia,serif",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
        <button
          onClick={handleVerify}
          disabled={loading || otp.some((d) => !d)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            background: otp.every((d) => d)
              ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
              : "rgba(255,255,255,0.08)",
            border: "none",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: otp.every((d) => d) ? "pointer" : "not-allowed",
            fontFamily: "Segoe UI,sans-serif",
            marginBottom: 14,
          }}
        >
          {loading ? "Verifying..." : "✅ Verify & Create Account"}
        </button>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setStep(1)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            ← Go Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 10px" }}>
            |
          </span>
          <button
            style={{
              background: "none",
              border: "none",
              color: GWC_BLUE,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "Segoe UI,sans-serif",
              fontWeight: 600,
            }}
          >
            Resend OTP
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 900,
            fontFamily: "Georgia,serif",
            marginBottom: 6,
          }}
        >
          Create Account
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 14,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          Join Global Wealth Community today
        </p>
      </div>
      <InputField
        label="Full Name"
        placeholder="Enter your full name"
        value={form.name}
        onChange={set("name")}
        icon="👤"
      />
      <InputField
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={set("email")}
        icon="✉️"
      />
      <InputField
        label="Phone Number"
        type="tel"
        placeholder="+92 300 0000000"
        value={form.phone}
        onChange={set("phone")}
        icon="📱"
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Min 8 characters"
        value={form.password}
        onChange={set("password")}
        icon="🔒"
      />
      <InputField
        label="Confirm Password"
        type="password"
        placeholder="Repeat your password"
        value={form.confirm}
        onChange={set("confirm")}
        icon="🔐"
      />
      <InputField
        label="Referral Code (Optional)"
        placeholder="Enter referral code"
        value={form.referral}
        onChange={set("referral")}
        icon="🎁"
      />
      {form.password && (
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background:
                    form.password.length >= i * 2
                      ? form.password.length >= 8
                        ? "#22c55e"
                        : "#f59e0b"
                      : "rgba(255,255,255,0.1)",
                  transition: "all 0.3s",
                }}
              />
            ))}
          </div>
          <div
            style={{
              fontSize: 11,
              color: form.password.length >= 8 ? "#22c55e" : "#f59e0b",
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            {form.password.length < 4
              ? "Weak"
              : form.password.length < 8
                ? "Fair"
                : "Strong"}{" "}
            password
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          marginBottom: 22,
        }}
      >
        <div
          onClick={() => setAgreed(!agreed)}
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            flexShrink: 0,
            marginTop: 1,
            background: agreed ? GWC_BLUE : "transparent",
            border: `2px solid ${agreed ? GWC_BLUE : "rgba(255,255,255,0.2)"}`,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#fff",
          }}
        >
          {agreed ? "✓" : ""}
        </div>
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 12,
            fontFamily: "Segoe UI,sans-serif",
            lineHeight: 1.5,
          }}
        >
          I agree to the{" "}
          <button
            type="button"
            onClick={() => {}}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: GWC_BLUE,
              textDecoration: "none",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Terms & Conditions
          </button>{" "}
          and{" "}
          <button
            type="button"
            onClick={() => {}}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              color: GWC_BLUE,
              textDecoration: "none",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            Privacy Policy
          </button>
        </span>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!agreed || loading}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 10,
          background: agreed
            ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
            : "rgba(255,255,255,0.06)",
          border: "none",
          color: agreed ? "#fff" : "rgba(255,255,255,0.3)",
          fontSize: 15,
          fontWeight: 700,
          cursor: agreed ? "pointer" : "not-allowed",
          fontFamily: "Segoe UI,sans-serif",
          marginBottom: 18,
          boxShadow: agreed ? "0 6px 20px rgba(26,111,212,0.4)" : "none",
        }}
      >
        {loading ? "Creating Account..." : "🚀 Create Account"}
      </button>
      <div
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.45)",
          fontSize: 14,
          fontFamily: "Segoe UI,sans-serif",
        }}
      >
        Already have an account?{" "}
        <button
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: GWC_BLUE,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

function LoginForm({ onSwitch }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await login({ email: form.email, password: form.password });
      localStorage.setItem("gwc_token", res.data.token);
      localStorage.setItem("gwc_user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const handleForgot = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`✅ Reset link sent to ${forgotEmail}`);
      setForgotMode(false);
    }, 1200);
  };

  if (forgotMode) {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => setForgotMode(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.5)",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "Segoe UI,sans-serif",
              padding: 0,
              marginBottom: 16,
            }}
          >
            ← Back to Login
          </button>
          <h2
            style={{
              color: "#fff",
              fontSize: 22,
              fontWeight: 900,
              fontFamily: "Georgia,serif",
              marginBottom: 6,
            }}
          >
            Forgot Password?
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: 14,
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            Enter your email to receive a reset link
          </p>
        </div>
        <InputField
          label="Email Address"
          type="email"
          placeholder="your@email.com"
          value={forgotEmail}
          onChange={(e) => setForgotEmail(e.target.value)}
          icon="✉️"
        />
        <button
          onClick={handleForgot}
          disabled={!forgotEmail || loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 10,
            background: forgotEmail
              ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
              : "rgba(255,255,255,0.06)",
            border: "none",
            color: "#fff",
            fontSize: 15,
            fontWeight: 700,
            cursor: forgotEmail ? "pointer" : "not-allowed",
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          {loading ? "Sending..." : "📧 Send Reset Link"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2
          style={{
            color: "#fff",
            fontSize: 24,
            fontWeight: 900,
            fontFamily: "Georgia,serif",
            marginBottom: 6,
          }}
        >
          Welcome Back
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: 14,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          Login to your GWC account
        </p>
      </div>
      <InputField
        label="Email Address"
        type="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={set("email")}
        icon="✉️"
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={set("password")}
        icon="🔒"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
          onClick={() => setRemember(!remember)}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: remember ? GWC_BLUE : "transparent",
              border: `2px solid ${remember ? GWC_BLUE : "rgba(255,255,255,0.2)"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#fff",
            }}
          >
            {remember ? "✓" : ""}
          </div>
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 13,
              fontFamily: "Segoe UI,sans-serif",
            }}
          >
            Remember me
          </span>
        </div>
        <button
          onClick={() => setForgotMode(true)}
          style={{
            background: "none",
            border: "none",
            color: GWC_BLUE,
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "Segoe UI,sans-serif",
            fontWeight: 600,
          }}
        >
          Forgot Password?
        </button>
      </div>
      <button
        onClick={handleLogin}
        disabled={!form.email || !form.password || loading}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: 10,
          background:
            form.email && form.password
              ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
              : "rgba(255,255,255,0.06)",
          border: "none",
          color: "#fff",
          fontSize: 15,
          fontWeight: 700,
          cursor: form.email && form.password ? "pointer" : "not-allowed",
          fontFamily: "Segoe UI,sans-serif",
          marginBottom: 18,
          boxShadow:
            form.email && form.password
              ? "0 6px 20px rgba(26,111,212,0.4)"
              : "none",
        }}
      >
        {loading ? "Logging in..." : "🔓 Login to Dashboard"}
      </button>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.25)",
            fontSize: 12,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          OR
        </span>
        <div
          style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }}
        />
      </div>
      {false && (
        <button
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "Segoe UI,sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            marginBottom: 18,
          }}
        >
          <span style={{ fontSize: 18 }}>🔵</span> Continue with Google
        </button>
      )}
      <div
        style={{
          textAlign: "center",
          color: "rgba(255,255,255,0.45)",
          fontSize: 14,
          fontFamily: "Segoe UI,sans-serif",
        }}
      >
        Don't have an account?{" "}
        <button
          onClick={onSwitch}
          style={{
            background: "none",
            border: "none",
            color: GWC_BLUE,
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  const [mode, setMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ref") ? "register" : "login";
  });
  return (
    <div
      style={{
        minHeight: "100vh",
        background: GWC_DARK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 1rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(26,111,212,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,111,212,0.05) 1px,transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(26,111,212,0.15) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{ display: "inline-flex", alignItems: "center", gap: 12 }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#1a6fd4,#0a3d7a)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                color: "#fff",
                fontFamily: "Georgia,serif",
              }}
            >
              G
            </div>
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  color: "#fff",
                  fontFamily: "Georgia,serif",
                }}
              >
                Global Wealth
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: GWC_BLUE,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontFamily: "Segoe UI,sans-serif",
                }}
              >
                Community
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            background: "rgba(255,255,255,0.04)",
            borderRadius: 12,
            padding: 4,
            marginBottom: 28,
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {["login", "register"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMode(tab)}
              style={{
                flex: 1,
                padding: "11px",
                borderRadius: 9,
                background:
                  mode === tab
                    ? "linear-gradient(135deg,#1a6fd4,#0d4fa0)"
                    : "transparent",
                border: "none",
                color: mode === tab ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "Segoe UI,sans-serif",
                transition: "all 0.3s",
              }}
            >
              {tab === "login" ? "🔓 Login" : "🚀 Register"}
            </button>
          ))}
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            padding: "32px 28px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
          }}
        >
          {mode === "login" ? (
            <LoginForm onSwitch={() => setMode("register")} />
          ) : (
            <RegisterForm onSwitch={() => setMode("login")} />
          )}
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            color: "rgba(255,255,255,0.2)",
            fontSize: 12,
            fontFamily: "Segoe UI,sans-serif",
          }}
        >
          🔒 Secured with SSL • © 2025 Global Wealth Community
        </div>
      </div>
    </div>
  );
}