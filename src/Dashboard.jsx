import { useState } from "react";
import useSearch from "./hooks/useSearch.js";

const C = {
  bg: "#FFFBF5", surface: "#FFFFFF", surfAlt: "#F9F5EE",
  text: "#1C1917", textMid: "#44403C", textSoft: "#78716C", textFade: "#A8A29E",
  accent: "#16785E", accentLt: "#ECFDF5", accentDk: "#0F5C47",
  warm: "#D97706",
  border: "#E7E0D6", borderLt: "#F0EBE3",
};

const stC = { active: C.accent, review: C.warm, complete: C.textFade };

export default function Dashboard({ user, onLogout }) {
  const search = useSearch();
  const [tab, setTab] = useState("records");

  const searchHdrs = ["ID", "Name / Address", "Type", "Detail", "Status", "Date"];

  return (
    <div style={{
      background: C.bg, color: C.text, minHeight: "100vh",
      fontFamily: "'Satoshi','Inter',-apple-system,sans-serif",
    }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.4;}}
      `}</style>

      {/* Top nav */}
      <nav style={{
        padding: "14px 40px", borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1280, margin: "0 auto",
        background: "rgba(255,251,245,0.92)", backdropFilter: "blur(16px)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img src="/logo.png" alt="Nuoxo" style={{ height: 32, width: "auto", objectFit: "contain" }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.accent, textTransform: "uppercase", letterSpacing: 1, background: C.accentLt, padding: "4px 10px", borderRadius: 6 }}>
            Dashboard
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%", background: C.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#FFF", fontSize: 14, fontWeight: 700,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{user.name}</div>
              <div style={{ fontSize: 11, color: C.textSoft }}>{user.role}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "6px 14px", fontSize: 12, fontWeight: 600, color: C.textSoft,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textSoft; }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px" }}>
        {/* Welcome */}
        <div style={{ marginBottom: 28, animation: "fadeUp 0.5s ease-out" }}>
          <h1 style={{ fontSize: 28, fontWeight: 400, fontFamily: "'Instrument Serif',serif", marginBottom: 4 }}>
            Welcome back, <span style={{ fontStyle: "italic", color: C.accent }}>{user.name}</span>
          </h1>
          <p style={{ fontSize: 14, color: C.textSoft }}>Search across all public records</p>
        </div>

        {/* Search panel */}
        <div style={{
          background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
          boxShadow: "0 8px 40px rgba(28,25,23,0.04)",
          overflow: "hidden", animation: "fadeUp 0.6s ease-out 0.1s both",
        }}>
          {/* Tabs */}
          <div style={{
            padding: "12px 20px", borderBottom: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", justifyContent: "space-between", background: C.surfAlt,
          }}>
            <div style={{ display: "flex", gap: 0 }}>
              {[
                { k: "records", l: "Records" },
              ].map(t => (
                <span key={t.k} onClick={() => setTab(t.k)}
                  style={{
                    padding: "4px 12px", fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                    color: tab === t.k ? C.accent : C.textSoft, fontWeight: tab === t.k ? 700 : 400,
                    borderBottom: tab === t.k ? `2px solid ${C.accent}` : "2px solid transparent",
                  }}
                >{t.l}</span>
              ))}
            </div>
          </div>

          {/* Search bar */}
          <div style={{ padding: "10px 20px", borderBottom: `1px solid ${C.borderLt}`, display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative", flex: "1 1 200px" }}>
              <input
                type="text"
                value={search.query}
                onChange={e => search.setQuery(e.target.value)}
                placeholder="Search permits, addresses, entities, contractors..."
                autoFocus
                style={{
                  padding: "10px 16px", paddingRight: search.query ? 32 : 16,
                  background: C.surfAlt, border: `1px solid ${search.query ? C.accent : C.border}`,
                  borderRadius: 8, fontSize: 14, color: C.text,
                  width: "100%", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = C.accent}
                onBlur={e => { if (!search.query) e.target.style.borderColor = C.border; }}
              />
              {search.query && (
                <span
                  onClick={search.clear}
                  style={{
                    position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                    cursor: "pointer", fontSize: 16, color: C.textSoft, lineHeight: 1, fontWeight: 700,
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = C.text}
                  onMouseLeave={e => e.currentTarget.style.color = C.textSoft}
                >&times;</span>
              )}
            </div>
            <select
              value={search.jurisdiction}
              onChange={e => search.setJurisdiction(e.target.value)}
              style={{
                padding: "10px 14px", background: C.surfAlt,
                border: `1px solid ${search.jurisdiction ? C.accent : C.border}`,
                borderRadius: 8, fontSize: 13, color: search.jurisdiction ? C.accent : C.textMid,
                fontWeight: 500, cursor: "pointer", outline: "none", appearance: "auto",
              }}
            >
              <option value="">All Jurisdictions</option>
              {search.jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
          </div>

          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "120px 1fr 120px 120px 80px 70px",
            padding: "9px 20px", fontSize: 11, color: C.textFade, fontWeight: 700,
            textTransform: "uppercase", letterSpacing: 0.8, borderBottom: `1px solid ${C.borderLt}`,
          }}>
            {searchHdrs.map((x, i) => <span key={i}>{x}</span>)}
          </div>

          {/* Loading */}
          {search.isLoading && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: 14, color: C.accent }}>
              <span style={{ animation: "pulse 1.5s ease-in-out infinite", display: "inline-block" }}>
                Searching records...
              </span>
            </div>
          )}

          {/* Error */}
          {search.error && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: 14, color: C.warm }}>
              {search.error}
            </div>
          )}

          {/* Empty state */}
          {!search.isLoading && !search.error && search.results !== null && search.results.length === 0 && (
            <div style={{ padding: "40px 20px", textAlign: "center", fontSize: 14, color: C.textSoft }}>
              No records found for &ldquo;{search.query}&rdquo;
            </div>
          )}

          {/* No query yet */}
          {!search.isLoading && !search.error && search.results === null && (
            <div style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>&#128269;</div>
              <div style={{ fontSize: 15, color: C.textMid, fontWeight: 600, marginBottom: 4 }}>
                Search the database
              </div>
              <div style={{ fontSize: 13, color: C.textSoft }}>
                Type at least 3 characters to search across all record types
              </div>
            </div>
          )}

          {/* Results */}
          {!search.isLoading && !search.error && search.results && search.results.length > 0 && (
            <>
              {search.results.map((p, i) => (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "120px 1fr 120px 120px 80px 70px",
                  padding: "11px 20px", fontSize: 13, alignItems: "center",
                  borderBottom: i < search.results.length - 1 ? `1px solid ${C.borderLt}` : "none",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surfAlt}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{
                    fontFamily: "'IBM Plex Mono',monospace", fontSize: 11,
                    color: C.accent, fontWeight: 500,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{p.c1}</span>
                  <span style={{
                    fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{p.c2}</span>
                  <span>
                    {p.typeColor ? (
                      <span style={{
                        display: "inline-block", padding: "2px 8px", borderRadius: 4,
                        fontSize: 10, fontWeight: 600, color: "#FFF",
                        background: p.typeColor, letterSpacing: 0.3,
                      }}>{p.c3}</span>
                    ) : (
                      <span style={{ color: C.textSoft, fontSize: 12 }}>{p.c3}</span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: C.textMid }}>{p.c4}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: stC[p.st] || C.textFade }} />
                    <span style={{ fontSize: 11, color: C.textSoft, textTransform: "capitalize" }}>{p.st}</span>
                  </span>
                  <span style={{ fontSize: 12, color: C.textFade }}>{p.c6}</span>
                </div>
              ))}
            </>
          )}

          {/* Footer */}
          <div style={{
            padding: "10px 20px", background: C.surfAlt,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: `1px solid ${C.borderLt}`,
          }}>
            <span style={{ fontSize: 12, color: C.textSoft }}>
              {search.results ? `${search.resultCount} result${search.resultCount !== 1 ? "s" : ""} found` : "Ready to search"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
