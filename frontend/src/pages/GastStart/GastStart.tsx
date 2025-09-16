// GastStart.tsx – Email + Datenschutz Formular
import React, { useState, useEffect, useRef } from "react";
import "./GastStart.css";

const GastStart: React.FC = () => {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!consent) {
      alert("Bitte stimmen Sie der Datenschutzbestimmung zu.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    localStorage.setItem("gast_email", email);

    try {
      setStatus("loading");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/gast/initiate/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true }),
      });

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
            ref={emailRef}
          />

          <label className="checkbox-inline">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            Ich stimme der&nbsp;
            <a href="/datenschutz" target="_blank" rel="noopener noreferrer">
              Datenschutzbestimmung
            </a>
            &nbsp;zu.
          </label>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={status === "loading"}
            aria-busy={status === "loading"}
          >
            {status === "loading" ? "Sende..." : "Weiter zur Anfrage"}
          </button>

          {status === "success" && (
            <p className="erfolg">Bitte überprüfen Sie Ihre E-Mail.</p>
          )}
          {status === "error" && (
            <p className="fehler">Fehler beim Senden. Bitte erneut versuchen.</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default GastStart;
