import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings, Bell, Search, Sparkles, Moon, Sun, Menu } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationsPanel } from "./NotificationsPanel";
import { useToast } from "@/hooks/use-toast";
import supabase, { testConnection } from "@/lib/supabaseClient";
import { useAuthContext } from '@/contexts/AuthContext';
import { useLeads } from "@/hooks/useLeadsAPI";
import { useTasks } from "@/hooks/useTasksAPI";
import { useQuery } from "@tanstack/react-query";

interface TopbarProps {
  onOpenSearch: () => void;
  onToggleMobileMenu: () => void;
}

export const Topbar = ({ onOpenSearch, onToggleMobileMenu }: TopbarProps) => {
  const [theme, setTheme] = useState<string>("light");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: leads = [] } = useLeads();
  const { data: tasks = [] } = useTasks();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuthContext();

  // Buscar perfil do usuário
  const { data: profile } = useQuery<{ nome: string | null; full_name: string | null; avatar_url: string | null } | null>({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('profiles')
        .select('nome, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      return data as { nome: string | null; full_name: string | null; avatar_url: string | null } | null;
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // Cache por 10 minutos
  });

  // Nome para exibir (apenas primeiro nome)
  const fullName = profile?.nome || profile?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const firstName = fullName.split(' ')[0]; // Apenas o primeiro nome
  const displayName = firstName;
  
  // Iniciais para avatar
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Calcular notificações não lidas dinamicamente
  const unreadCount = useMemo(() => {
    const now = new Date();
    let count = 0;

    // Leads quentes sem contato
    leads.forEach((lead: any) => {
      if (lead.score >= 80) {
        const lastContact = lead.last_contact_date || lead.created_at || now;
        const daysSinceContact = Math.floor((now.getTime() - new Date(lastContact).getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceContact >= 3) count++;
      }
    });

    // Tarefas de hoje ou atrasadas
    tasks.forEach(task => {
      if (task.due_date && task.status !== 'done') {
        const dueDate = new Date(task.due_date);
        if (dueDate <= now) count++;
      }
    });

    return count;
  }, [leads, tasks]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenSearch]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast({ title: 'Sessão encerrada', description: 'Você foi desconectado com sucesso.' });
      navigate('/');
    } catch (err) {
      console.error('Logout failed', err);
      toast({ title: 'Erro', description: 'Falha ao encerrar sessão' });
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[var(--topbar-height)] bg-gradient-to-r from-card via-card/98 to-card border-b border-border/50 z-40 backdrop-blur-xl shadow-md">
        <div className="flex items-center justify-between h-full px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4 animate-fade-in">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botão Hamburguer (Mobile) */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8 hover:bg-primary/10"
              onClick={onToggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="relative group">
              {/* Light mode: fundo marrom, ícone branco */}
              {/* Dark mode: fundo bege, ícone marrom */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg ring-1 ring-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground relative z-10 drop-shadow-sm animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-base sm:text-lg leading-none text-primary tracking-tight">
                Futuree Platform
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">All-in-One Business Solution</p>
            </div>
          </div>

          {/* Center Actions */}
          <div className="flex-1 flex justify-center items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              className="w-full max-w-xs h-8 sm:h-9 text-xs sm:text-sm text-muted-foreground justify-start gap-2 hidden md:flex border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              onClick={onOpenSearch}
            >
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">Busca global...</span>
              <span className="lg:hidden">Buscar...</span>
              <Badge variant="secondary" className="ml-auto bg-muted text-muted-foreground text-[10px]">⌘K</Badge>
            </Button>
            <Breadcrumbs className="ml-2 hidden sm:block" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-3 w-3 sm:h-4 sm:w-4" /> : <Moon className="h-3 w-3 sm:h-4 sm:w-4" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-8 w-8 sm:h-9 sm:w-9 hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[9px] sm:text-[10px] bg-destructive border-2 border-card animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-8 sm:h-9 px-1 sm:px-2 hover:bg-primary/10 transition-colors">
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7 ring-2 ring-primary/20">
                    {profile?.avatar_url && <AvatarImage src={profile?.avatar_url} />}
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-[10px] sm:text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-xs sm:text-sm font-medium">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 sm:w-48 bg-popover">
                <DropdownMenuLabel className="text-xs sm:text-sm">Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem onClick={handleSettingsClick} className="text-xs sm:text-sm">
                      <Settings className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Configurações
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')} className="text-xs sm:text-sm">
                      <User className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      Entrar / Cadastrar
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive text-xs sm:text-sm">
                  <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  );
};
