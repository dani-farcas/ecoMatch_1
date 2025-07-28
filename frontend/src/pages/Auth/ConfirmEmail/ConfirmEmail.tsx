// 📁 src/pages/ConfirmEmail.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../../api/axios";

const ConfirmEmail: React.FC = () => {
  // 🔗 URL-Parameter uid und token aus der Route auslesen
  const { uid, token } = useParams();
  const navigate = useNavigate();

  // ✅ State für Erfolg und Statusnachricht
  const [erfolg, setErfolg] = useState(false);
  const [nachricht, setNachricht] = useState(
    "⏳ Bitte warte, deine E-Mail wird bestätigt..."
  );

  // 📌 Bestätigungsanfrage wird direkt beim Laden der Komponente ausgeführt
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // 🔍 GET-Request an Backend senden zur Bestätigung
        const response = await axios.get(`confirm-email/${uid}/${token}/`);
        setNachricht(response.data.message); // Erfolgsnachricht vom Server anzeigen
        setErfolg(true); // Erfolg auf true setzen
      } catch (err: any) {
        // ❌ Fehlerfall: Fehlermeldung anzeigen
        setNachricht(
          "❌ Die Bestätigung ist fehlgeschlagen oder der Link ist ungültig/abgelaufen."
        );
        setErfolg(false);
      }
    };

    // ✅ Nur ausführen, wenn uid und token vorhanden sind
    if (uid && token) {
      confirmEmail();
    } else {
      // ❌ Fehlende URL-Parameter melden
      setNachricht("❌ Ungültiger Bestätigungslink – fehlende Parameter.");
      setErfolg(false);
    }
  }, [uid, token]);

  // 🔒 Funktion zur Weiterleitung auf Login-Seite bei Button-Klick
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        padding: "2rem",
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      {erfolg ? (
        <>
          {/* 🎉 Erfolgsanzeige bei bestätigter Email */}
          <h2 style={{ color: "#15803d" }}>🎉 Willkommen bei ecoMatch!</h2>
          <p>{nachricht}</p>

          {/* 🔘 Button zur Weiterleitung auf Login */}
          <button
            onClick={handleLoginRedirect}
            style={{
              marginTop: "1.5rem",
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "8px",
              backgroundColor: "#2b6cb0",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Jetzt einloggen
          </button>
        </>
      ) : (
        // ❗ Fehlermeldung oder Ladeanzeige
        <p
          style={{
            color: "#dc2626",
            fontSize: "1.1rem",
          }}
        >
          {nachricht}
        </p>
      )}
    </div>
  );
};

export default ConfirmEmail;
