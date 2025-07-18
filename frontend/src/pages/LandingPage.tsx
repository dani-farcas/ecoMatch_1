import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaLeaf } from "react-icons/fa";
import "./LandingPage.css";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="logo-title" onClick={() => navigate("/")}>
          <FaLeaf className="leaf-icon" />
          <span className="logo-text">ecoMatch</span>
        </div>

        <h1 className="slogan">
          wo professionelle Hilfe <br /> und Umweltbewusstsein <br /> sich
          treffen.
        </h1>

        <input
          type="email"
          placeholder="E-Mail-Adresse"
          className="input-field"
        />
        <input type="password" placeholder="Passwort" className="input-field" />

        <div className="forgot-password">
          <Link to="/reset-password">Passwort vergessen?</Link>
        </div>

        <div className="button-group">
          <button
            className="login-button"
            onClick={() => navigate("/dashboard")}
          >
            Einloggen
          </button>
          <button className="guest-button" onClick={() => navigate("/guest")}>
            Gast
          </button>
        </div>

        <div className="register-section">
          Noch kein Konto?{" "}
          <Link to="/signup" className="register-link">
            Jetzt registrieren
          </Link>
        </div>

        <footer className="footer">© 2025 ecoMatch</footer>
      </div>
    </div>
  );
};

export default LandingPage;
