import { useState, useCallback } from "react";
import useAuthSearch, { fetchRecordDetail } from "./hooks/useAuthSearch.js";

const C = {
  bg: "#FFFBF5", surface: "#FFFFFF", surfAlt: "#F9F5EE",
  text: "#1C1917", textMid: "#44403C", textSoft: "#78716C", textFade: "#A8A29E",
  accent: "#16785E", accentLt: "#ECFDF5", accentDk: "#0F5C47",
  warm: "#D97706",
  border: "#E7E0D6", borderLt: "#F0EBE3",
};

const stC = { active: C.accent, review: C.warm, complete: C.textFade };

// Human-readable labels for field names
const FIELD_LABELS = {
  id: "ID", permit_id: "Permit ID", permit_type: "Permit Type", address: "Address",
  city: "City", zip: "ZIP", county: "County", status: "Status", source: "Source",
  issue_date: "Issue Date", owner_name: "Owner", contractor_name: "Contractor",
  estimated_value: "Estimated Value", description: "Description",
  latitude: "Latitude", longitude: "Longitude", parcel: "Parcel",
  parcel_id: "Parcel ID", situs_address: "Site Address", situs_city: "City",
  situs_zip: "ZIP", owner_addr1: "Owner Address", owner_city: "Owner City",
  owner_state: "Owner State", owner_zip: "Owner ZIP", just_value: "Just Value",
  assessed_value_sd: "Assessed Value (SD)", taxable_value_sd: "Taxable Value (SD)",
  land_value: "Land Value", land_sqft: "Land Sq Ft", living_area: "Living Area",
  year_built: "Year Built", num_buildings: "Buildings", num_units: "Units",
  name: "Name", entity_type: "Entity Type", filing_date: "Filing Date",
  license_number: "License Number", license_type_desc: "License Type",
  license_status: "License Status", expiration_date: "Expiration",
  contractor_name: "Contractor", contractor_phone: "Phone",
  contractor_email: "Email", contractor_license: "License",
  property_address: "Property Address", total_due: "Total Due",
  tax_amount: "Tax Amount", interest_amount: "Interest", fees_amount: "Fees",
  violation_type: "Violation Type", violation_description: "Description",
  respondent_name: "Respondent", fine_amount: "Fine Amount",
  lien_amount: "Lien Amount", opened_date: "Opened", closed_date: "Closed",
  sale_price: "Sale Price", sale_date: "Sale Date", grantor: "Grantor",
  grantee: "Grantee", deed_type: "Deed Type", full_name: "Full Name",
  email: "Email", phone: "Phone", business_address1: "Business Address",
  business_city: "Business City", business_county: "Business County",
  licensee_name: "Licensee", dba_name: "DBA", primary_status: "Status",
  secondary_status: "Secondary Status", original_date: "Original Date",
  last_renewal_date: "Last Renewal", board_code: "Board Code",
  matched_parcel_id: "Matched Parcel", jurisdiction: "Jurisdiction",
  work_type: "Work Type", project_type: "Project Type", project_name: "Project Name",
  applicant_name: "Applicant", owner_address: "Owner Address",
  zoning: "Zoning", flood_zone: "Flood Zone", subdivision: "Subdivision",
  legal_description: "Legal Description", sqft: "Sq Ft", bedrooms: "Bedrooms",
  bathrooms: "Bathrooms", stories: "Stories", lot_sqft: "Lot Sq Ft",
  building_use: "Building Use", job_value: "Job Value", total_fees: "Total Fees",
  apply_date: "Apply Date", application_date: "Application Date",
  close_date: "Close Date", co_date: "C/O Date", completion_date: "Completion Date",
  final_date: "Final Date", status_date: "Status Date",
  last_inspection_date: "Last Inspection", last_inspection_result: "Inspection Result",
  case_number: "Case Number", case_type: "Case Type", hearing_date: "Hearing Date",
  compliance_date: "Compliance Date", inspector: "Inspector", resolution: "Resolution",
  tax_year: "Tax Year", delinquent: "Delinquent", certificate_number: "Certificate #",
  certificate_holder: "Certificate Holder", certificate_face_amount: "Certificate Face Amount",
  interest_rate: "Interest Rate", tax_deed_status: "Tax Deed Status",
  assessed_value: "Assessed Value", taxable_value: "Taxable Value",
  exemptions: "Exemptions", county_name: "County", acreage: "Acreage",
  living_sqft: "Living Sq Ft", sale_count: "Sale Count",
  building_count: "Building Count", owner_parcel_count: "Owner Parcel Count",
  owner_total_value: "Owner Total Value", homestead_value: "Homestead Value",
  improvement_value: "Improvement Value", sale_price_1: "Last Sale Price",
  sale_year_1: "Last Sale Year", num_units: "Units",
};

function formatValue(key, val) {
  if (val === null || val === undefined) return "\u2014";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (val instanceof Date || (typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val) && key.match(/(date|_at)$/i))) {
    const d = new Date(val);
    return isNaN(d) ? String(val) : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }
  if (typeof val === "number" && key.match(/(value|price|amount|due|fees|fine|lien)/i)) {
    return "$" + val.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }
  if (typeof val === "object") return JSON.stringify(val, null, 2);
  return String(val);
}

function RecordDetail({ record, onClose }) {
  if (!record) return null;

  const entries = Object.entries(record.fields);

  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
        background: "rgba(28,25,23,0.4)", backdropFilter: "blur(4px)",
        display: "flex", justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%", maxWidth: 560, background: C.surface, height: "100%",
          overflowY: "auto", boxShadow: "-8px 0 40px rgba(28,25,23,0.1)",
          animation: "slideIn 0.25s ease-out",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: "20px 24px", borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, background: C.surface, zIndex: 1,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: C.accent, marginBottom: 4 }}>
              {record.type.replace("_", " ")} Record
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, color: C.text }}>
              {record.fields.permit_id || record.fields.name || record.fields.license_number ||
               record.fields.owner_name || record.fields.full_name || record.fields.licensee_name ||
               record.fields.case_number || record.fields.grantee || `#${record.id}`}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: C.surfAlt, border: `1px solid ${C.border}`, borderRadius: 8,
              width: 36, height: 36, fontSize: 18, cursor: "pointer", color: C.textSoft,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = C.border; }}
            onMouseLeave={e => { e.currentTarget.style.background = C.surfAlt; }}
          >
            &times;
          </button>
        </div>

        {/* Fields */}
        <div style={{ padding: "8px 0" }}>
          {entries.map(([key, value]) => (
            <div key={key} style={{
              display: "grid", gridTemplateColumns: "160px 1fr",
              padding: "10px 24px", borderBottom: `1px solid ${C.borderLt}`,
              fontSize: 13, alignItems: "start",
            }}>
              <span style={{ color: C.textSoft, fontWeight: 600, fontSize: 12 }}>
                {FIELD_LABELS[key] || key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
              </span>
              <span style={{
                color: C.text, wordBreak: "break-word",
                fontFamily: typeof value === "number" ? "'IBM Plex Mono',monospace" : "inherit",
              }}>
                {formatValue(key, value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onLogout, getToken }) {
  const search = useAuthSearch(getToken);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openRecord = useCallback(async (sourceType, recordId) => {
    setDetailLoading(true);
    try {
      const data = await fetchRecordDetail(sourceType, recordId, getToken());
      setDetail(data);
    } catch {
      // silently fail
    } finally {
      setDetailLoading(false);
    }
  }, [getToken]);

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
        @keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
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
          <p style={{ fontSize: 14, color: C.textSoft }}>Search across all public records — full data access</p>
        </div>

        {/* Search panel */}
        <div style={{
          background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`,
          boxShadow: "0 8px 40px rgba(28,25,23,0.04)",
          overflow: "hidden", animation: "fadeUp 0.6s ease-out 0.1s both",
        }}>
          {/* Search bar */}
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.borderLt}`, display: "flex", alignItems: "center", gap: 10 }}>
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
            display: "grid", gridTemplateColumns: "140px 1fr 110px 140px 80px 60px",
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
                <div key={`${p.sourceType}-${p.recordId}-${i}`}
                  onClick={() => openRecord(p.sourceType, p.recordId)}
                  style={{
                    display: "grid", gridTemplateColumns: "140px 1fr 110px 140px 80px 60px",
                    padding: "11px 20px", fontSize: 13, alignItems: "center",
                    borderBottom: i < search.results.length - 1 ? `1px solid ${C.borderLt}` : "none",
                    transition: "background 0.15s", cursor: "pointer",
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
                    <span style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 4,
                      fontSize: 10, fontWeight: 600, color: "#FFF",
                      background: p.typeColor, letterSpacing: 0.3,
                    }}>{p.c3}</span>
                  </span>
                  <span style={{ fontSize: 12, color: C.textMid, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.c4}</span>
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
              {search.results
                ? `${search.resultCount} result${search.resultCount !== 1 ? "s" : ""} found`
                : "Ready to search"}
            </span>
            {detailLoading && (
              <span style={{ fontSize: 12, color: C.accent, animation: "pulse 1s ease-in-out infinite" }}>
                Loading record...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Record detail slide-over */}
      {detail && <RecordDetail record={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
