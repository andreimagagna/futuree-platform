import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileText,
  Plus,
  Loader2,
  Trash2,
  Star,
  Check,
  Clock,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

// ============================================================================
// TYPES
// ============================================================================

interface NotionPage {
  id: string;
  title: string;
  content: string | null;
  description: string | null;
  tags: string[] | null;
  is_favorite: boolean;
  is_private: boolean;
  is_template: boolean;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const NotionSolutions = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  // ============================================================================
  // STATE
  // ============================================================================

  const [selectedPage, setSelectedPage] = useState<NotionPage | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounce para auto-save
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedContent = useDebounce(content, 1000);

  // ============================================================================
  // SUPABASE HOOKS
  // ============================================================================

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['notion_pages', user?.id, filterFavorites],
    queryFn: async () => {
      let query = supabase
        .from('notion_pages')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (filterFavorites) {
        query = query.eq('is_favorite', true);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as NotionPage[];
    },
    enabled: !!user?.id,
  });

  const createMutation = useMutation({
    mutationFn: async (newPage: Partial<NotionPage>) => {
      const { data, error } = await supabase
        .from('notion_pages')
        .insert([{ 
          ...newPage, 
          owner_id: user?.id,
        }] as any)
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
      toast({ title: "Página criada com sucesso!" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar página",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<NotionPage> }) => {
      const { data, error } = await (supabase as any)
        .from('notion_pages')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
      toast({ title: "Página atualizada!" });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notion_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notion_pages'] });
      toast({ title: "Página removida!" });
    },
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleOpenDialog = (page?: NotionPage) => {
    if (page) {
      setSelectedPage(page);
      setFormData({
        title: page.title || "",
        content: page.content || "",
        description: page.description || "",
        is_favorite: page.is_favorite,
        is_private: page.is_private,
        is_template: page.is_template,
      });
    } else {
      setSelectedPage(null);
      setFormData({
        title: "",
        content: "",
        description: "",
        is_favorite: false,
        is_private: false,
        is_template: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title) {
      toast({
        title: "Erro",
        description: "Preencha o título da página",
        variant: "destructive",
      });
      return;
    }

    if (selectedPage) {
      updateMutation.mutate({ id: selectedPage.id, updates: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar esta página?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleFavorite = (page: NotionPage) => {
    updateMutation.mutate({
      id: page.id,
      updates: { is_favorite: !page.is_favorite }
    });
  };

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  const totalPages = pages.length;
  const favoritePages = pages.filter(p => p.is_favorite).length;
  const templatePages = pages.filter(p => p.is_template).length;
  const privatePages = pages.filter(p => p.is_private).length;

  // ============================================================================
  // RENDER
  // ============================================================================

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notion Solutions</h1>
        <div className="flex gap-2">
          <Button
            variant={filterFavorites ? "default" : "outline"}
            onClick={() => setFilterFavorites(!filterFavorites)}
          >
            <Star className={`w-4 h-4 mr-2 ${filterFavorites ? "fill-current" : ""}`} />
            Favoritos
          </Button>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Página
          </Button>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Páginas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{totalPages}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favoritas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              <span className="text-2xl font-bold">{favoritePages}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BookTemplate className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold">{templatePages}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Privadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-destructive" />
              <span className="text-2xl font-bold">{privatePages}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PAGES LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {filterFavorites ? "Nenhuma página favorita" : "Nenhuma página criada"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          pages.map((page) => (
            <Card 
              key={page.id} 
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="w-8 h-8 text-primary" />
                    <div className="flex-1">
                      <CardTitle className="text-lg">{page.title}</CardTitle>
                      {page.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {page.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview do conteúdo */}
                {page.content && (
                  <div 
                    className="mt-3 text-sm text-muted-foreground line-clamp-3 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                  />
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2 flex-wrap">
                    {page.is_favorite && (
                      <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Favorito
                      </Badge>
                    )}
                    {page.is_template && (
                      <Badge variant="outline" className="text-xs">
                        <BookTemplate className="w-3 h-3 mr-1" />
                        Template
                      </Badge>
                    )}
                    {page.is_private && (
                      <Badge variant="destructive" className="text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Privado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleToggleFavorite(page)}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          page.is_favorite ? "fill-warning text-warning" : ""
                        }`}
                      />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleOpenDialog(page)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-xs text-muted-foreground">
                  Criado em {new Date(page.created_at).toLocaleDateString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* DIALOG COM EDITOR RICO */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPage ? "Editar Página" : "Nova Página"}
            </DialogTitle>
            <DialogDescription>
              Crie anotações rápidas com formatação completa, igual ao Notion
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <Input
                placeholder="Ex: Meu Plano Estratégico 2025"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                placeholder="Breve descrição da página..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Conteúdo</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Comece a escrever sua anotação..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={formData.is_favorite}
                  onChange={(e) => setFormData({ ...formData, is_favorite: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="favorite" className="text-sm font-medium">
                  Marcar como favorito
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="template"
                  checked={formData.is_template}
                  onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="template" className="text-sm font-medium">
                  Salvar como template
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={formData.is_private}
                  onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                  className="rounded"
                />
                <label htmlFor="private" className="text-sm font-medium">
                  Página privada
                </label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={createMutation.isPending || updateMutation.isPending}>
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {selectedPage ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotionSolutions;
