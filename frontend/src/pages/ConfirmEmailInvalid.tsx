// 📁 src/pages/ConfirmEmailInvalid.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const ConfirmEmailInvalid: React.FC = () => {
  const navigate = useNavigate();

  // 🔁 Weiterleitung zur Registrierung
  const handleRedirect = () => {
    navigate('/signup');
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
      <h2 style={{ color: '#dc2626' }}>❌ Ungültiger Bestätigungslink</h2>
      <p style={{ fontSize: '1.1rem', maxWidth: '500px' }}>
        Dieser Link ist entweder <strong>abgelaufen</strong>, wurde bereits <strong>verwendet</strong> oder ist <strong>ungültig</strong>.
      </p>

      <button
        onClick={handleRedirect}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          borderRadius: '8px',
          backgroundColor: '#2b6cb0',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Zur Registrierung
      </button>
    </div>
  );
};

export default ConfirmEmailInvalid;
