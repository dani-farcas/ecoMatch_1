import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";

import LandingPage from "./pages/LandingPage/LandingPage";
import AboDetailPage from "./pages/Abo/AboDetailPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import ConfirmEmailInvalid from "./pages/Auth/ConfirmEmailInvalid";

import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./pages/Client/ClientDashboard";
import ProviderDashboard from "./pages/Provider/ProviderDashboard";

const App: React.FC = () => {
  console.log("DEBUG: VITE_API_URL =", import.meta.env.VITE_API_URL);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <Routes>
          {/* Öffentliche Seiten */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/confirm-email/:uid/:token/"
            element={<ConfirmEmail />}
          />
          <Route
            path="/confirm-email/invalid"
            element={<ConfirmEmailInvalid />}
          />
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
