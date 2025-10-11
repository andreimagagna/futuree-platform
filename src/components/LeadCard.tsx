import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2, Mail, Phone, Calendar } from "lucide-react";

interface LeadCardProps {
  name: string;
  company: string;
  email: string;
  phone: string;
  stage: string;
  score: number;
  lastContact: string;
}

const stageColors: Record<string, string> = {
  novo: "bg-blue-500",
  contato: "bg-purple-500",
  qualificado: "bg-green-500",
  proposta: "bg-orange-500",
  negociacao: "bg-yellow-500",
};

export const LeadCard = ({
  name,
  company,
  email,
  phone,
  stage,
  score,
  lastContact,
}: LeadCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {company}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <p className="text-xs text-muted-foreground">score</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span className="truncate">{email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{phone}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <Badge className={stageColors[stage.toLowerCase()]} variant="default">
            {stage}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {lastContact}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
