/**
 * ============================================================================
 * COMPONENTE: PublicRoute
 * ============================================================================
 * Rota pública que redireciona usuários JÁ LOGADOS para o dashboard
 * Usado para páginas de login/signup - se o usuário já está logado, não faz sentido mostrar essas páginas
 * ============================================================================
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface PublicRouteProps {
  children: React.ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, loading } = useAuthContext();

  // Enquanto está verificando a sessão, mostra loading
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se JÁ ESTÁ LOGADO, redireciona para o dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Se NÃO está logado, mostra a página pública (login/signup)
  return <>{children}</>;
}

export default PublicRoute;
