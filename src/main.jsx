import { createRoot } from "react-dom/client";
import { useState } from "react";
import useAuth from "./hooks/useAuth.js";
import NuoxoFinal from "./NuoxoFinal.jsx";
import LoginPage from "./LoginPage.jsx";
import Dashboard from "./Dashboard.jsx";

function App() {
  const auth = useAuth();
  const [page, setPage] = useState("landing"); // landing | login

  if (auth.loading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "#FFFBF5", fontFamily: "'Satoshi','Inter',-apple-system,sans-serif",
        color: "#78716C", fontSize: 14,
      }}>
        Loading...
      </div>
    );
  }

  // Authenticated — show dashboard
  if (auth.user) {
    return <Dashboard user={auth.user} onLogout={auth.logout} />;
  }

  // Login page
  if (page === "login") {
    return (
      <LoginPage
        onLogin={auth.login}
        onBack={() => setPage("landing")}
      />
    );
  }

  // Landing page (default)
  return <NuoxoFinal onLoginClick={() => setPage("login")} />;
}

createRoot(document.getElementById("root")).render(<App />);
