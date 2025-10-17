import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'magic' | 'password'>('magic');
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email) throw new Error('Informe um e-mail válido');

      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) throw error;
        toast({ title: 'Verifique seu e-mail', description: 'Enviamos um link mágico para autenticação.' });
        const from = (location.state as any)?.from || '/';
        setTimeout(() => navigate(from), 1500);
      } else {
        const passwordInput = (e.target as HTMLFormElement).querySelector('input[name="password"]') as HTMLInputElement | null;
        const pwd = passwordInput?.value ?? '';
        if (!pwd) throw new Error('Informe a senha');
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: pwd });
        if (error) throw error;
        if (data?.session) {
          toast({ title: 'Login bem sucedido', description: 'Redirecionando...' });
          const from = (location.state as any)?.from || '/';
          navigate(from);
        } else {
          toast({ title: 'Login pendente', description: 'Verifique seu e-mail para confirmar o acesso.' });
        }
      }
    } catch (err: any) {
      console.error('Login error', err);
      toast({ title: 'Erro no login', description: err?.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>

        {mode === 'password' && (
          <div>
            <Label htmlFor="password">Senha</Label>
            <Input id="password" name="password" type="password" placeholder="Sua senha" />
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">Ainda não tem conta? <Link to="/register" className="underline">Cadastre-se</Link></div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading || !email}>
              {loading ? 'Processando...' : mode === 'magic' ? 'Enviar link mágico' : 'Entrar com senha'}
            </Button>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <button type="button" className="underline" onClick={() => setMode(mode === 'magic' ? 'password' : 'magic')}>{mode === 'magic' ? 'Entrar com senha' : 'Entrar com link mágico'}</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
