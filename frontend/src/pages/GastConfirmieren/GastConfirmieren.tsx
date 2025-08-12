// 📁 frontend/src/pages/GastConfirmieren.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 🌐 Basis-URL für API
const API_URL = "http://localhost:8000/api";

const GastConfirmieren: React.FC = () => {
  const navigate = useNavigate();

  // 📦 Status: lade / erfolgreich / fehlerhaft
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    // 🔍 Token aus der URL extrahieren
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // ⛔ Kein Token vorhanden → Abbruch
    if (!token) {
      setStatus("error");
      return;
    }

    // ✅ Anfrage an Backend senden (POST)
    fetch(`${API_URL}/gast/confirm/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (res.ok) {
          // 💾 Token und E-Mail im localStorage speichern
          localStorage.setItem("gast_token", data.token);
          localStorage.setItem("gast_email", data.email);

          setStatus("success");

          // 🔁 Weiterleitung zur Anfrage-Seite nach kurzer Wartezeit
          setTimeout(() => navigate("/gast-anfrage"), 2000);
        } else {
          // ❌ Backend meldet ungültig
          setStatus("error");
        }
      })
      .catch(() => {
        // ❌ Netzwerkfehler o.Ä.
        setStatus("error");
      });
  }, [navigate]);

  return (
    <div style={{ padding: "3rem", textAlign: "center" }}>
      {status === "loading" && <p>⏳ Bestätigung wird verarbeitet...</p>}
      {status === "success" && <p>✅ E-Mail erfolgreich bestätigt. Weiterleitung...</p>}
      {status === "error" && <p>❌ Ungültiger oder abgelaufener Link.</p>}
    </div>
  );
};

export default GastConfirmieren;
