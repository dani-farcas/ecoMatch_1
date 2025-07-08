// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // ✅ corect



interface ProtectedRouteProps {
  children: React.ReactElement;  // Ein einzelnes React-Element
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // Wenn der Nutzer nicht eingeloggt ist, weiterleiten zur Login-Seite
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Wenn der Nutzer eingeloggt ist, geschützte Komponente anzeigen
  return children;
};

export default ProtectedRoute;
