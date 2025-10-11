import { Card, CardTitle, CardHeader } from "../ui/card";
import { History } from 'lucide-react';
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { LoadingState } from "../ui/loading-state";
import { useLoadingError } from "@/hooks/use-loading-error";
import { useDateRangeFilter } from "@/hooks/use-date-range-filter";
import { useStore } from "@/store/useStore";

export const ActivityTimelineV2 = () => {
  const { loading, error } = useLoadingError('activities');
  const activities = useDateRangeFilter(useStore().activities);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Atividade Recente
        </CardTitle>
        <Badge variant="secondary">{activities.length}</Badge>
      </CardHeader>

      <LoadingState isLoading={loading} error={error}>
        <ScrollArea className="h-[300px] px-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 text-sm">
                <div className="flex-1">
                  <p className="text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </LoadingState>
    </Card>
  );
};