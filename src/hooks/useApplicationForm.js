import { useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://api.nuoxo.com";

const INITIAL_STATE = {
  email: "",
  company_name: "",
  vertical: "",
  market: "",
  website: "", // honeypot
};

export default function useApplicationForm() {
  const [fields, setFields] = useState(INITIAL_STATE);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMessage, setErrorMessage] = useState("");

  const setField = useCallback((name, value) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  }, []);

  const validate = useCallback(() => {
    if (!fields.email || !fields.email.includes("@")) return "Please enter a valid email.";
    if (!fields.company_name.trim()) return "Company name is required.";
    if (!fields.vertical.trim()) return "Please select a vertical.";
    if (!fields.market.trim()) return "Please enter your market.";
    if (!turnstileToken) return "Please complete the verification.";
    return null;
  }, [fields, turnstileToken]);

  const submit = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_URL}/public/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.email,
          company_name: fields.company_name,
          vertical: fields.vertical,
          market: fields.market,
          website: fields.website,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
      } else {
        setErrorMessage(data.error || "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }, [fields, turnstileToken, validate]);

  return {
    fields,
    setField,
    turnstileToken,
    setTurnstileToken,
    status,
    errorMessage,
    submit,
    canSubmit: !!turnstileToken && status !== "submitting",
  };
}
