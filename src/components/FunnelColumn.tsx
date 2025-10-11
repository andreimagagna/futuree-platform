import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Lead {
  id: string;
  name: string;
  company: string;
  value: string;
}

interface FunnelColumnProps {
  title: string;
  count: number;
  leads: Lead[];
  color: string;
}

export const FunnelColumn = ({ title, count, leads, color }: FunnelColumnProps) => {
  return (
    <div className="flex-1 min-w-[280px]">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <Badge variant="secondary" className="rounded-full">
            {count}
          </Badge>
        </div>
        <div className={`h-1 w-full ${color} rounded-full`} />
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <Card
            key={lead.id}
            className="p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200"
          >
            <div className="space-y-2">
              <div className="font-medium text-sm">{lead.name}</div>
              <div className="text-xs text-muted-foreground">{lead.company}</div>
              <div className="text-sm font-semibold text-primary">{lead.value}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
