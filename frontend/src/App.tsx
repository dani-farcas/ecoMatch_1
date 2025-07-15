import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './features/Auth/AuthContext';
import { DarkModeProvider } from './contexts/DarkModeContext';

import LandingPage from './pages/LandingPage';
import AboDetailPage from './pages/AboDetailPage';
import Login from './features/Auth/Login';
import Signup from './features/Auth/Signup';
import ForgotPassword from './features/Auth/ForgotPassword';
import ConfirmEmail from './pages/ConfirmEmail';
import ConfirmEmailInvalid from './pages/ConfirmEmailInvalid';

import ProtectedRoute from './features/Auth/ProtectedRoute';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';

const App: React.FC = () => {
  console.log('DEBUG: VITE_API_URL =', import.meta.env.VITE_API_URL);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <Routes>
          {/* Öffentliche Seiten */}
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-email/:uid/:token/" element={<ConfirmEmail />} />
          <Route path="/confirm-email/invalid" element={<ConfirmEmailInvalid />} />
          <Route path="/abo/:plan" element={<AboDetailPage />} />

          {/* Geschützte Dashboards */}
          <Route
            path="/dashboard/client"
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/provider"
            element={
              <ProtectedRoute>
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </DarkModeProvider>
  );
};

export default App;
