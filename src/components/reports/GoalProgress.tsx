import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown } from "lucide-react";
import { ReactNode } from "react";

interface GoalProgressProps {
  title: string;
  current: number;
  goal: number;
  format?: 'currency' | 'number' | 'percentage';
  icon?: ReactNode;
  color?: string;
  showAlert?: boolean;
}

export const GoalProgress = ({
  title,
  current,
  goal,
  format = 'number',
  icon,
  color,
  showAlert = true,
}: GoalProgressProps) => {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;
  const isAboveGoal = percentage >= 100;
  const isNearGoal = percentage >= 80 && percentage < 100;
  const isFarBelowGoal = percentage < 50;

  // Formatação de valores
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return `R$ ${value.toLocaleString('pt-BR')}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  // Cor da barra de progresso
  const getProgressColor = () => {
    if (color) return color;
    if (isAboveGoal) return 'bg-green-500';
    if (isNearGoal) return 'bg-yellow-500';
    if (isFarBelowGoal) return 'bg-red-500';
    return 'bg-blue-500';
  };

  // Status visual
  const getStatusBadge = () => {
    if (isAboveGoal) {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Meta Atingida
        </Badge>
      );
    }
    if (isNearGoal) {
      return (
        <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          Próximo da Meta
        </Badge>
      );
    }
    if (isFarBelowGoal && showAlert) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Atenção Necessária
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <TrendingDown className="h-3 w-3 mr-1" />
        Em Progresso
      </Badge>
    );
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {icon && <div className="text-muted-foreground">{icon}</div>}
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold">{formatValue(current)}</h3>
              <span className="text-sm text-muted-foreground">
                de {formatValue(goal)}
              </span>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage.toFixed(1)}% atingido</span>
            <span>
              {isAboveGoal 
                ? `+${(current - goal).toLocaleString('pt-BR')} acima da meta`
                : `${(goal - current).toLocaleString('pt-BR')} restante`
              }
            </span>
          </div>
          <div className="relative">
            <Progress 
              value={Math.min(percentage, 100)} 
              className="h-3"
            />
            <div 
              className={`absolute top-0 h-3 rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Alerta se muito abaixo da meta */}
        {isFarBelowGoal && showAlert && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="text-xs text-destructive">
              <p className="font-semibold">Atenção: Muito abaixo da meta</p>
              <p className="mt-1">
                Você está {(100 - percentage).toFixed(0)}% abaixo do objetivo. 
                Considere revisar suas estratégias.
              </p>
            </div>
          </div>
        )}

        {/* Mensagem de sucesso se acima da meta */}
        {isAboveGoal && (
          <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
            <div className="text-xs text-green-700 dark:text-green-400">
              <p className="font-semibold">Parabéns! Meta superada!</p>
              <p className="mt-1">
                Você está {(percentage - 100).toFixed(0)}% acima do objetivo mensal.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
