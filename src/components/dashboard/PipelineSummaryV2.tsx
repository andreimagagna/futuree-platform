import { Card } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { LoadingState } from '../ui/loading-state';
import { useLoadingError } from '@/hooks/use-loading-error';
import { useStore } from '@/store/useStore';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { LeadStage } from '@/store/model-types';

export const PipelineSummaryV2 = () => {
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

          <TabsContent value="kanban">
            <KanbanView />
          </TabsContent>

          <TabsContent value="funnel">
            <FunnelView />
          </TabsContent>
        </Tabs>
      </LoadingState>
    </Card>
  );
};

const KanbanView = () => {
  const leads = useStore(state => state.leads);
  const stages: LeadStage[] = ['captured', 'qualify', 'contact', 'proposal', 'closing'];

  return (
    <div className="grid grid-cols-5 gap-4">
      {stages.map(stage => (
        <div key={stage} className="space-y-2">
          <h3 className="font-medium capitalize">{stage}</h3>
          <div className="bg-muted p-2 rounded-md min-h-[200px]">
            {leads
              .filter(lead => lead.stage === stage)
              .map(lead => (
                <div 
                  key={lead.id}
                  className="bg-card p-2 rounded border mb-2"
                >
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-sm text-muted-foreground">{lead.company}</p>
                </div>
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
};

const FunnelView = () => {
  const leads = useStore(state => state.leads);
  const stages: LeadStage[] = ['captured', 'qualify', 'contact', 'proposal', 'closing'];

  const stageCounts = stages.map(stage => ({
    stage,
    count: leads.filter(lead => lead.stage === stage).length
  }));

  const maxCount = Math.max(...stageCounts.map(s => s.count));

  return (
    <div className="space-y-2">
      {stageCounts.map(({ stage, count }) => (
        <div key={stage} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="capitalize">{stage}</span>
            <span>{count}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-full rounded-full"
              style={{ width: `${(count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};