import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import leafLogo from '../../assets/pictures/logo-leaf.png';
import backgroundImage from '../../assets/pictures/bg-landingpage.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="landing-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {/* ✅ Header Bereich */}
      <header className="header">
        <Link to="/" className="logo">
          <img src={leafLogo} alt="ecoMatch Logo" className="logo-icon" />
        </Link>

        {/* ✅ Desktop Navigation */}
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/login">Anmelden</Link>
          <Link to="/signup">Registrieren</Link>
          <Link to="/about">Über uns</Link>
          <Link to="/contact">Kontakt</Link>
        </nav>

        {/* ✅ Burger-Menü */}
        <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </div>

        {/* ✅ Mobile Slide-Menü */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Anmelden</Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}>Registrieren</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>Über uns</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Kontakt</Link>
        </div>
      </header>

      {/* ✅ Hauptbereich */}
      <main className="main-content">
        {/* ✅ Ads Links */}
        <div className="ads-left">
          <div className="ad-card">
            <a href="https://ibu-ruehl.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://ibu-ruehl.de/wp-content/uploads/2021/03/IBU-Logo.svg" alt="IBU Rühl" className="ad-logo" />
              <p>IBU Rühl GmbH</p>
              <button>Zur Webseite</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://www.ibc-solar.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://www.ibc-solar.de/fileadmin/user_upload/ibc-solar-logo.svg" alt="IBC Solar" className="ad-logo" />
              <p>IBC Solar AG</p>
              <button>Mehr erfahren</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://www.sma.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://www.sma.de/fileadmin/_processed_/9/6/csm_SMA_Logo_RGB_300dpi_920x548_bbc14cfc7e.png" alt="SMA Solar" className="ad-logo" />
              <p>SMA Solar Technology</p>
              <button>Details</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://sunhero.com/de" target="_blank" rel="noopener noreferrer">
              <img src="https://sunhero.com/icons/logo-sunhero.svg" alt="Sunhero" className="ad-logo" />
              <p>Sunhero GmbH</p>
              <button>Projekt leben</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://solar-distribution.baywa-re.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://solar-distribution.baywa-re.de/fileadmin/user_upload/solar-distribution/Logos/2022/BayWa_r.e._Logo_RGB.svg" alt="BayWa r.e." className="ad-logo" />
              <p>BayWa r.e. Solar</p>
              <button>Mehr Infos</button>
            </a>
          </div>
        </div>

        {/* ✅ Login Bereich */}
        <div className="center-login">
          <h1>Wo professionelle Hilfe<br />und Umweltbewusstsein<br />sich treffen.</h1>
          <input type="email" placeholder="E-Mail-Adresse" />
          <input type="password" placeholder="Passwort" />
          <Link to="/forgot-password" className="forgot-link">Passwort vergessen?</Link>
          <button className="btn-login" onClick={() => navigate('/dashboard')}>Einloggen</button>
          <button className="btn-guest" onClick={() => navigate('/guest')}>Gast</button>
          <p>Noch kein Konto? <Link to="/signup" className="register-link">Jetzt registrieren</Link></p>
        </div>

        {/* ✅ Ads Rechts */}
        <div className="ads-right">
          <div className="ad-card">
            <a href="https://enpal.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://enpal.de/logo192.png" alt="Enpal" className="ad-logo" />
              <p>Enpal GmbH</p>
              <button>Zur Webseite</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://www.e3dc.com/" target="_blank" rel="noopener noreferrer">
              <img src="https://www.e3dc.com/fileadmin/_processed_/e/5/csm_E3DC_RGB_e3b38d93f2.png" alt="E3/DC" className="ad-logo" />
              <p>E3/DC GmbH</p>
              <button>Mehr erfahren</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://www.solarwatt.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://www.solarwatt.de/logo.svg" alt="Solarwatt" className="ad-logo" />
              <p>Solarwatt GmbH</p>
              <button>Projekt ansehen</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://www.viessmann.de/de/wohngebaeude/photovoltaik.html" target="_blank" rel="noopener noreferrer">
              <img src="https://www.viessmann.de/etc.clientlibs/viessmann/clientlibs/clientlib-base/resources/images/logo.svg" alt="Viessmann" className="ad-logo" />
              <p>Viessmann Photovoltaik</p>
              <button>Mehr Infos</button>
            </a>
          </div>
          <div className="ad-card">
            <a href="https://www.maxsolar.de/" target="_blank" rel="noopener noreferrer">
              <img src="https://www.maxsolar.de/wp-content/uploads/2022/02/logo.svg" alt="MaxSolar" className="ad-logo" />
              <p>MaxSolar GmbH</p>
              <button>Zur Webseite</button>
            </a>
          </div>
        </div>
      </main>

      {/* ✅ Footer */}
      <footer className="footer">
        <p>© 2025 ecoMatch</p>
      </footer>
    </div>
  );
};

export default LandingPage;
