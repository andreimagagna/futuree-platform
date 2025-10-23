import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!user) {
    // Redireciona para a rota pública real ("/") em vez de "/login" (que não existe)
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
