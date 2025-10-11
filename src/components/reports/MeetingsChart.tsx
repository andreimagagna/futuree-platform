import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from "lucide-react";

interface MeetingsChartProps {
  data: {
    week: string;
    scheduled: number;
    completed: number;
    noShow: number;
    conversionRate: number;
  }[];
}

const MeetingsChart = ({ data }: MeetingsChartProps) => {
  const totalScheduled = data.reduce((acc, item) => acc + item.scheduled, 0);
  const totalCompleted = data.reduce((acc, item) => acc + item.completed, 0);
  const completionRate = (totalCompleted / totalScheduled) * 100 || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Reuniões e Conversões
            </CardTitle>
            <CardDescription>Agendamentos, realizações e taxa de conversão</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-success">
              {completionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Taxa de realização
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="week" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="left"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="scheduled" 
              name="Agendadas"
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--accent))' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="completed" 
              name="Realizadas"
              stroke="hsl(var(--success))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--success))' }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="noShow" 
              name="No-show"
              stroke="hsl(var(--destructive))" 
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--destructive))' }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="conversionRate" 
              name="Taxa de Conversão (%)"
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Agendadas</div>
            <div className="text-lg font-bold text-accent">{totalScheduled}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Realizadas</div>
            <div className="text-lg font-bold text-success">{totalCompleted}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">No-show</div>
            <div className="text-lg font-bold text-destructive">
              {data.reduce((acc, item) => acc + item.noShow, 0)}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Conversão Média</div>
            <div className="text-lg font-bold text-primary">
              {(data.reduce((acc, item) => acc + item.conversionRate, 0) / data.length).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingsChart;
