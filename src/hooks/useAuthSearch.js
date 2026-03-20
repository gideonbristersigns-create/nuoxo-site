import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nuoxo.com";

const TYPE_META = {
  permit:       { label: "Permit",       color: "#16785E" },
  property:     { label: "Property",     color: "#2563EB" },
  business:     { label: "Business",     color: "#7C3AED" },
  contractor:   { label: "Contractor",   color: "#D97706" },
  lien:         { label: "Lien",         color: "#DC2626" },
  violation:    { label: "Violation",    color: "#EA580C" },
  owner:        { label: "Owner",        color: "#0369A1" },
  cfo_license:  { label: "CFO License",  color: "#6D28D9" },
  dbpr_license: { label: "DBPR License", color: "#9333EA" },
  sale:         { label: "Sale",         color: "#0891B2" },
};

function normalizeStatus(raw) {
  if (!raw) return "complete";
  const s = raw.toLowerCase().replace(/[^a-z ]/g, "").trim();
  if (s.includes("issued") || s.includes("active") || s.includes("approved") || s === "a" || s.includes("open")) return "active";
  if (s.includes("pending") || s.includes("review") || s.includes("hold")) return "review";
  return "complete";
}

function formatAge(dateStr) {
  if (!dateStr) return "\u2014";
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 0) return "now";
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;
  const years = Math.floor(days / 365);
  return `${years}y`;
}

function mapResult(r) {
  const meta = TYPE_META[r.source_type] || { label: r.source_type || "Record", color: "#78716C" };
  return {
    c1: r.permit_id || r.record_id || "\u2014",
    c2: r.display_line1 || "\u2014",
    c3: meta.label,
    c4: r.detail1 || r.detail3 || "\u2014",
    c5: r.detail2 || "\u2014",
    st: normalizeStatus(r.detail2),
    c6: formatAge(r.date_field),
    sourceType: r.source_type,
    typeColor: meta.color,
    recordId: r.record_id,
  };
}

export default function useAuthSearch(getToken) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jurisdiction, setJurisdiction] = useState("");
  const [jurisdictions, setJurisdictions] = useState([]);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  // Fetch jurisdictions on mount
  useEffect(() => {
    fetch(`${API_URL}/public/jurisdictions`)
      .then(res => res.ok ? res.json() : { jurisdictions: [] })
      .then(data => setJurisdictions(data.jurisdictions || []))
      .catch(() => {});
  }, []);

  // Debounced search using authenticated endpoint
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (controllerRef.current) controllerRef.current.abort();

    if (!query || query.length < 3) {
      setResults(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    debounceRef.current = setTimeout(() => {
      const controller = new AbortController();
      controllerRef.current = controller;

      const token = getToken();
      const params = new URLSearchParams({ q: query, type: "all" });
      if (jurisdiction) params.set("jurisdiction", jurisdiction);

      fetch(`${API_URL}/v1/search?${params}`, {
        signal: controller.signal,
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => {
          if (res.status === 401) throw new Error("Session expired. Please log in again.");
          if (res.status === 429) throw new Error("Too many searches. Please wait a moment.");
          if (!res.ok) throw new Error("Search unavailable.");
          return res.json();
        })
        .then(data => {
          if (!controller.signal.aborted) {
            setResults((data.results || []).map(mapResult));
            setIsLoading(false);
          }
        })
        .catch(err => {
          if (err.name === "AbortError") return;
          setError(err.message || "Search unavailable.");
          setResults(null);
          setIsLoading(false);
        });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (controllerRef.current) controllerRef.current.abort();
    };
  }, [query, jurisdiction, getToken]);

  const clear = useCallback(() => {
    setQuery("");
    setResults(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    query, setQuery,
    results,
    isLoading,
    error,
    resultCount: results ? results.length : 0,
    clear,
    jurisdiction, setJurisdiction,
    jurisdictions,
  };
}

// Fetch full record detail
export async function fetchRecordDetail(type, id, token) {
  const res = await fetch(`${API_URL}/v1/records/${type}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to load record");
  return res.json();
}
