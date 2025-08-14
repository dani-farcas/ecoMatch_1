// 📁 src/features/auth/Signup.tsx
// 🇩🇪 Registrierungsformular mit E-Mail, Passwort, Foto-Upload

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axios";
import "./Signup.css";

const Signup: React.FC = () => {
  const navigate = useNavigate();

  // 📦 Formularfelder
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);

  // 📢 Meldungen
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

 // 📤 Foto-Upload
const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files) return; // ⛔ Falls keine Dateien ausgewählt wurden → Abbrechen

  setPhotos((prev) => [...prev, ...Array.from(files)]);
};

  // ❌ Einzelnes Foto löschen
  const removePhoto = (index: number) =>
    setPhotos((prev) => prev.filter((_, i) => i !== index));

  // 📨 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("❌ Passwörter stimmen nicht überein.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);

      photos.forEach((photo, index) => {
        formData.append(`photo_${index}`, photo);
      });

      await axios.post("/register/", formData);

      setSuccessMessage("✅ Konto erfolgreich erstellt! Bitte E-Mail bestätigen.");
      setTimeout(() => navigate("/login"), 2000);

      // Felder zurücksetzen
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhotos([]);
    } catch (error: any) {
      const backendError = error?.response?.data;
      if (backendError?.email?.[0]?.includes("registriert")) {
        setErrorMessage(
          "⚠️ Diese E-Mail ist bereits registriert. Bitte einloggen."
        );
      } else {
        setErrorMessage("❌ Registrierung fehlgeschlagen.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="confirmation-banner">{successMessage}</div>
          )}
          {errorMessage && <div className="error-banner">{errorMessage}</div>}

          <h2>Registrierung</h2>

          {/* Benutzername */}
          <label>Benutzername</label>
          <input
            type="text"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* E-Mail */}
          <label>E-Mail</label>
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Passwort */}
          <label>Passwort</label>
          <div className="signup-password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="signup-password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password-icon"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              aria-label="Passwort anzeigen/verbergen"
            >
              👁
            </span>
          </div>

          {/* Passwort bestätigen */}
          <label>Passwort bestätigen</label>
          <div className="signup-password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="signup-password-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password-icon"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              role="button"
              aria-label="Passwort anzeigen/verbergen"
            >
              👁
            </span>
          </div>

          {/* Foto-Upload */}
          <label>Fotos hochladen</label>
          <div className="signup-photo-upload-area">
            <input
              type="file"
              id="photo-upload"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
            />
            <label htmlFor="photo-upload" className="photo-upload-label">
              + Fotos auswählen
            </label>
          </div>

          {/* Foto-Vorschau */}
          <div className="photo-preview-gallery">
            {photos.map((photo, index) => (
              <div key={index} className="photo-preview-item">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Foto ${index + 1}`}
                  className="photo-preview-img"
                />
                <button
                  type="button"
                  className="photo-remove-button"
                  onClick={() => removePhoto(index)}
                  title="Foto entfernen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Absenden */}
          <button type="submit" className="signup-submit-button">
            Konto erstellen
          </button>

          {/* Login-Link */}
          <p className="signup-link">
            Bereits registriert?{" "}
            <a href="/login" onClick={() => navigate("/login")}>
              Jetzt einloggen
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
