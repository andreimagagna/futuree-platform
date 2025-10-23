/**
 * ============================================================================
 * PÁGINA: TestAuthLeads
 * ============================================================================
 * Página de teste para verificar autenticação e criação de leads
 * ============================================================================
 */

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSupabaseLeads } from '@/hooks/useSupabaseLeads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, LogOut, Plus, Trash2, User } from 'lucide-react';

export function TestAuthLeadsPage() {
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { leads, createLead, deleteLead, isLoading, isCreating, isDeleting } = useSupabaseLeads();
  
  const [newLeadData, setNewLeadData] = useState({
    nome: '',
    email: '',
    phone: '',
  });

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newLeadData.nome || !newLeadData.email) {
      alert('Preencha nome e email');
      return;
    }

    try {
      await createLead({
        nome: newLeadData.nome,
        email: newLeadData.email,
        phone: newLeadData.phone,
        status: 'novo',
        etapa: 'capturado',
        score: 50,
        // owner_id será adicionado automaticamente pelo hook
      });

      // Limpar formulário
      setNewLeadData({ nome: '', email: '', phone: '' });
    } catch (error) {
      console.error('Erro ao criar lead:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header com info do usuário */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="h-6 w-6" />
              <div>
                <CardTitle>Usuário Logado</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ID:</span>
              <code className="text-xs bg-muted px-2 py-1 rounded">{user?.id}</code>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant="default">Autenticado ✓</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Formulário para criar lead */}
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Lead</CardTitle>
          <CardDescription>
            O lead será automaticamente vinculado à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateLead} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={newLeadData.nome}
                  onChange={(e) => setNewLeadData({ ...newLeadData, nome: e.target.value })}
                  placeholder="João Silva"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newLeadData.email}
                  onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                  placeholder="joao@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={newLeadData.phone}
                  onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>

            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Lead
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      {/* Lista de leads */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Leads ({leads.length})</CardTitle>
          <CardDescription>
            Leads vinculados à sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : leads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum lead criado ainda. Crie seu primeiro lead acima!
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{lead.nome}</h4>
                      <Badge variant="outline">{lead.status}</Badge>
                      <Badge variant="secondary">{lead.etapa}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{lead.email}</span>
                      {lead.phone && <span>{lead.phone}</span>}
                      <span>Score: {lead.score}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Owner ID: {lead.owner_id === user?.id ? '(Você)' : lead.owner_id}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteLead(lead.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Total de leads:</span>
            <code className="bg-muted px-2 py-1 rounded">{leads.length}</code>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Leads vinculados a você:</span>
            <code className="bg-muted px-2 py-1 rounded">
              {leads.filter((l) => l.owner_id === user?.id).length}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Estado:</span>
            <Badge variant={isLoading ? 'secondary' : 'default'}>
              {isLoading ? 'Carregando...' : 'Sincronizado com Supabase ✓'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
