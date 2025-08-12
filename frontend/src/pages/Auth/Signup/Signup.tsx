// 🟢 React + Navigation
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// 🟢 Komponenten & CSS
import axios from "@/api/axios"; // 🔁 API-Endpunkt anpassen
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

  // ✅ Erfolgsnachricht nach Registrierung
  const [confirmationMessage, setConfirmationMessage] = useState("");

  // 📤 Neue Bilder hinzufügen
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setPhotos((prev) => [...prev, ...selectedFiles]);
    }
  };

  // 🗑️ Einzelnes Foto entfernen
  const removePhoto = (indexToRemove: number) => {
    setPhotos((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // 📨 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwörter stimmen nicht überein");
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

      await axios.post("/register/", formData); // ⚠️ Pfad anpassen falls nötig

      setConfirmationMessage(
        "✅ Bitte überprüfe deine E-Mail-Adresse, um dein Konto zu aktivieren."
      );

      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setPhotos([]);
    } catch (error) {
      alert("❌ Registrierung fehlgeschlagen. Bitte versuche es erneut.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form-wrapper">
        <form className="signup-form" onSubmit={handleSubmit}>
          {confirmationMessage && (
            <div className="confirmation-banner">{confirmationMessage}</div>
          )}

          <h2>Registrierung</h2>

          {/* 👤 Benutzername */}
          <label>Benutzername</label>
          <input
            type="text"
            className="signup-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          {/* 📧 E-Mail */}
          <label>E-Mail</label>
          <input
            type="email"
            className="signup-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* 🔒 Passwort */}
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

          {/* 🔁 Passwort bestätigen */}
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

          {/* 📸 Foto-Upload */}
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

          {/* 🖼️ Vorschau-Galerie */}
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

          {/* 📤 Formular absenden */}
          <button type="submit" className="signup-submit-button">
            Konto erstellen
          </button>

          {/* 🔗 Login-Link */}
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
