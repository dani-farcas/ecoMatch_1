import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import jwtDecode from "jwt-decode";
import "./Login.css";

// 🔐 Struktur des JWT-Tokens
interface DecodedToken {
  username: string;
  is_client?: boolean;
  is_provider?: boolean;
  exp: number;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [benutzername, setBenutzername] = useState("");
  const [passwort, setPasswort] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fehler, setFehler] = useState("");
  const [laden, setLaden] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFehler("");
    setLaden(true);

    try {
      await login(benutzername, passwort);
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decoded = jwtDecode(token) as DecodedToken;
        if (decoded.is_client) {
          navigate("/dashboard/client");
        } else if (decoded.is_provider) {
          navigate("/dashboard/provider");
        } else {
          navigate("/");
        }
      } else {
        setFehler("❌ Kein Token erhalten – bitte erneut versuchen.");
      }
    } catch (err: any) {
      setFehler(err.message || "Unbekannter Fehler.");
    } finally {
      setLaden(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Anmeldung</h2>

        <label className="login-label">Benutzername</label>
        <input
          type="text"
          value={benutzername}
          onChange={(e) => setBenutzername(e.target.value)}
          placeholder="E-Mail oder Benutzername"
          required
          className="login-input"
        />

        <label className="login-label">Passwort</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            placeholder="********"
            required
            className="password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="toggle-button"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className="forgot-link">
          <Link to="/forgot-password">Passwort vergessen?</Link>
        </div>

        {fehler && <p className="error-message">{fehler}</p>}

        <button type="submit" disabled={laden} className="submit-button">
          {laden ? "Bitte warten..." : "Einloggen"}
        </button>

        <div className="register-hinweis">
          Noch kein Konto?{" "}
          <Link to="/signup" className="register-link">
            Jetzt registrieren
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
