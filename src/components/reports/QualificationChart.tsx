import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Target, TrendingUp } from "lucide-react";

interface QualificationChartProps {
  data: {
    month: string;
    contacted: number;
    qualified: number;
    disqualified: number;
    rate: number;
  }[];
}

const QualificationChart = ({ data }: QualificationChartProps) => {
  const totalContacted = data.reduce((acc, item) => acc + item.contacted, 0);
  const totalQualified = data.reduce((acc, item) => acc + item.qualified, 0);
  const qualificationRate = (totalQualified / totalContacted) * 100 || 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Qualificação de Leads
            </CardTitle>
            <CardDescription>Performance de qualificação por período</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {qualificationRate.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Taxa de qualificação
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="month" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
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
            <Bar 
              dataKey="contacted" 
              name="Contatados"
              fill="hsl(var(--accent))" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="qualified" 
              name="Qualificados"
              fill="hsl(var(--success))" 
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              dataKey="disqualified" 
              name="Desqualificados"
              fill="hsl(var(--destructive))" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Contatados</div>
            <div className="text-lg font-bold text-accent">{totalContacted}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Qualificados</div>
            <div className="text-lg font-bold text-success">{totalQualified}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Desqualificados</div>
            <div className="text-lg font-bold text-destructive">
              {data.reduce((acc, item) => acc + item.disqualified, 0)}
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-sm text-muted-foreground">Taxa</div>
            <div className="text-lg font-bold text-primary">{qualificationRate.toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QualificationChart;
