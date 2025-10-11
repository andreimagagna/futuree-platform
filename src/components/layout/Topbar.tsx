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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs } from "./Breadcrumbs";
import { NotificationsPanel } from "./NotificationsPanel";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useToast } from "@/hooks/use-toast";

interface TopbarProps {
  onOpenSearch: () => void;
}

export const Topbar = ({ onOpenSearch }: TopbarProps) => {
  const [theme, setTheme] = useLocalStorage<string>("theme", "light");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount] = useState(3); // Mock unread count
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogout = () => {
    toast({
      title: "Sessão encerrada",
      description: "Você foi desconectado com sucesso.",
    });
    // Aqui você pode adicionar lógica de logout real (limpar tokens, etc)
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-[var(--topbar-height)] bg-card border-b z-40 shadow-sm">
        <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-4 animate-fade-in">
          {/* Logo & Search */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />
              <Sparkles className="h-5 w-5 text-white relative z-10" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Futuree AI
              </h1>
              <p className="text-xs text-muted-foreground">Tríade Solutions</p>
            </div>
          </div>

          {/* Center Actions */}
          <div className="flex-1 flex justify-center items-center gap-4">
            <Button
              variant="outline"
              className="w-full max-w-xs h-9 text-muted-foreground justify-start gap-2 hidden md:flex"
              onClick={onOpenSearch}
            >
              <Search className="h-4 w-4" />
              Busca global...
              <Badge variant="secondary" className="ml-auto">⌘K</Badge>
            </Button>
            <Breadcrumbs className="ml-2" />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hidden sm:flex"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      VC
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline text-sm">Vendedor</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-popover">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
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
