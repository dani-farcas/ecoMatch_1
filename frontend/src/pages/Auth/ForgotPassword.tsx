// 📁 ForgotPassword.tsx – Passwort-Zurücksetzen-Seite

import React, { useState } from "react";
import axios from "../../api/axios";
import "./ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  // 🔄 Lokale State-Variablen
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 📤 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/password-reset/", { email }); // Endpoint Backend
      setMessage("Ein Link zum Zurücksetzen wurde an deine E-Mail gesendet.");
      setError("");
    } catch {
      setError("Es ist ein Fehler aufgetreten. Bitte überprüfe deine E-Mail.");
      setMessage("");
    }
  };

  return (
    <div className="forgot-container">
      <h2 className="forgot-title">Passwort zurücksetzen</h2>

      {/* Formular */}
      <form onSubmit={handleSubmit} className="forgot-form">
        <input
          type="email"
          placeholder="E-Mail-Adresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="forgot-input"
        />
        <button type="submit" className="forgot-submit">
          Link zum Zurücksetzen senden
        </button>
      </form>

      {/* Erfolgs- oder Fehlermeldung */}
      {message && <p className="forgot-message success">{message}</p>}
      {error && <p className="forgot-message error">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
