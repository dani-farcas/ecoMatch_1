import React from "react";
import { Routes, Route } from "react-router-dom";

// Globale Kontexte
import { AuthProvider } from "./contexts/AuthContext";
import { DarkModeProvider } from "./contexts/DarkModeContext";

// Gemeinsames Layout
import UniversalLayout from "./layouts/UniversalLayout";

// Öffentliche Seiten
import LandingPage from "./pages/LandingPage/LandingPage";
import GastStart from "./pages/GastStart/GastStart";
import DatenschutzPage from "@/pages/DatenschutzPage/DatenschutzPage";
import AboDetailPage from "./pages/Abo/AboDetailPage";
import Login from "./pages/Auth/Login/Login";
import Signup from "./pages/Auth/Signup/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ConfirmEmail from "./pages/Auth/ConfirmEmail/ConfirmEmail";
import ConfirmEmailInvalid from "./pages/Auth/ConfirmEmail/ConfirmEmailInvalid";
import GastConfirmieren from "@pages/GastConfirmieren/GastConfirmieren";
import GastAnfrage from "@pages/GastAnfrage/GastAnfrage";

// User-Dashboard
import UserDashboard from "./pages/User/UserDashboard";

// Hilfskomponente: Scrollt bei Routenwechsel nach oben
import ScrollToTop from "@components/ScrollToTop";

const App: React.FC = () => {
  console.log("DEBUG: VITE_API_URL =", import.meta.env.VITE_API_URL);

  return (
    <>
      {/* Scrollen bei jedem Routenwechsel */}
      <ScrollToTop /> 
      <Routes>
        {/* Öffentliche Routen mit UniversalLayout */}
        <Route element={<UniversalLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="/gast-start" element={<GastStart />} />
          <Route path="/gast-confirmieren" element={<GastConfirmieren />} />
          <Route path="/gast-anfrage" element={<GastAnfrage />} />
          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/confirm-email/:uid/:token/" element={<ConfirmEmail />} />
          <Route path="/confirm-email/invalid" element={<ConfirmEmailInvalid />} />
          <Route path="/abo/:plan" element={<AboDetailPage />} />
        </Route>

        {/* Dashboard (aktuell ohne ProtectedRoute für Test) */}
        <Route path="/dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
};

export default App;
