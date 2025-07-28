// 🟢 GastStart.tsx – Email + Datenschutz Formular
import React, { useState } from "react";
import "./GastStart.css";

const GastStart: React.FC = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      alert("Bitte stimmen Sie der Datenschutzbestimmung zu.");
      return;
    }

    try {
      setStatus("loading");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/gast/initiate/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, consent: true }),
        }
      );

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error("Fehler beim Senden:", err);
      setStatus("error");
    }
  };

  return (
    <div className="gaststart-container">
      <div className="gaststart-form-wrapper">
        <form className="gaststart-form" onSubmit={handleSubmit}>
          <h2>Kostenlose Anfrage starten</h2>

          <input
            type="email"
            name="email"
            placeholder="Ihre E-Mail-Adresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="gaststart-input"
            required
          />

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="consent"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            Ich stimme der{" "}
            <a href="/datenschutz" target="_blank">
              Datenschutzbestimmung
            </a>{" "}
            zu.
          </label>

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Sende..." : "Weiter zur Anfrage"}
          </button>

          {status === "success" && (
            <p className="erfolg">Bitte überprüfen Sie Ihre E-Mail.</p>
          )}
          {status === "error" && (
            <p className="fehler">
              Fehler beim Senden. Bitte erneut versuchen.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default GastStart;
