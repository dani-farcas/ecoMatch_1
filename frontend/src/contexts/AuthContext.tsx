// 📁 src/contexts/AuthContext.tsx
// 🌍 Globaler Authentifizierungskontext inkl. Benutzerobjekt und JWT-Handling

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

// 🧾 Minimales Benutzermodell – Felder müssen mit Backend übereinstimmen
export type AuthUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  has_providerprofile: boolean;
  initials?: string;
  profile_image?: string;
  avatar_url?: string;
};

// 🔑 Struktur des Auth-Kontextes
type AuthContextType = {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  user: AuthUser | null;
  refreshUser: () => Promise<void>;
};

// 🟢 Initialisierung des Kontextes
const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
  user: null,
  refreshUser: async () => {},
});

// 📌 Custom Hook zur Nutzung des Kontexts
export const useAuth = () => useContext(AuthContext);

// 🏗️ Provider-Komponente
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  // Hilfsfunktion: Authorization-Header für axios setzen oder löschen
  const setAuthHeader = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Benutzerprofil vom Backend laden
  const refreshUser = async () => {
    try {
      const res = await axios.get<AuthUser>("me/");
      setUser(res.data);
    } catch (error) {
      logout();
    }
  };

  // Login mit Benutzername/Email + Passwort
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post("token/", {
        username: username.trim(),
        password,
      });

      const access = response.data.access as string;
      const refresh = response.data.refresh as string;

      // Tokens einheitlich speichern
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      setAuthHeader(access);
      setIsAuthenticated(true);
      await refreshUser();

      navigate("/"); // Nach Login auf Startseite
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.detail || "Login fehlgeschlagen."
      );
    }
  };

  // Benutzer ausloggen: Tokens löschen und zurück zum Login
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setAuthHeader(null);
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // Beim Laden der App prüfen, ob Token existiert → falls ja: User laden
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (token) {
      setAuthHeader(token);
      setIsAuthenticated(true);
      refreshUser();
    } else {
      setAuthHeader(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{ login, logout, isAuthenticated, user, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
