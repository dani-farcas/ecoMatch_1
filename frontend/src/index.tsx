import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Optional: React Router & Contexts, dacă le folosești
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './features/Auth/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  </React.StrictMode>
);
