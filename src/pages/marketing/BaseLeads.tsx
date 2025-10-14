import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building,
  Filter,
  Download,
  Tag,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  position?: string;
  status: 'lead' | 'qualificado' | 'cliente' | 'perdido';
  source: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  notes?: string;
}

const statusConfig = {
  lead: { label: 'Lead', color: 'text-accent border-accent' },
  qualificado: { label: 'Qualificado', color: 'text-warning border-warning' },
  cliente: { label: 'Cliente', color: 'text-success border-success' },
  perdido: { label: 'Perdido', color: 'text-muted-foreground border-muted-foreground' },
};

export function BaseLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    status: 'lead' as Lead['status'],
    source: '',
    tags: '',
    notes: '',
  });

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenDialog = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
        position: lead.position || '',
        status: lead.status,
        source: lead.source,
        tags: lead.tags.join(', '),
        notes: lead.notes || '',
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        status: 'lead',
        source: '',
        tags: '',
        notes: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      toast({
        title: 'Erro',
        description: 'Nome e email são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    const leadData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      position: formData.position,
      status: formData.status,
      source: formData.source,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      notes: formData.notes,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (editingLead) {
      setLeads(leads.map(lead =>
        lead.id === editingLead.id
          ? { ...lead, ...leadData }
          : lead
      ));
      toast({
        title: 'Lead atualizado',
        description: 'As informações do lead foram atualizadas com sucesso',
      });
    } else {
      const newLead: Lead = {
        id: Date.now().toString(),
        ...leadData,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setLeads([newLead, ...leads]);
      toast({
        title: 'Lead criado',
        description: 'Novo lead adicionado à base com sucesso',
      });
    }

    setDialogOpen(false);
  };

  const handleDeleteConfirm = (id: string) => {
    setLeadToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (leadToDelete) {
      setLeads(leads.filter(lead => lead.id !== leadToDelete));
      toast({
        title: 'Lead removido',
        description: 'O lead foi removido da base',
      });
      setDeleteDialogOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleExport = () => {
    const csv = [
      ['Nome', 'Email', 'Telefone', 'Empresa', 'Cargo', 'Status', 'Origem', 'Tags', 'Criado em', 'Atualizado em'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone || '',
        lead.company || '',
        lead.position || '',
        statusConfig[lead.status].label,
        lead.source,
        lead.tags.join('; '),
        new Date(lead.createdAt).toLocaleDateString('pt-BR'),
        new Date(lead.updatedAt).toLocaleDateString('pt-BR'),
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: 'Exportação concluída',
      description: 'Base de leads exportada com sucesso',
    });
  };

  const stats = {
    total: leads.length,
    leads: leads.filter(l => l.status === 'lead').length,
    qualificados: leads.filter(l => l.status === 'qualificado').length,
    clientes: leads.filter(l => l.status === 'cliente').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            Base de Leads
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport} disabled={leads.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Leads</div>
            <div className="text-2xl font-bold mt-1 text-accent">{stats.leads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Qualificados</div>
            <div className="text-2xl font-bold mt-1 text-warning">{stats.qualificados}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Clientes</div>
            <div className="text-2xl font-bold mt-1 text-success">{stats.clientes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou empresa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="cliente">Cliente</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contatos ({filteredLeads.length})</CardTitle>
          <CardDescription>
            Lista completa de leads e contatos cadastrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Empresa / Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-muted-foreground/50" />
                      <p className="text-muted-foreground font-medium">
                        {searchQuery || statusFilter !== 'all' 
                          ? 'Nenhum lead encontrado com os filtros aplicados' 
                          : 'Nenhum lead cadastrado'}
                      </p>
                      {!searchQuery && statusFilter === 'all' && (
                        <Button variant="outline" size="sm" onClick={() => handleOpenDialog()} className="mt-2">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar primeiro lead
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.company || lead.position ? (
                        <div className="space-y-0.5">
                          {lead.company && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="w-3 h-3 text-muted-foreground" />
                              {lead.company}
                            </div>
                          )}
                          {lead.position && (
                            <div className="text-xs text-muted-foreground pl-5">
                              {lead.position}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusConfig[lead.status].color}
                      >
                        {statusConfig[lead.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{lead.source || '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {lead.tags.length > 0 ? (
                          lead.tags.slice(0, 2).map((tag, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                        {lead.tags.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{lead.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(lead)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteConfirm(lead.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLead ? 'Editar Lead' : 'Novo Lead'}
            </DialogTitle>
            <DialogDescription>
              {editingLead
                ? 'Atualize as informações do contato'
                : 'Adicione um novo contato à sua base de leads'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Nome da empresa"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Ex: Gerente de Marketing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as Lead['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="cliente">Cliente</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Origem</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="Ex: Website, LinkedIn, Evento"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="tags">
                <Tag className="w-3 h-3 inline mr-1" />
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="tecnologia, B2B, SaaS (separadas por vírgula)"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Adicione observações sobre este lead..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              {editingLead ? 'Atualizar Lead' : 'Criar Lead'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
