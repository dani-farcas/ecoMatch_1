import React from "react";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";
import MainLayout from "./layouts/MainLayout";

import LandingPage from "./pages/LandingPage/LandingPage";
import GastStart from "./pages/GastStart/GastStart";
import DatenschutzPage from "@/pages/DatenschutzPage/DatenschutzPage";
import AboDetailPage from "./pages/Abo/AboDetailPage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ConfirmEmail from "./pages/Auth/ConfirmEmail/ConfirmEmail";
import ConfirmEmailInvalid from "./pages/Auth/ConfirmEmail/ConfirmEmailInvalid";
import GastConfirmieren from "@pages/GastConfirmieren/GastConfirmieren";
import GastAnfrage from "@pages/GastAnfrage/GastAnfrage";

import ProtectedRoute from "./components/ProtectedRoute";
import ClientDashboard from "./pages/Client/ClientDashboard";
import ProviderDashboard from "./pages/Provider/ProviderDashboard";

const App: React.FC = () => {
  console.log("DEBUG: VITE_API_URL =", import.meta.env.VITE_API_URL);

  return (
    <DarkModeProvider>
      <AuthProvider>
        <Routes>
          {/* Layout comun pentru paginile publice */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gast-start" element={<GastStart />} />
            <Route path="/gast-confirmieren" element={<GastConfirmieren />} />
            <Route path="/gast-anfrage" element={<GastAnfrage />} />
            <Route path="/datenschutz" element={<DatenschutzPage />} />
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
          </Route>

          {/* Dashboards protejate – fără ChatBot */}
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
