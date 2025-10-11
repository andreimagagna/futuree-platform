import { PipelineSummaryV2 } from '../components/dashboard/PipelineSummaryV2';
import { ActivityTimelineV2 } from '../components/dashboard/ActivityTimelineV2';
import { AgendaWidgetV2 } from '../components/dashboard/AgendaWidgetV2';
import { OperationsPanelV2 } from '../components/dashboard/OperationsPanelV2';

export const DashboardView = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <PipelineSummaryV2 />
        </div>
        <div className="col-span-4">
          <ActivityTimelineV2 />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <OperationsPanelV2 />
        </div>
        <div className="col-span-4">
          <AgendaWidgetV2 />
        </div>
      </div>
    </div>
  );
};