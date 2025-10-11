import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  stage: string;
  owner: string;
  score: number;
  nextAction: string;
}

const mockLeads: Lead[] = [
  { id: '1', name: 'João Silva', company: 'Tech Corp', stage: 'Qualificar', owner: 'Você', score: 85, nextAction: 'Ligar hoje 15h' },
  { id: '2', name: 'Maria Santos', company: 'Innovation Labs', stage: 'Contato', owner: 'Você', score: 72, nextAction: 'Email follow-up' },
  { id: '3', name: 'Pedro Costa', company: 'Digital Solutions', stage: 'Proposta', owner: 'Equipe', score: 90, nextAction: 'Apresentar proposta' },
  { id: '4', name: 'Ana Oliveira', company: 'StartupXYZ', stage: 'Capturado', owner: 'Você', score: 65, nextAction: 'Primeira qualificação' },
];

const stages = ['Capturado', 'Qualificar', 'Contato', 'Proposta', 'Fechamento'];

import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { LoadingState } from '../ui/loading-state';
import { useLoadingError } from '@/hooks/use-loading-error';
import { useStore } from '@/store/useStore';
import { useLocalStorage } from '@/hooks/use-local-storage';

export const PipelineSummary = () => {
  const { loading, error } = useLoadingError('leads');
  const [savedView, setSavedView] = useLocalStorage('pipelineView', 'kanban');

  return (
    <Card className="p-4">
      <LoadingState isLoading={loading} error={error}>
        <Tabs defaultValue={savedView} onValueChange={setSavedView}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="funnel">Funil</TabsTrigger>
            </TabsList>
          </div>
