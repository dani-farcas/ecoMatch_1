// 📄 src/components/HeaderLanding/HeaderLanding.tsx
// ecoMatch Kopfzeile mit globalem Avatar-Menü (SaaS-Style, lucide-react Icons)

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  CreditCard,
  Settings,
  Moon,
  Sun,
  HelpCircle,
  LogOut,
} from "lucide-react";

import logo from "@assets/pictures/logo-leaf.png";
import { useAuth } from "@/contexts/AuthContext";

import "./HeaderLanding.css";

// Avatar-Komponente: zeigt Bild, wenn vorhanden, sonst Fallback mit Initialen
const AvatarSmall: React.FC<{ src?: string; name?: string }> = ({ src, name }) => {
  if (src) {
    return <img src={src} alt="Avatar" className="avatar-img" />;
  }
   const initials = encodeURIComponent(name || "?");
  return (
    <img
      src={`https://ui-avatars.com/api/?name=${initials}&background=10b981&color=fff&size=32`}
      alt="Avatar"
      className="avatar-img"
    />
  );
};

const HeaderLanding: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [darkMode, setDarkMode] = useState(false);

  // Klick außerhalb des Dropdowns schließt Menü
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Navigation mit automatischem Schließen von Menüs
  const handleNavigate = (path: string) => {
    setMenuOpen(false);
    setUserMenuOpen(false);
    navigate(path);
  };

  // Bild-URL bereinigen (z. B. Punkt am Ende entfernen)
  const imageUrl =
    user?.profile_image?.replace(/\.$/, "") ||
    user?.avatar_url?.replace(/\.$/, "") ||
    undefined;

  return (
    <header className="landing-header">
      <div className="header-inner">
        {/* Logo links */}
        <Link to="/" className="logo" aria-label="Zur Startseite">
          <img src={logo} alt="ecoMatch Logo" className="logo-icon" />
        </Link>

        {/* Navigation rechts */}
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => handleNavigate("/")}>
            Startseite
          </Link>
          <Link to="/abo" onClick={() => handleNavigate("/abo")}>
            Abo
          </Link>

          {!isAuthenticated ? (
            <div className="nav-auth">
              <button className="login-button" onClick={() => handleNavigate("/login")}>
                Anmelden
              </button>
              <button className="register-button" onClick={() => handleNavigate("/signup")}>
                Registrieren
              </button>
            </div>
          ) : (
            <div className="user-menu" ref={userMenuRef}>
              <button
                className="avatar-btn"
                onClick={() => setUserMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
                type="button"
              >
                <AvatarSmall
                  src={imageUrl}
                  name={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || user?.email}
                />
              </button>

              {userMenuOpen && (
                <div className="user-dropdown" role="menu">
                  {/* Dashboard */}
                  <button className="ud-item" onClick={() => handleNavigate("/dashboard")}>
                    <LayoutDashboard className="ud-icon" /> Dashboard
                  </button>

                  {/* Abo */}
                  <button className="ud-item" onClick={() => handleNavigate("/abo")}>
                    <CreditCard className="ud-icon" /> Abo verwalten
                  </button>

                  <hr className="ud-sep" />

                  {/* Einstellungen */}
                  <button className="ud-item" onClick={() => handleNavigate("/settings")}>
                    <Settings className="ud-icon" /> Einstellungen
                  </button>
                  <button
                    className="ud-item"
                    onClick={() => setDarkMode((d) => !d)}
                  >
                    {darkMode ? (
                      <>
                        <Sun className="ud-icon" /> Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="ud-icon" /> Dark Mode
                      </>
                    )}
                  </button>
                  <button className="ud-item" onClick={() => handleNavigate("/hilfe")}>
                    <HelpCircle className="ud-icon" /> Hilfe
                  </button>

                  <hr className="ud-sep" />

                  {/* Logout */}
                  <button
                    className="ud-item danger"
                    onClick={() => {
                      setUserMenuOpen(false);
                      logout();
                    }}
                  >
                    <LogOut className="ud-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Burger-Menü für Mobile */}
        <div className="burger-wrapper">
          <button
            className={`burger ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menü umschalten"
            aria-expanded={menuOpen}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderLanding;
