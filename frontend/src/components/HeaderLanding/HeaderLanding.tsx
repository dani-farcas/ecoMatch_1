// 🟢 HeaderLanding.tsx – Wiederverwendbare Kopfzeile der LandingPage
import React, { useState } from "react";
import "./HeaderLanding.css";
import logo from "@assets/pictures/logo-leaf.png";
import { Link, useNavigate } from "react-router-dom";

const HeaderLanding: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔁 Menü schließen und zur Zielseite navigieren
  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  // 🧭 Menü beim Klick auf Link schließen
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="landing-header">
      {/* 🌿 Logo mit Link zur Startseite */}
      <Link to="/" className="logo" onClick={handleLinkClick}>
        <img src={logo} alt="ecoMatch Logo" className="logo-icon" />
      </Link>

      {/* 🧭 Navigation + Buttons */}
      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={handleLinkClick}>Startseite</Link>
        <Link to="/#funktioniert" onClick={handleLinkClick}>So funktioniert’s</Link>
        <Link to="/abo" onClick={handleLinkClick}>Abo</Link>

        <div className="header-buttons">
          <button className="login-button" onClick={() => handleNavigate("/login")}>
            Anmelden
          </button>
          <button className="register-button" onClick={() => handleNavigate("/signup")}>
            Registrieren
          </button>
        </div>
      </nav>

      {/* 🍔 Burger-Menü für Mobilgeräte */}
      <div className="burger" onClick={() => setMenuOpen(!menuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
};

export default HeaderLanding;
