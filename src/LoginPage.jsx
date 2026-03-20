import { useState } from "react";

const C = {
  bg: "#FFFBF5", surface: "#FFFFFF", surfAlt: "#F9F5EE",
  text: "#1C1917", textMid: "#44403C", textSoft: "#78716C", textFade: "#A8A29E",
  accent: "#16785E", accentLt: "#ECFDF5", accentDk: "#0F5C47",
  border: "#E7E0D6", borderLt: "#F0EBE3",
};

export default function LoginPage({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column",
      fontFamily: "'Satoshi','Inter',-apple-system,sans-serif",
    }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      <nav style={{
        padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1280, margin: "0 auto", width: "100%",
      }}>
        <img
          src="/logo.png" alt="Nuoxo"
          style={{ height: 38, width: "auto", objectFit: "contain", cursor: "pointer" }}
          onClick={onBack}
        />
        <span
          onClick={onBack}
          style={{ color: C.textSoft, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.color = C.text}
          onMouseLeave={e => e.currentTarget.style.color = C.textSoft}
        >
          Back to home
        </span>
      </nav>

      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px",
      }}>
        <div style={{
          background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`,
          padding: "48px 44px", maxWidth: 420, width: "100%",
          boxShadow: "0 24px 80px rgba(28,25,23,0.06)",
          animation: "fadeUp 0.5s ease-out",
        }}>
          <h1 style={{
            fontSize: 28, fontWeight: 400, fontFamily: "'Instrument Serif',serif",
            marginBottom: 6, color: C.text,
          }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: C.textSoft, marginBottom: 32 }}>
            Sign in to your Nuoxo account
          </p>

          <form onSubmit={handleSubmit}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoFocus
              style={{
                width: "100%", padding: "12px 16px", fontSize: 15,
                background: C.surface, border: `2px solid ${C.border}`, borderRadius: 12,
                color: C.text, outline: "none", transition: "border-color 0.2s", marginBottom: 18,
              }}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border}
            />

            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              style={{
                width: "100%", padding: "12px 16px", fontSize: 15,
                background: C.surface, border: `2px solid ${C.border}`, borderRadius: 12,
                color: C.text, outline: "none", transition: "border-color 0.2s", marginBottom: 24,
              }}
              onFocus={e => e.target.style.borderColor = C.accent}
              onBlur={e => e.target.style.borderColor = C.border}
            />

            {error && (
              <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 16 }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%", background: C.accent, color: "#FFF", border: "none",
                borderRadius: 12, padding: "14px", fontSize: 15, fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                opacity: submitting ? 0.7 : 1,
                transition: "all 0.2s",
                boxShadow: "0 2px 12px rgba(22,120,94,0.15)",
              }}
              onMouseEnter={e => { if (!submitting) e.target.style.boxShadow = "0 4px 20px rgba(22,120,94,0.25)"; }}
              onMouseLeave={e => { if (!submitting) e.target.style.boxShadow = "0 2px 12px rgba(22,120,94,0.15)"; }}
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
