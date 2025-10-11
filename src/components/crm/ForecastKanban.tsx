import { useMemo, useState } from "react";
import { Lead } from "@/store/useStore";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { 
  CalendarClock, 
  DollarSign, 
  Building2, 
  GripVertical,
  Target,
  TrendingUp,
  AlertCircle,
  Calendar as CalendarIcon
} from "lucide-react";
import { format, isThisWeek, isThisMonth, addWeeks, addMonths, isBefore, isAfter, differenceInDays, endOfWeek, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

interface LeadCardProps {
  lead: Lead;
  onClick: (lead: Lead) => void;
}

const LeadForecastCard = ({ lead, onClick }: LeadCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: lead.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Calcular dias até o fechamento
  const daysUntilClose = lead.expectedCloseDate 
    ? differenceInDays(lead.expectedCloseDate, new Date())
    : null;

  const isOverdue = daysUntilClose !== null && daysUntilClose < 0;
  const isUrgent = daysUntilClose !== null && daysUntilClose >= 0 && daysUntilClose <= 3;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card 
        className={cn(
          "cursor-pointer hover:shadow-lg transition-all border-l-4 bg-card/80",
          isOverdue && "border-l-destructive",
          isUrgent && !isOverdue && "border-l-warning",
          !isOverdue && !isUrgent && "border-l-primary"
        )}
        onClick={() => onClick(lead)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div {...listeners} className="mt-1 cursor-grab hover:bg-muted rounded p-1">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 space-y-2.5">
              {/* Header com nome e empresa */}
              <div>
                <h4 className="font-semibold text-sm leading-tight truncate">{lead.name}</h4>
                <div className="flex items-center gap-1 mt-0.5">
                  <Building2 className="h-3 w-3 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                </div>
              </div>
              
              {/* Valor do deal - Destaque */}
              {lead.dealValue && (
                <div className="flex items-center gap-1.5 bg-muted/50 p-2 rounded-md">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-bold">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                    }).format(lead.dealValue)}
                  </span>
                </div>
              )}

              {/* Data de fechamento com indicador de urgência */}
              {lead.expectedCloseDate && (
                <div className={cn(
                  "flex items-center justify-between gap-2 p-2 rounded-md",
                  isOverdue && "bg-destructive/15",
                  isUrgent && !isOverdue && "bg-warning/15",
                  !isOverdue && !isUrgent && "bg-muted/80"
                )}>
                  <div className="flex items-center gap-1.5">
                    <CalendarClock className={cn(
                      "h-3.5 w-3.5 text-foreground",
                      isOverdue && "",
                      isUrgent && !isOverdue && "",
                      !isOverdue && !isUrgent && ""
                    )} />
                    <span className={cn(
                      "text-xs font-medium text-foreground"
                    )}>
                      {format(lead.expectedCloseDate, "dd MMM", { locale: ptBR })}
                    </span>
                  </div>
                  {daysUntilClose !== null && (
                    <Badge 
                      variant={isOverdue ? "destructive" : isUrgent ? "secondary" : "secondary"}
                      className="text-xs"
                    >
                      {isOverdue ? (
                        `${Math.abs(daysUntilClose)}d atrasado`
                      ) : (
                        `${daysUntilClose}d`
                      )}
                    </Badge>
                  )}
                </div>
              )}

              {/* Score e Tags */}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-xs font-medium">
                  <Target className="h-3 w-3 mr-1" />
                  {lead.score}%
                </Badge>
                {lead.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface ForecastKanbanProps {
  onLeadClick: (lead: Lead) => void;
}

export const ForecastKanban = ({ onLeadClick }: ForecastKanbanProps) => {
  // Only use pipeline leads from store
  const { leads, updateLead } = useStore();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const now = new Date();
  const nextWeekEnd = addWeeks(now, 1);
  const thisMonthEnd = addMonths(now, 0);
  const nextMonthEnd = addMonths(now, 1);

  const forecastColumns = useMemo(() => {
    // Each lead appears in only one column (earliest bucket)
    const leadsWithDate = leads.filter((l) => l.expectedCloseDate && l.status !== 'won' && l.status !== 'lost');
    const columns = {
      thisWeek: [] as Lead[],
      nextWeek: [] as Lead[],
      thisMonth: [] as Lead[],
      nextMonth: [] as Lead[],
      later: [] as Lead[],
    };
    for (const lead of leadsWithDate) {
      if (isThisWeek(lead.expectedCloseDate, { weekStartsOn: 0 })) {
        columns.thisWeek.push(lead);
      } else if (isAfter(lead.expectedCloseDate, nextWeekEnd) && isBefore(lead.expectedCloseDate, addWeeks(nextWeekEnd, 1))) {
        columns.nextWeek.push(lead);
      } else if (isThisMonth(lead.expectedCloseDate) && !isThisWeek(lead.expectedCloseDate, { weekStartsOn: 0 }) && isAfter(lead.expectedCloseDate, nextWeekEnd)) {
        columns.thisMonth.push(lead);
      } else if (isAfter(lead.expectedCloseDate, thisMonthEnd) && isBefore(lead.expectedCloseDate, nextMonthEnd)) {
        columns.nextMonth.push(lead);
      } else if (isAfter(lead.expectedCloseDate, nextMonthEnd)) {
        columns.later.push(lead);
      }
    }
    return columns;
  }, [leads]);

  const columnTotals = useMemo(() => {
    const calcTotal = (leads: Lead[]) => 
      leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);

    return {
      thisWeek: calcTotal(forecastColumns.thisWeek),
      nextWeek: calcTotal(forecastColumns.nextWeek),
      thisMonth: calcTotal(forecastColumns.thisMonth),
      nextMonth: calcTotal(forecastColumns.nextMonth),
      later: calcTotal(forecastColumns.later),
    };
  }, [forecastColumns]);

  // Métricas avançadas
  const metrics = useMemo(() => {
    const grandTotal = Object.values(columnTotals).reduce((sum, val) => sum + val, 0);
    const totalLeads = Object.values(forecastColumns).reduce((sum, arr) => sum + arr.length, 0);
    const avgDealValue = totalLeads > 0 ? grandTotal / totalLeads : 0;
    
    // Calcular score médio ponderado
    const allLeads = Object.values(forecastColumns).flat();
    const weightedScore = allLeads.reduce((sum, l) => sum + (l.score * (l.dealValue || 0)), 0);
    const avgWeightedScore = grandTotal > 0 ? weightedScore / grandTotal : 0;

    // Valor esperado (considerando score como probabilidade)
    const expectedValue = allLeads.reduce((sum, l) => sum + ((l.dealValue || 0) * l.score / 100), 0);

    return {
      grandTotal,
      totalLeads,
      avgDealValue,
      avgWeightedScore,
      expectedValue,
      conversionRate: avgWeightedScore, // Score médio como taxa de conversão estimada
    };
  }, [columnTotals, forecastColumns]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const leadId = active.id as string;
    const columnId = over.id as string;
    
    // Calculate new expected close date based on column
    let newDate: Date;
    const now = new Date();
    
    switch (columnId) {
      case 'thisWeek':
        newDate = addWeeks(now, 0);
        newDate.setDate(now.getDate() + 3); // Mid-week
        break;
      case 'nextWeek':
        newDate = addWeeks(now, 1);
        newDate.setDate(newDate.getDate() + 3);
        break;
      case 'thisMonth':
        newDate = addWeeks(now, 2);
        break;
      case 'nextMonth':
        newDate = addMonths(now, 1);
        break;
      case 'later':
        newDate = addMonths(now, 2);
        break;
      default:
        return;
    }
    
    updateLead(leadId, { expectedCloseDate: newDate });
  };

  // Cores por coluna seguindo paleta existente
  const columnStyles: Record<string, { border: string; headerBg: string; headerText: string; }> = {
    thisWeek: { border: "border-primary", headerBg: "bg-primary/10", headerText: "text-primary-foreground" },
    nextWeek: { border: "border-warning", headerBg: "bg-warning/10", headerText: "text-warning-foreground" },
    thisMonth: { border: "border-accent", headerBg: "bg-accent/10", headerText: "text-accent-foreground" },
    nextMonth: { border: "border-info", headerBg: "bg-info/10", headerText: "text-info-foreground" },
    later: { border: "border-muted", headerBg: "bg-muted/30", headerText: "text-muted-foreground" },
  };

  const columns = [
    { 
      id: 'thisWeek', 
      title: 'Esta Semana', 
      leads: forecastColumns.thisWeek, 
      total: columnTotals.thisWeek, 
      icon: AlertCircle,
      priority: 'high'
    },
    { 
      id: 'nextWeek', 
      title: 'Próxima Semana', 
      leads: forecastColumns.nextWeek, 
      total: columnTotals.nextWeek, 
      icon: CalendarIcon,
      priority: 'medium'
    },
    { 
      id: 'thisMonth', 
      title: 'Este Mês', 
      leads: forecastColumns.thisMonth, 
      total: columnTotals.thisMonth, 
      icon: Target,
      priority: 'medium'
    },
    { 
      id: 'nextMonth', 
      title: 'Próximo Mês', 
      leads: forecastColumns.nextMonth, 
      total: columnTotals.nextMonth, 
      icon: TrendingUp,
      priority: 'low'
    },
    { 
      id: 'later', 
      title: 'Mais Tarde', 
      leads: forecastColumns.later, 
      total: columnTotals.later, 
      icon: CalendarClock,
      priority: 'low'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header com Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase text-muted-foreground">
              Pipeline Total
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 0,
              }).format(metrics.grandTotal)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {metrics.totalLeads} oportunidades ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase text-muted-foreground">
              Valor Esperado
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                minimumFractionDigits: 0,
                notation: 'compact'
              }).format(metrics.expectedValue)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ponderado por score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs font-medium uppercase text-muted-foreground">
              Score Médio
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {Math.round(metrics.avgWeightedScore)}%
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={metrics.avgWeightedScore} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Filtros removidos conforme solicitado: Semana/Mês, Atrasados, Urgentes, Todos */}

      {/* Kanban Board */}
      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {columns.map((column) => {
            const Icon = column.icon;
            const conversionEstimate = column.leads.reduce((sum, l) => sum + l.score, 0) / (column.leads.length || 1);
            const isHighPriority = column.priority === 'high';
            const styles = columnStyles[column.id];
            
            return (
              <div key={column.id} className="space-y-3">
                <Card className={cn("border-2", styles?.border)}> 
                  <CardContent className="p-0">
                    {/* Header da coluna com cor */}
                    <div className={cn("flex items-center gap-2 px-4 py-3 border-b", styles?.headerBg)}>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold text-sm flex-1">{column.title}</h3>
                      <Badge variant="secondary" className="text-xs">{column.leads.length}</Badge>
                    </div>

                    {/* Métricas da coluna */}
                    <div className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Score médio</span>
                          <span className="text-sm font-semibold">
                            {Math.round(conversionEstimate)}%
                          </span>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Total</span>
                            <span className="text-sm font-semibold">
                              {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL',
                                minimumFractionDigits: 0,
                                notation: 'compact',
                              }).format(column.total)}
                            </span>
                          </div>
                          <Progress 
                            value={metrics.grandTotal > 0 ? (column.total / metrics.grandTotal) * 100 : 0} 
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <SortableContext
                  id={column.id}
                  items={column.leads.map((l) => l.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3 min-h-[400px] p-3 rounded-lg border-2 border-dashed border-muted-foreground/20">
                    {column.leads.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-32 text-sm text-muted-foreground">
                        <CalendarClock className="h-8 w-8 mb-2 opacity-20" />
                        <span>Nenhum lead</span>
                      </div>
                    ) : (
                      column.leads.map((lead) => (
                        <LeadForecastCard 
                          key={lead.id} 
                          lead={lead} 
                          onClick={(l) => {
                            setSelectedLead(l);
                            setPreviewOpen(true);
                          }}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>

      {/* Preview Dialog para ver o lead diretamente na previsão */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          {selectedLead && (
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="truncate">{selectedLead.name}</span>
                  {selectedLead.dealValue && (
                    <Badge variant="secondary" className="ml-2">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 }).format(selectedLead.dealValue)}
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {selectedLead.company}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Fechamento Esperado</span>
                  <p className="text-sm font-medium">
                    {selectedLead.expectedCloseDate ? format(selectedLead.expectedCloseDate, 'dd/MM/yyyy', { locale: ptBR }) : '—'}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Score</span>
                  <p className="text-sm font-medium">{selectedLead.score}%</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Etapa</span>
                  <p className="text-sm font-medium">{selectedLead.stage}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground">Owner</span>
                  <p className="text-sm font-medium">{selectedLead.owner}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedLead.tags.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>

              <DialogFooter className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setPreviewOpen(false)}>Fechar</Button>
                <Button onClick={() => {
                  window.location.href = `/crm/${selectedLead.id}`;
                }}>Abrir Lead</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
