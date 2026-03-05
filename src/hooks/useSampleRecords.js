import { useState, useEffect } from "react";

const FALLBACK_RECORDS = [
  { c1: "IRC-26-04821", c2: "1420 NE Jensen Beach Blvd", c3: "Building Permit", c4: "$2.4M", st: "active", c6: "3d" },
  { c1: "SLC-26-09184", c2: "3250 S US Highway 1, Fort Pierce", c3: "Code Violation", c4: "\u2014", st: "active", c6: "5d" },
  { c1: "DAD-26-31772", c2: "8400 NW 36th St, Doral", c3: "New Construction", c4: "$4.1M", st: "active", c6: "1d" },
  { c1: "BRV-26-33091", c2: "7890 N Wickham Rd, Melbourne", c3: "Lien Filing", c4: "$45K", st: "review", c6: "7d" },
  { c1: "HLS-26-18204", c2: "3100 W Gandy Blvd, Tampa", c3: "Contractor License", c4: "\u2014", st: "complete", c6: "12d" },
];

const API_URL = import.meta.env.VITE_API_URL || "https://api.nuoxo.com";

export default function useSampleRecords() {
  const [records, setRecords] = useState(FALLBACK_RECORDS);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch(`${API_URL}/public/sample-records`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.records && data.records.length > 0) {
          const mapped = data.records.map((r) => ({
            c1: r.record_id,
            c2: r.city,
            c3: r.record_type,
            c4: r.value_bucket,
            st: r.status,
            c6: r.age_label,
          }));
          setRecords(mapped);
        }
        // If empty array returned, keep fallback
      })
      .catch(() => {
        // Silently fall back to hardcoded data on any failure
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);

  return records;
}
