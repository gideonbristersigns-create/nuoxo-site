import { useState, useCallback, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nuoxo.com";

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [selectedRecord, setSelectedRecord] = useState(null);

  const controllerRef = useRef(null);
  const debounceRef = useRef(null);

  const executeSearch = useCallback((q, type) => {
    // Cancel any in-flight request
    if (controllerRef.current) controllerRef.current.abort();

    if (!q || q.length < 3) {
      setResults([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;
    setStatus("loading");

    const params = new URLSearchParams({ q, type });
    fetch(`${API_URL}/public/search?${params}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setResults(data.results || []);
        setStatus("done");
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setResults([]);
        setStatus("error");
      });
  }, []);

  const handleQueryChange = useCallback((value) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      executeSearch(value, searchType);
    }, 300);
  }, [searchType, executeSearch]);

  const handleTypeChange = useCallback((type) => {
    setSearchType(type);
    if (query.length >= 3) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      executeSearch(query, type);
    }
  }, [query, executeSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) controllerRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return {
    query,
    searchType,
    results,
    status,
    selectedRecord,
    setSelectedRecord,
    handleQueryChange,
    handleTypeChange,
  };
}
