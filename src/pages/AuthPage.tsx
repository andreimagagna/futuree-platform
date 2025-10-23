/**
 * ============================================================================
 * PÁGINA: AuthPage
 * ============================================================================
 * Página que alterna entre Login e Signup
 * ============================================================================
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignupForm } from '@/components/auth/SignupForm';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSuccess = () => {
    // Redireciona para a rota de origem (se houver) ou para o dashboard
    const from = (location.state as any)?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToSignup={() => setMode('signup')}
          />
        ) : (
          <SignupForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setMode('login')}
          />
        )}
      </div>
    </div>
  );
}
