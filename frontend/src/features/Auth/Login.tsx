// 📁 src/pages/Login.tsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import jwtDecode from 'jwt-decode';

// 🔐 Struktur des JWT-Tokens
interface DecodedToken {
  username: string;
  is_client?: boolean;
  is_provider?: boolean;
  exp: number;
}

const Login: React.FC = () => {
  const { login } = useAuth();  // 🔐 login kommt aus AuthContext
  const navigate = useNavigate();

  // 📥 Formularzustände
  const [benutzername, setBenutzername] = useState('');
  const [passwort, setPasswort] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fehler, setFehler] = useState('');
  const [laden, setLaden] = useState(false);

  // 🚀 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFehler('');
    setLaden(true);

    try {
      // 🔐 login() ruft /token/ auf und speichert Tokens im localStorage
      await login(benutzername, passwort);

      // 📦 accessToken holen und JWT dekodieren
      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token) as DecodedToken;

        // 🔀 Je nach Rolle zum passenden Dashboard navigieren
        if (decoded.is_client) {
          navigate('/dashboard/client');
        } else if (decoded.is_provider) {
          navigate('/dashboard/provider');
        } else {
          navigate('/');
        }
      } else {
        setFehler('❌ Kein Token erhalten – bitte erneut versuchen.');
      }
    } catch (err: any) {
      setFehler(err.message || 'Unbekannter Fehler.');
    } finally {
      setLaden(false);
    }
  };

  return (
    <div style={{
      backgroundColor: '#ecfdf5',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'sans-serif',
      padding: '2rem',
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        padding: '3rem',
        borderRadius: '12px',
        boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem', color: '#111827' }}>
          Anmeldung
        </h2>

        <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 500 }}>
          Benutzername
        </label>
        <input
          type="text"
          value={benutzername}
          onChange={(e) => setBenutzername(e.target.value)}
          placeholder="E-Mail oder Benutzername"
          required
          style={{
            width: '100%',
            padding: '0 0.9rem',
            marginBottom: '1.8rem',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '1rem',
            height: '48px',
            boxSizing: 'border-box',
          }}
        />

        <label style={{ marginBottom: '0.5rem', display: 'block', fontWeight: 500 }}>
          Passwort
        </label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1.8rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fff',
          height: '48px',
        }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            placeholder="********"
            required
            style={{
              flex: 1,
              padding: '0 0.9rem',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              height: '100%',
              borderRadius: '8px 0 0 8px',
            }}
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
            height: '100%',
            padding: '0 1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#444',
            borderLeft: '1px solid #ccc',
            borderRadius: '0 8px 8px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#15803d' }}>
            Passwort vergessen?
          </Link>
        </div>

        {fehler && (
          <p style={{ color: '#dc2626', marginBottom: '1.5rem', textAlign: 'center' }}>{fehler}</p>
        )}

        <button type="submit" disabled={laden} style={{
          width: '100%',
          padding: '0.9rem',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          backgroundColor: '#15803d',
          color: 'white',
          cursor: laden ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          marginBottom: '2rem',
        }}>
          {laden ? 'Bitte warten...' : 'Einloggen'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Noch kein Konto?{' '}
          <Link to="/signup" style={{ color: '#15803d', fontWeight: 'bold', textDecoration: 'none' }}>
            Jetzt registrieren
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
