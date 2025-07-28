// 📁 src/components/Footer/Footer.tsx

import React from 'react';
import { FaLeaf, FaUniversity, FaGlobeEurope, FaCarSide } from 'react-icons/fa';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="eco-footer">
      {/* 🔗 Links mit Icons */}
      <div className="footer-links">
        <a href="https://www.greenpeace.de/" target="_blank" rel="noopener noreferrer">
          <FaLeaf className="footer-icon" /> Greenpeace
        </a>
        <a href="https://www.bundesumweltministerium.de/" target="_blank" rel="noopener noreferrer">
          <FaUniversity className="footer-icon" /> BMUV
        </a>
        <a href="https://www.umweltbundesamt.de/" target="_blank" rel="noopener noreferrer">
          <FaGlobeEurope className="footer-icon" /> UBA
        </a>
        <a href="https://www.bmu.de/themen/luft-laerm-verkehr" target="_blank" rel="noopener noreferrer">
          <FaCarSide className="footer-icon" /> Umwelt & Verkehr
        </a>
      </div>

      {/* Trennlinie */}
      <hr className="footer-separator" />

      {/* Copy */}
      <p className="footer-copy">© 2025 ecoMatch. Alle Rechte vorbehalten.</p>
    </footer>
  );
};

export default Footer;
