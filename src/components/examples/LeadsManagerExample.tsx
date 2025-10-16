import React, { useState } from 'react';
import { useLeadsAPI, useLeadAPI, useSearchAPI, useBulkOperationsAPI } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

/**
 * EXEMPLO: Componente de Leads usando a nova API escalável
 *
 * Este exemplo demonstra como usar todos os recursos da nova arquitetura:
 * - Cache inteligente
 * - Realtime updates
 * - Busca e filtros
 * - Operações em massa
 * - Estados de loading
 * - Error handling
 */

export function LeadsManager() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // API principal para leads
  const {
    leads,
    isLoading,
    error,
    createLead,
    updateLead,
    deleteLead,
    isCreating,
    isUpdating,
    isDeleting,
    refetch,
  } = useLeadsAPI({
    orderBy: { column: 'created_at', ascending: false },
    limit: 50,
  });

  // API de busca
  const { search } = useSearchAPI();

  // API para operações em massa
  const { bulkUpdate, bulkDelete, isUpdating: isBulkUpdating } = useBulkOperationsAPI();

  // Filtrar leads baseado na busca
  const filteredLeads = search(searchQuery);

  // Handlers
  const handleCreateLead = async (formData: any) => {
    try {
      await createLead(formData);
      setShowCreateForm(false);
      toast.success('Lead criado com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar lead');
    }
  };

  const handleUpdateLead = async (id: string, updates: any) => {
    try {
      await updateLead({ id, updates });
      toast.success('Lead atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar lead');
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este lead?')) return;

    try {
      await deleteLead(id);
      toast.success('Lead removido!');
    } catch (error) {
      toast.error('Erro ao remover lead');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedLeads.length === 0) return;

    try {
      await bulkUpdate(
        selectedLeads.map(id => ({ id, updates: { etapa: status } }))
      );
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads atualizados!`);
    } catch (error) {
      toast.error('Erro ao atualizar leads');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    if (!confirm(`Deletar ${selectedLeads.length} leads?`)) return;

    try {
      await bulkDelete(selectedLeads);
      setSelectedLeads([]);
      toast.success(`${selectedLeads.length} leads removidos!`);
    } catch (error) {
      toast.error('Erro ao remover leads');
    }
  };

  const toggleLeadSelection = (id: string) => {
    setSelectedLeads(prev =>
      prev.includes(id)
        ? prev.filter(leadId => leadId !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedLeads(filteredLeads.map(lead => lead.id));
  };

  const clearSelection = () => {
    setSelectedLeads([]);
  };

  // Estados de loading e error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Carregando leads...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">Erro ao carregar leads</p>
        <Button onClick={() => refetch()}>Tentar novamente</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Leads</h1>
          <p className="text-muted-foreground">
            {(filteredLeads as any[]).length} de {(leads as any[]).length} leads
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          disabled={isCreating}
        >
          {isCreating ? 'Criando...' : 'Novo Lead'}
        </Button>
      </div>

      {/* Barra de ações em massa */}
      {selectedLeads.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                {selectedLeads.length} leads selecionados
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusUpdate('qualificacao')}
                disabled={isBulkUpdating}
              >
                Mover para Qualificação
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkStatusUpdate('proposta')}
                disabled={isBulkUpdating}
              >
                Mover para Proposta
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
                disabled={isBulkUpdating}
              >
                Deletar Selecionados
              </Button>
              <Button size="sm" variant="ghost" onClick={clearSelection}>
                Limpar Seleção
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Barra de busca e filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Input
              placeholder="Buscar leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" onClick={selectAll}>
              Selecionar Todos
            </Button>
            <Button variant="outline" onClick={() => refetch()}>
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de leads */}
      <div className="grid gap-4">
        {filteredLeads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            isSelected={selectedLeads.includes(lead.id)}
            onSelect={() => toggleLeadSelection(lead.id)}
            onUpdate={(updates) => handleUpdateLead(lead.id, updates)}
            onDelete={() => handleDeleteLead(lead.id)}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        ))}
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <CreateLeadForm
          onSubmit={handleCreateLead}
          onCancel={() => setShowCreateForm(false)}
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
}

// Componente para card de lead individual
function LeadCard({
  lead,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting
}: {
  lead: any;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: any) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome: lead.nome || '',
    email: lead.email || '',
    whatsapp: lead.whatsapp || '',
  });

  const handleSave = () => {
    onUpdate(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      nome: lead.nome || '',
      email: lead.email || '',
      whatsapp: lead.whatsapp || '',
    });
    setIsEditing(false);
  };

  return (
    <Card className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
          />

          {isEditing ? (
            <Input
              value={editData.nome}
              onChange={(e) => setEditData(prev => ({ ...prev, nome: e.target.value }))}
              className="font-semibold"
            />
          ) : (
            <CardTitle className="text-lg">{lead.nome}</CardTitle>
          )}

          <Badge variant="secondary">{lead.etapa || 'Novo'}</Badge>
          <Badge variant="outline">{lead.origem || 'N/A'}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {/* Campos editáveis */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              {isEditing ? (
                <Input
                  value={editData.email}
                  onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{lead.email || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              {isEditing ? (
                <Input
                  value={editData.whatsapp}
                  onChange={(e) => setEditData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              ) : (
                <p className="text-sm text-muted-foreground">{lead.whatsapp || 'N/A'}</p>
              )}
            </div>
          </div>

          {/* Score e data */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Score: {lead.score || 0}</span>
            <span>
              {lead.created_at ? new Date(lead.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          {/* Ações */}
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave} disabled={isUpdating}>
                  {isUpdating ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Removendo...' : 'Deletar'}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Formulário de criação de lead
function CreateLeadForm({
  onSubmit,
  onCancel,
  isSubmitting
}: {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    origem: 'website',
    etapa: 'novo',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Lead</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">WhatsApp</label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Origem</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.origem}
                onChange={(e) => setFormData(prev => ({ ...prev, origem: e.target.value }))}
              >
                <option value="website">Website</option>
                <option value="facebook">Facebook</option>
                <option value="linkedin">LinkedIn</option>
                <option value="indicacao">Indicação</option>
                <option value="outros">Outros</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Lead'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default LeadsManager;