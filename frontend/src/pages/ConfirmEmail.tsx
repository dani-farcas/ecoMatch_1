// 📁 src/pages/ConfirmEmail.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // 🔗 Vorgefertigte Axios-Instanz mit Basis-URL

const ConfirmEmail: React.FC = () => {
  // 🔍 UID & Token aus der URL extrahieren
  const { uid, token } = useParams();
  const navigate = useNavigate();

  // 🔄 Zustände für Erfolg oder Fehler
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // ⏱️ Automatischer Bestätigungsversuch beim Laden der Seite
  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // 📡 Anfrage an das Backend zur E-Mail-Bestätigung
        await axios.get(`confirm-email/${uid}/${token}/`);
        setSuccess(true);
      } catch (err: any) {
        // ❌ Fehlerbehandlung bei ungültigem oder abgelaufenem Link
        setError('❌ Die Bestätigung ist fehlgeschlagen oder der Link ist ungültig oder abgelaufen.');
      }
    };

    // ✅ Nur starten, wenn Parameter vorhanden sind
    if (uid && token) {
      confirmEmail();
    } else {
      setError('❌ Ungültiger Bestätigungslink – Parameter fehlen.');
    }
  }, [uid, token]);

  // 🔁 Weiterleitung zur Login-Seite
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      {success ? (
        <>
          <h2 style={{ color: '#15803d' }}>🎉 Willkommen bei ecoMatch!</h2>
          <p>Deine E-Mail-Adresse wurde erfolgreich bestätigt.</p>
          <button
            onClick={handleLoginRedirect}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              borderRadius: '8px',
              backgroundColor: '#2b6cb0',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Jetzt einloggen
          </button>
        </>
      ) : (
        <p
          style={{
            color: error ? '#dc2626' : '#555',
            fontSize: '1.1rem',
          }}
        >
          {error || '⏳ Bitte warte, dein Konto wird bestätigt...'}
        </p>
      )}
    </div>
  );
};

export default ConfirmEmail;
