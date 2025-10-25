/**
 * ============================================================================
 * AI INSIGHTS CARD
 * ============================================================================
 * Card de insights gerados pela IA com análise automática do CRM
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { TrendingUp, Lightbulb, AlertTriangle, Target, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Badge } from './ui/badge';
import { generateSalesInsights, SalesInsight } from '@/services/cohereAI';
import { useSupabaseLeads } from '@/hooks/useSupabaseLeads';
import { useCRMFunnels } from '@/hooks/useCRMFunnels';
import { useSupabaseActivities } from '@/hooks/useSupabaseActivities';

export function AIInsightsCard() {
  const { leads } = useSupabaseLeads();
  const funnelsQuery = useCRMFunnels();
  const funnels = funnelsQuery.data || [];
  const { activities } = useSupabaseActivities();

  const [insights, setInsights] = useState<SalesInsight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInsights();
  }, [leads.length, funnels.length, activities.length]);

  const loadInsights = async () => {
    if (leads.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = {
        leads,
        funnels,
        activities: activities.slice(0, 50), // Últimas 50 atividades
        period: 'últimos 30 dias',
      };

      const result = await generateSalesInsights(data);
      setInsights(result);
    } catch (err: any) {
      console.error('[AIInsights] Erro ao carregar insights:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Insights da IA
          </CardTitle>
          <CardDescription>Analisando seus dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Erro ao Carregar Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!insights || leads.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Insights da IA
          </CardTitle>
          <CardDescription>Adicione leads para receber insights automáticos</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Insights da IA
          <Badge variant="secondary" className="ml-auto">
            Atualizado agora
          </Badge>
        </CardTitle>
        <CardDescription>{insights.summary}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tendências */}
        {insights.trends.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Tendências Identificadas
            </div>
            <ul className="space-y-1 ml-6">
              {insights.trends.map((trend, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {trend}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Previsões */}
        {insights.predictions.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="h-4 w-4 text-purple-500" />
              Previsões
            </div>
            <ul className="space-y-1 ml-6">
              {insights.predictions.map((prediction, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {prediction}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recomendações */}
        {insights.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              Recomendações
            </div>
            <ul className="space-y-1 ml-6">
              {insights.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
