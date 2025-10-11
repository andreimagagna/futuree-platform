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
import { Plus, User, LogOut, Settings, Bell } from "lucide-react";

interface TopbarProps {
  onOpenSearch: () => void;
  onOpenCreate: () => void;
}

export const Topbar = ({ onOpenSearch, onOpenCreate }: TopbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-[var(--topbar-height)] bg-card border-b z-40 shadow-sm">
      <div className="flex items-center justify-between h-full px-4 lg:px-6 gap-4 animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-bold text-lg leading-none">SDR Pro</h1>
            <p className="text-xs text-muted-foreground">Sales Dashboard</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={onOpenCreate}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Criar</span>
          </Button>

          <Button variant="ghost" size="icon" className="relative hidden sm:flex">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
              3
            </Badge>
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
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
