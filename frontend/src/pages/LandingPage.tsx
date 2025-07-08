import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaLeaf, FaHandshake, FaCheck } from 'react-icons/fa';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();


  return (
    <div className="page">
      <header className="header">
        <div className="logo" onClick={() => navigate('/')}>
          <FaLeaf />
          ecoMatch
        </div>
        <button className="login-button" onClick={() => navigate('/login')}>
          Anmelden
        </button>
      </header>

      <main className="container">
        <div className="card">
          <h1 className="title">
            Finden Sie lokale umweltfreundliche Dienstleister
          </h1>
          <p className="subtitle">
            Vernetzen Sie sich mit vertrauenswürdigen Anbietern nachhaltiger
            Lösungen in Ihrer Region.
          </p>
          <button className="start-button" onClick={() => navigate('/signup')}>
            Jetzt starten
          </button>

          <h2 className="title-small">Unsere Abonnements</h2>
          <div className="services-container">
            <div className="service-card">
              <FaLeaf className="service-icon" />
              <strong>Basis</strong>
              <p>14 Tage kostenlos testen. Danach eingeschränkter Zugang.</p>
              <Link to="/abo/basis" className="start-button">
                Mehr erfahren
              </Link>
            </div>
            <div className="service-card">
              <FaHandshake className="service-icon" />
              <strong>Profi</strong>
              <p>Bevorzugte Vermittlung & volles öffentliches Profil.</p>
              <Link to="/abo/profi" className="start-button">
                Mehr erfahren
              </Link>
            </div>
            <div className="service-card">
              <FaCheck className="service-icon" />
              <strong>Premium</strong>
              <p>Alle Funktionen inkl. Statistik, Support & Top-Platzierung.</p>
              <Link to="/abo/premium" className="start-button">
                Mehr erfahren
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        © 2025 ecoMatch. Alle Rechte vorbehalten.
        <div className="footer-links">
          <span className="link" onClick={() => navigate('/impressum')}>
            Impressum
          </span>
          <span className="link" onClick={() => navigate('/datenschutz')}>
            Datenschutz
          </span>
          <span className="link" onClick={() => navigate('/kontakt')}>
            Kontakt
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
