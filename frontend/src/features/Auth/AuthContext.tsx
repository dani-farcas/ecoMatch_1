// 📁 src/features/auth/AuthContext.tsx

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

// 🧾 Typdefinition für den AuthContext
interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// 🎯 Initialwert des Contexts
const AuthContext = createContext<AuthContextType>({
  login: async () => {},
  logout: () => {},
  isAuthenticated: false,
});

// 🧠 Custom Hook für globalen Zugriff
export const useAuth = () => useContext(AuthContext);

// 📦 Provider-Komponente für AuthContext
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // 🔐 Zustand für Authentifizierung
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔑 Login-Funktion – speichert Tokens im localStorage
  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post('token/', {
        username,
        password,
      });

      // ✅ Tokens speichern
      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setIsAuthenticated(true); // Benutzer ist jetzt angemeldet
    } catch (error: any) {
      throw new Error(
        error.response?.data?.detail || 'Login fehlgeschlagen.'
      );
    }
  };

  // 🚪 Logout-Funktion – entfernt Tokens und navigiert zum Login
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // 🔄 Prüft beim Laden, ob ein Token vorhanden ist
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
