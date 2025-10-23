import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText,
  Folder,
  FolderOpen,
  Upload,
  Download,
  Plus,
  Loader2,
  Edit,
  Trash2,
  Star,
  Share2,
  ChevronRight,
  Home,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface Document {
  id: string;
  name: string;
  type: "file" | "folder";
  file_type: string | null;
  size_bytes: number;
  path: string;
  parent_folder_id: string | null;
  category: string | null;
  tags: string[] | null;
  is_shared: boolean;
  is_starred: boolean;
  uploaded_by: string | null;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

const categoryOptions = [
  "Contratos",
  "Propostas",
  "Relatórios",
  "Apresentações",
  "Planilhas",
  "Imagens",
  "Vídeos",
  "Outros"
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Arquivos = () => {
  const { toast } = useToast();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

// ============================================================================
// STATE
// ============================================================================

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentType, setDocumentType] = useState<"file" | "folder">("folder");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<{
    name: string;
    type: "file" | "folder";
    category: string;
    tags: string[];
    is_starred: boolean;
  }>({
    name: "",
    type: "folder",
    category: "",
    tags: [],
    is_starred: false,
  });  // ============================================================================
  // SUPABASE HOOKS
  // ============================================================================

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents', user?.id, currentFolderId],
    queryFn: async () => {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('owner_id', user?.id)
        .order('type', { ascending: false })
        .order('name', { ascending: true });

      if (currentFolderId) {
        query = query.eq('parent_folder_id', currentFolderId);
      } else {
        query = query.is('parent_folder_id', null);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Document[];
    },
    enabled: !!user?.id,
  });

  const { data: currentFolder } = useQuery({
    queryKey: ['document', currentFolderId],
    queryFn: async () => {
      if (!currentFolderId) return null;
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', currentFolderId)
        .single();
      
      if (error) throw error;
      return data as Document;
    },
    enabled: !!currentFolderId,
  });

  const createMutation = useMutation({
    mutationFn: async (newDocument: Partial<Document>) => {
      const { data, error } = await (supabase as any)
        .from('documents')
        .insert({
          ...newDocument,
          owner_id: user?.id,
          uploaded_by: user?.id,
          parent_folder_id: currentFolderId,
          path: currentFolder ? `${currentFolder.path}/${newDocument.name}` : `/${newDocument.name}`,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({ title: documentType === "folder" ? "Pasta criada!" : "Arquivo adicionado!" });
      setIsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Document> }) => {
      const { data, error } = await (supabase as any)
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({ title: "Atualizado!" });
      setIsDialogOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast({ title: "Removido!" });
    },
  });

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleOpenDialog = (type: "file" | "folder", document?: Document) => {
    setDocumentType(type);
    if (document) {
      setSelectedDocument(document);
      setFormData({
        name: document.name || "",
        type: document.type,
        category: document.category || "",
        tags: document.tags || [],
        is_starred: document.is_starred,
      });
    } else {
      setSelectedDocument(null);
      setFormData({
        name: "",
        type: type,
        category: "",
        tags: [],
        is_starred: false,
      });
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name && !selectedFile) {
      toast({
        title: "Erro",
        description: "Preencha o nome ou selecione um arquivo",
        variant: "destructive",
      });
      return;
    }

    try {
      if (formData.type === "file" && selectedFile) {
        // UPLOAD REAL DO ARQUIVO
        setUploadingFile(true);
        
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        const filePath = currentFolderId 
          ? `${currentFolder?.path}/${fileName}`
          : `/${fileName}`;

        // Upload para Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, selectedFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Criar registro no banco com referência ao arquivo
        await createMutation.mutateAsync({
          ...formData,
          name: formData.name || selectedFile.name,
          size_bytes: selectedFile.size,
          file_type: selectedFile.type,
          path: uploadData.path,
        });

        setUploadingFile(false);
        setSelectedFile(null);
      } else {
        // Apenas metadados (pasta ou arquivo sem upload)
        if (selectedDocument) {
          updateMutation.mutate({ id: selectedDocument.id, updates: formData });
        } else {
          createMutation.mutate({
            ...formData,
            size_bytes: 0,
            file_type: formData.type === "file" ? "document" : null,
          });
        }
      }
    } catch (error: any) {
      setUploadingFile(false);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownloadFile = async (document: Document) => {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .download(document.path);

      if (error) throw error;

      // Criar URL e trigger download
      const url = URL.createObjectURL(data);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = document.name;
      a.click();
      URL.revokeObjectURL(url);

      toast({ title: "Download iniciado!" });
    } catch (error: any) {
      toast({
        title: "Erro no download",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja deletar?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleStar = (document: Document) => {
    updateMutation.mutate({
      id: document.id,
      updates: { is_starred: !document.is_starred }
    });
  };

  const handleOpenFolder = (folderId: string) => {
    setCurrentFolderId(folderId);
  };

  const handleGoBack = () => {
    if (currentFolder?.parent_folder_id) {
      setCurrentFolderId(currentFolder.parent_folder_id);
    } else {
      setCurrentFolderId(null);
    }
  };

  // ============================================================================
  // ANALYTICS
  // ============================================================================

  const totalFolders = documents.filter(d => d.type === "folder").length;
  const totalFiles = documents.filter(d => d.type === "file").length;
  const starredCount = documents.filter(d => d.is_starred).length;

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
        <div>
          <h1 className="text-3xl font-bold">Arquivos</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            {currentFolder && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>{currentFolder.name}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {currentFolderId && (
            <Button variant="outline" onClick={handleGoBack}>
              Voltar
            </Button>
          )}
          <Button variant="outline" onClick={() => handleOpenDialog("folder")}>
            <Folder className="w-4 h-4 mr-2" />
            Nova Pasta
          </Button>
          <Button onClick={() => handleOpenDialog("file")}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Arquivo
          </Button>
        </div>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pastas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">{totalFolders}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Arquivos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold">{totalFiles}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              <span className="text-2xl font-bold">{starredCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DOCUMENTS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {documents.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum arquivo ou pasta</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          documents.map((doc) => (
            <Card
              key={doc.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => doc.type === "folder" ? handleOpenFolder(doc.id) : null}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  {doc.type === "folder" ? (
                    <FolderOpen className="w-12 h-12 text-primary" />
                  ) : (
                    <FileText className="w-12 h-12 text-muted-foreground" />
                  )}
                  
                  <div className="w-full">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    {doc.category && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        {doc.category}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 w-full justify-center">
                    {doc.type === "file" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadFile(doc);
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStar(doc);
                      }}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          doc.is_starred ? "fill-warning text-warning" : ""
                        }`}
                      />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDialog(doc.type, doc);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* DIALOG */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDocument
                ? `Editar ${documentType === "folder" ? "Pasta" : "Arquivo"}`
                : `Nova ${documentType === "folder" ? "Pasta" : "Arquivo"}`}
            </DialogTitle>
            <DialogDescription>
              {documentType === "folder"
                ? "Organize seus arquivos em pastas"
                : "Adicione um novo arquivo"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {/* FILE UPLOAD INPUT - apenas para novos arquivos */}
            {documentType === "file" && !selectedDocument && (
              <div className="border-2 border-dashed rounded-lg p-6 text-center space-y-3">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                <div>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedFile(file);
                        if (!formData.name) {
                          setFormData({ ...formData, name: file.name });
                        }
                      }
                    }}
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-sm font-medium text-primary hover:underline"
                  >
                    Clique para selecionar um arquivo
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou arraste e solte aqui
                  </p>
                </div>
                {selectedFile && (
                  <div className="text-sm">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input
                placeholder={documentType === "folder" ? "Nome da pasta" : "Nome do arquivo"}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="starred"
                checked={formData.is_starred}
                onChange={(e) => setFormData({ ...formData, is_starred: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="starred" className="text-sm font-medium">
                Marcar como favorito
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsDialogOpen(false);
              setSelectedFile(null);
            }}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={createMutation.isPending || updateMutation.isPending || uploadingFile}
            >
              {uploadingFile && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {(createMutation.isPending || updateMutation.isPending) && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {selectedDocument ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Arquivos;
