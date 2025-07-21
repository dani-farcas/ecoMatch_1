// 📁 React-Komponenten & Hooks importieren
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from '../../api/axios';

const Signup: React.FC = () => {
  // 📌 📌 States für Formulardaten
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [role, setRole] = useState<'client' | 'provider'>('client');
  const [showPassword, setShowPassword] = useState(false);

  // 🖼️ Logo-Datei (optional)
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ⚠️ Fehler und Erfolgsmeldungen
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // 📏 Gemeinsamer Stil für Eingabefelder
  const inputBaseStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    padding: '0 0.9rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box',
    marginBottom: '1.2rem',
  };

  // 📤 Logo-Datei Vorschau aktualisieren
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 📨 Formular absenden
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== password2) {
      setError('❌ Die Passwörter stimmen nicht überein.');
      return;
    }

    // ✅ Payload vorbereiten
    const formData = {
      username,
      email,
      password,
      password2,
      is_client: role === 'client',
      is_provider: role === 'provider',
    };

    try {
      await axios.post('register/', formData);
      setSuccessMessage('✅ Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse bevor du dich einloggst.');
    } catch (err: any) {
      const backendError = err.response?.data;
      if (backendError) {
        if (typeof backendError === 'object') {
          setError(Object.values(backendError).flat().join(' '));
        } else {
          setError(backendError);
        }
      } else {
        setError('❌ Registrierung fehlgeschlagen.');
      }
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
      <form onSubmit={handleSubmit}
        style={{
          backgroundColor: 'white',
          padding: '3rem',
          borderRadius: '12px',
          boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '450px',
        }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem', color: '#111827' }}>
          Registrierung
        </h2>

        {/* Benutzername */}
        <label style={{ fontWeight: 500 }}>Benutzername</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Benutzername"
          required
          style={inputBaseStyle}
        />

        {/* E-Mail */}
        <label style={{ fontWeight: 500 }}>E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail-Adresse"
          required
          style={inputBaseStyle}
        />

        {/* Passwort */}
        <label style={{ fontWeight: 500 }}>Passwort</label>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#fff',
          height: '48px',
          marginBottom: '1.2rem',
        }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passwort"
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
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
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
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Passwort bestätigen */}
        <label style={{ fontWeight: 500 }}>Passwort bestätigen</label>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Passwort wiederholen"
          required
          style={inputBaseStyle}
        />

        {/* Rolle auswählen */}
        <label style={{ fontWeight: 500 }}>Rolle</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'client' | 'provider')}
          style={inputBaseStyle}>
          <option value="client">Kunde</option>
          <option value="provider">Dienstleister</option>
        </select>

        {/* Logo Upload */}
        <label style={{ fontWeight: 500 }}>Logo hochladen (optional)</label>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            ...inputBaseStyle,
            height: '48px',
            backgroundColor: '#fff',
            textAlign: 'left',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          {logoFile ? logoFile.name : 'Datei auswählen'}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleLogoChange}
          style={{ display: 'none' }}
        />

        {/* Logo Vorschau */}
        {logoPreview && (
          <div style={{ margin: '1rem 0', textAlign: 'center', position: 'relative' }}>
            <img
              src={logoPreview}
              alt="Logo Vorschau"
              style={{ maxWidth: '100px', borderRadius: '8px' }}
            />
            <button
              type="button"
              onClick={handleRemoveLogo}
              style={{
                position: 'absolute',
                top: '-8px',
                right: 'calc(50% - 50px)',
                background: '#dc2626',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                lineHeight: '1',
              }}
              title="Bild entfernen"
            >
              ✖
            </button>
          </div>
        )}

        {/* Fehler oder Erfolg anzeigen */}
        {error && <p style={{ color: '#dc2626', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
        {successMessage && <p style={{ color: '#15803d', marginBottom: '1rem', textAlign: 'center' }}>{successMessage}</p>}

        {/* Submit Button */}
        <button type="submit" style={{
          width: '100%',
          padding: '0.9rem',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          backgroundColor: '#15803d',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
        }}>
          Konto erstellen
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.9rem' }}>
          Bereits registriert?{' '}
          <Link to="/login" style={{ color: '#15803d', fontWeight: 'bold', textDecoration: 'none' }}>
            Jetzt einloggen
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
