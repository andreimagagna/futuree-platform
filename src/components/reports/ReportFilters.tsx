import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type PeriodType = '7days' | '30days' | '90days' | '6months' | '1year' | 'custom';

interface ReportFiltersProps {
  period: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  onExport?: () => void;
  onRefresh?: () => void;
  comparison?: 'none' | 'previous' | 'lastYear';
  onComparisonChange?: (comparison: 'none' | 'previous' | 'lastYear') => void;
}

const ReportFilters = ({ 
  period, 
  onPeriodChange, 
  onExport, 
  onRefresh,
  comparison = 'none',
  onComparisonChange 
}: ReportFiltersProps) => {
  const periodOptions = [
    { value: '7days', label: 'Últimos 7 dias' },
    { value: '30days', label: 'Últimos 30 dias' },
    { value: '90days', label: 'Últimos 90 dias' },
    { value: '6months', label: 'Últimos 6 meses' },
    { value: '1year', label: 'Último ano' },
    { value: 'custom', label: 'Período customizado' },
  ];

  const comparisonOptions = [
    { value: 'none', label: 'Sem comparação' },
    { value: 'previous', label: 'vs Período anterior' },
    { value: 'lastYear', label: 'vs Mesmo período ano passado' },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={period} onValueChange={(value) => onPeriodChange(value as PeriodType)}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periodOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {onComparisonChange && (
            <div className="flex items-center gap-2">
              <Select value={comparison} onValueChange={onComparisonChange}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {comparisonOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {comparison !== 'none' && (
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  Comparando
                </Badge>
              )}
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            )}
            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportFilters;
