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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings, Bell, Search, Sparkles, Moon, Sun } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationsPanel } from "./NotificationsPanel";
import { useToast } from "@/hooks/use-toast";
import supabase, { testConnection } from "@/lib/supabaseClient";
import { useAuthContext } from '@/contexts/AuthContext';
import { useLeads } from "@/hooks/useLeadsAPI";
import { useTasks } from "@/hooks/useTasksAPI";

interface TopbarProps {
  onOpenSearch: () => void;
}

export const Topbar = ({ onOpenSearch }: TopbarProps) => {
  const [theme, setTheme] = useState<string>("light");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: leads = [] } = useLeads();
  const { data: tasks = [] } = useTasks();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuthContext();

  // Calcular notificações não lidas dinamicamente
  const unreadCount = useMemo(() => {
    const now = new Date();
    let count = 0;

    // Leads quentes sem contato
    leads.forEach(lead => {
      if (lead.score >= 80) {
        const lastContact = lead.lastContact || lead.createdAt || now;
        const daysSinceContact = Math.floor((now.getTime() - lastContact.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceContact >= 3) count++;
      }
    });

    // Tarefas de hoje ou atrasadas
    tasks.forEach(task => {
      if (task.dueDate && task.status !== 'done') {
        const dueDate = new Date(task.dueDate);
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
        <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-4 animate-fade-in">
          {/* Logo & Search */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              {/* Light mode: fundo marrom, ícone branco */}
              {/* Dark mode: fundo bege, ícone marrom */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary to-accent flex items-center justify-center shadow-lg ring-1 ring-primary/20 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="h-5 w-5 text-primary-foreground relative z-10 drop-shadow-sm animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none text-primary tracking-tight">
                Futuree AI
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Tríade Solutions</p>
            </div>
          </div>

          {/* Center Actions */}
          <div className="flex-1 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              className="w-full max-w-xs h-9 text-muted-foreground justify-start gap-2 hidden md:flex border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
              onClick={onOpenSearch}
            >
              <Search className="h-4 w-4" />
              Busca global...
              <Badge variant="secondary" className="ml-auto bg-muted text-muted-foreground text-[10px]">⌘K</Badge>
            </Button>
            <Breadcrumbs className="ml-2" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              className="hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden sm:flex hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive border-2 border-card animate-pulse">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-colors">
                  <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-xs font-semibold">
                      VC
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm font-medium">Vendedor</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {user ? (
                  <>
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4" />
                      {user.email ?? 'Perfil'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick}>
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/login')}>
                      <User className="mr-2 h-4 w-4" />
                      Entrar / Cadastrar
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={async () => {
                try {
                  const res = await testConnection();
                  console.log('Supabase test result', res);
                  toast({ title: 'Supabase', description: res.error ? 'Erro na conexão (veja console)' : 'Conexão OK' });
                } catch (err) {
                  console.error('Test connection failed', err);
                  toast({ title: 'Supabase', description: 'Erro ao testar conexão (veja console)' });
                }
              }}
              aria-label="Test Supabase"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2v6m0 8v6M4 12h6m8 0h6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Button>
          </div>
        </div>
      </header>

      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </>
  );
};
