// ✅ Komplett überarbeitete LandingPage mit Chatbot
import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

// 📦 Assets
import solarIcon from "@assets/icon/solar-panel.png";
import houseIcon from "@assets/icon/eco-house.png";
import planetIcon from "@assets/icon/planet-earth.png";
import Oli from "@assets/Testimonial/Oli.png";

// 🧱 Wiederverwendbare Komponenten


const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">

      {/* 🌄 Hauptbotschaft mit Hintergrundbild */}
      <section className="hero-section">
        <h1>
          Wir verbinden
          <br />
          Gemeinschaften mit
          <br />
          lokalen Öko-Lösungen
        </h1>
        <button
          className="cta-button"
          onClick={() => navigate("/gast-start")}
        >
          Kostenlos starten als Gast
        </button>
      </section>

      {/* 🧩 Dienstleistungen */}
     <section className="services-section">
  <a href="https://www.solarwirtschaft.de/" target="_blank" rel="noopener noreferrer" className="service-card">
    <img src={solarIcon} alt="Solar" />
    <h3>Solaranlagen</h3>
    <p>Umfassende Lösungen mit Bussystem für Ihr Zuhause</p>
  </a>

  <a href="https://www.verbraucherzentrale.de/wissen/energie/energiesparen" target="_blank" rel="noopener noreferrer" className="service-card">
    <img src={houseIcon} alt="Beratung" />
    <h3>Energieberatung</h3>
    <p>Unabhängige Beratung, Kosten sparen</p>
  </a>

  <a href="https://www.umweltbundesamt.de/themen/nachhaltigkeit-strategien/nachhaltige-entwicklung" target="_blank" rel="noopener noreferrer" className="service-card">
    <img src={planetIcon} alt="Nachhaltig" />
    <h3>Nachhaltige Projekte</h3>
    <p>Grüne Projekte lokal umsetzen, Umwelt schützen</p>
  </a>
</section>


      {/* 💬 Kundenmeinung */}
      <section className="testimonial-section">
        <img src={Oli} alt="Kunde" />
        <p>
          „Mit ecoMatch haben wir den perfekten lokalen Partner für unser
          Solarprojekt gefunden. Sehr empfehlenswert“
        </p>
        <strong>Oliver Schaaf</strong>
      </section>
    </div>
  );
};

export default LandingPage;
