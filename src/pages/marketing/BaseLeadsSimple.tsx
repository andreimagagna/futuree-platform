import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database, Loader2, Plus, Users, Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLeadSegments, useCreateLeadSegment, useUpdateLeadSegment, useDeleteLeadSegment } from "@/hooks/useMarketingAPI";
import { Badge } from "@/components/ui/badge";

export const BaseLeadsSimple = () => {
  const { toast } = useToast();
  const { data: segments = [], isLoading } = useLeadSegments();
  const { mutate: createSegment } = useCreateLeadSegment();
  const { mutate: updateSegment } = useUpdateLeadSegment();
  const { mutate: deleteSegment } = useDeleteLeadSegment();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "manual" as const,
    color: "#3B82F6",
  });

  const handleCreate = () => {
    setEditing(null);
    setFormData({
      name: "",
      description: "",
      type: "manual",
      color: "#3B82F6",
    });
    setDialogOpen(true);
  };

  const handleEdit = (segment: any) => {
    setEditing(segment);
    setFormData({
      name: segment.name || "",
      description: segment.description || "",
      type: segment.type || "manual",
      color: segment.color || "#3B82F6",
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateSegment(
        {
          id: editing.id,
          updates: formData,
        },
        {
          onSuccess: () => {
            toast({
              title: "Segmento atualizado",
              description: "Segmento de leads atualizado com sucesso.",
            });
            setDialogOpen(false);
          },
        }
      );
    } else {
      createSegment(formData, {
        onSuccess: () => {
          toast({
            title: "Segmento criado",
            description: "Novo segmento de leads criado com sucesso.",
          });
          setDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    deleteSegment(id, {
      onSuccess: () => {
        toast({
          title: "Segmento excluído",
          description: "Segmento removido com sucesso.",
          variant: "destructive",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Padronizado */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Base de Leads</h1>
          <p className="text-muted-foreground">Gerencie e organize seus segmentos de leads</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          Novo Segmento
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Segmentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{segments.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Segmentos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {segments.filter((s) => s.active_count > 0).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {segments.reduce((sum, s) => sum + (s.lead_count || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {segments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum segmento criado</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro segmento para organizar seus leads
              </p>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Segmento
              </Button>
            </CardContent>
          </Card>
        ) : (
          segments.map((segment) => (
            <Card key={segment.id} className="hover:shadow-lg transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <CardTitle className="text-lg">{segment.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(segment)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(segment.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {segment.description || "Sem descrição"}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <Badge variant="secondary">{segment.type}</Badge>
                  <span className="font-semibold">
                    {segment.lead_count || 0} leads
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar Segmento" : "Novo Segmento"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Segmento</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Leads VIP"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descreva este segmento..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="dynamic">Dinâmico</SelectItem>
                  <SelectItem value="smart">Inteligente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Cor</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="h-10 w-20"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                {editing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
