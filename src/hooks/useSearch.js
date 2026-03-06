import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nuoxo.com";
const AUTO_TYPE_TEXT = "vero beach building permit";
const TYPE_SPEED = 70;
const HOLD_TIME = 1500;
const ERASE_SPEED = 40;

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

const TYPE_META = {
  permit:     { label: "Permit",     color: "#16785E" },
  property:   { label: "Property",   color: "#2563EB" },
  business:   { label: "Business",   color: "#7C3AED" },
  contractor: { label: "Contractor", color: "#D97706" },
  lien:       { label: "Lien",       color: "#DC2626" },
  violation:  { label: "Violation",  color: "#EA580C" },
};

function mapResult(r) {
  const meta = TYPE_META[r.source_type] || { label: r.source_type || "Record", color: "#78716C" };
  return {
    c1: r.record_id || "\u2014",
    c2: r.display_line1 || "\u2014",
    c3: meta.label,
    c4: r.detail1 || r.detail3 || "\u2014",
    st: normalizeStatus(r.detail2),
    c6: formatAge(r.date_field),
    sourceType: r.source_type,
    typeColor: meta.color,
  };
}

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-type state
  const [autoTypeText, setAutoTypeText] = useState("");
  const [autoTypeDone, setAutoTypeDone] = useState(false);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  // Auto-typing animation on mount
  useEffect(() => {
    let cancelled = false;
    let timeout;

    async function animate() {
      // Type forward
      for (let i = 0; i <= AUTO_TYPE_TEXT.length; i++) {
        if (cancelled) return;
        await new Promise(r => { timeout = setTimeout(r, TYPE_SPEED); });
        if (cancelled) return;
        setAutoTypeText(AUTO_TYPE_TEXT.slice(0, i));
      }
      // Hold
      await new Promise(r => { timeout = setTimeout(r, HOLD_TIME); });
      if (cancelled) return;
      // Erase
      for (let i = AUTO_TYPE_TEXT.length; i >= 0; i--) {
        if (cancelled) return;
        await new Promise(r => { timeout = setTimeout(r, ERASE_SPEED); });
        if (cancelled) return;
        setAutoTypeText(AUTO_TYPE_TEXT.slice(0, i));
      }
      if (!cancelled) setAutoTypeDone(true);
    }

    animate();
    return () => { cancelled = true; clearTimeout(timeout); };
  }, []);

  // Debounced search
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

      const params = new URLSearchParams({ q: query, type: "all" });
      fetch(`${API_URL}/public/search?${params}`, { signal: controller.signal })
        .then(res => {
          if (res.status === 429) throw new Error("Too many searches. Please wait a moment.");
          if (!res.ok) throw new Error("Search unavailable.");
          return res.json();
        })
        .then(data => {
          if (!controller.signal.aborted) {
            const mapped = (data.results || []).map(mapResult);
            setResults(mapped);
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
  }, [query]);

  const clear = useCallback(() => {
    setQuery("");
    setResults(null);
    setIsLoading(false);
    setError(null);
  }, []);

  const isSearching = query.length >= 3;
  const resultCount = results ? results.length : 0;

  return {
    query,
    setQuery,
    results,
    isSearching,
    isLoading,
    error,
    resultCount,
    clear,
    autoTypeText,
    autoTypeDone,
  };
}
