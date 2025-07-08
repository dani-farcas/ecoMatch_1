import React, { useState } from 'react';
import axios from '../../api/axios';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/password-reset/', { email }); // endpoint backend
      setMessage('Emailul pentru resetare a fost trimis. Verifică inboxul.');
      setError('');
    } catch (err) {
      setError('A apărut o eroare. Verifică emailul introdus.');
      setMessage('');
    }
  };

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: 'auto',
        padding: '2rem',
        backgroundColor: '#f4f4f4',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        marginTop: '5rem',
      }}
    >
      <h2 style={{ textAlign: 'center' }}>Resetare parolă</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Adresa de email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '0.7rem',
            borderRadius: '4px',
            backgroundColor: '#007bff',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
          }}
        >
          Trimite link de resetare
        </button>
      </form>
      {message && <p style={{ color: 'green', marginTop: '1rem', textAlign: 'center' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default ForgotPassword;
