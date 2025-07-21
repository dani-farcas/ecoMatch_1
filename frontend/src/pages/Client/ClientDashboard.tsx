import React, { useState } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaSun,
  FaMoon,
  FaUserCircle,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";

const ClientDashboard: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🌗 Dashboard-Hintergrund und Textfarben je nach Dark Mode
  const containerStyle: React.CSSProperties = {
    backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5",
    color: darkMode ? "#f5f5f5" : "#1e1e1e",
    minHeight: "100vh",
    padding: "20px",
    position: "relative",
    fontFamily: "sans-serif",
  };

  // ☀️🌙 Toggle-Icon rechts oben
  const toggleStyle: React.CSSProperties = {
    position: "absolute",
    top: "20px",
    right: "70px",
    fontSize: "1.4rem",
    cursor: "pointer",
    color: darkMode ? "#f5f5f5" : "#333",
    zIndex: 10,
  };

  // 👤 Avatar oben rechts
  const avatarStyle: React.CSSProperties = {
    position: "absolute",
    top: "15px",
    right: "20px",
    fontSize: "2rem",
    cursor: "pointer",
    color: darkMode ? "#f5f5f5" : "#333",
    zIndex: 10,
  };

  // ⬇️ Dropdown-Menü unter Avatar
  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "60px",
    right: "20px",
    backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
    border: "1px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    width: "180px",
    zIndex: 11,
  };

  // 🔘 Stil für jeden Dropdown-Eintrag
  const dropdownItemStyle: React.CSSProperties = {
    padding: "10px 15px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.95rem",
    color: darkMode ? "#f5f5f5" : "#333",
    backgroundColor: "transparent",
  };

  // Hover-Effekt
  const dropdownItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = darkMode ? "#3a3a3a" : "#f0f0f0";
  };

  const dropdownItemLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  return (
    <div style={containerStyle}>
      {/* 🌙/☀️ Dark Mode Umschalter */}
      <div style={toggleStyle} onClick={toggleDarkMode}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </div>

      {/* 👤 Avatar für Menü */}
      <div style={avatarStyle} onClick={() => setDropdownOpen(!dropdownOpen)}>
        <FaUserCircle />
      </div>

      {/* ⬇️ Dropdown-Menü */}
      {dropdownOpen && (
        <div style={dropdownStyle}>
          <div
            style={dropdownItemStyle}
            onMouseEnter={dropdownItemHover}
            onMouseLeave={dropdownItemLeave}
            onClick={() => alert("Navigiere zu Profil-Bearbeitung")}
          >
            <FaUserEdit /> Profil bearbeiten
          </div>
          <div
            style={dropdownItemStyle}
            onMouseEnter={dropdownItemHover}
            onMouseLeave={dropdownItemLeave}
            onClick={logout}
          >
            <FaSignOutAlt /> Logout
          </div>
        </div>
      )}

      {/* 💬 Begrüßung und Info */}
      <h1 style={{ marginTop: "100px", fontSize: "1.8rem" }}>
        Willkommen im Kunden-Dashboard
      </h1>
      <p style={{ fontSize: "1rem", marginBottom: "40px" }}>
        Hier kannst du deine Anfragen verwalten oder ein neues Gesuch erstellen.
      </p>

      {/* 🔧 Zukünftige Komponenten */}
      {/* <ClientSetupForm /> */}
      {/* <RequestForm /> */}
      {/* <History /> */}
    </div>
  );
};

export default ClientDashboard;
