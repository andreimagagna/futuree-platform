import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!email) throw new Error('Informe um e-mail válido');
      if (!password || password.length < 6) throw new Error('Senha deve ter ao menos 6 caracteres');

      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast({ title: 'Cadastro iniciado', description: 'Verifique seu e-mail para confirmar a conta.' });
      navigate('/login');
    } catch (err: any) {
      console.error('Register error', err);
      toast({ title: 'Erro no cadastro', description: err?.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold">Criar conta</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha (min 6 caracteres)" />
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={loading || !email || !password}>{loading ? 'Processando...' : 'Criar conta'}</Button>
        </div>
      </form>
    </div>
  );
}
