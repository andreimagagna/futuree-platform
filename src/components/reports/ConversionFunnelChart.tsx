import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Filter, TrendingDown } from "lucide-react";

interface ConversionFunnelChartProps {
  data: {
    stage: string;
    count: number;
    percentage: number;
    color: string;
  }[];
}

const ConversionFunnelChart = ({ data }: ConversionFunnelChartProps) => {
  const conversionRate = data.length > 0 
    ? ((data[data.length - 1].count / data[0].count) * 100).toFixed(1)
    : '0.0';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Funil de Conversão
            </CardTitle>
            <CardDescription>Taxa de conversão por etapa do funil</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {conversionRate}%
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              Conversão total
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart 
            data={data}
            layout="vertical"
            margin={{ left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              type="category"
              dataKey="stage"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              width={90}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
              formatter={(value: any, name: string) => {
                const item = data.find(d => d.count === value);
                return [
                  `${value} leads (${item?.percentage || 0}%)`,
                  name
                ];
              }}
            />
            <Bar 
              dataKey="count" 
              name="Leads"
              radius={[0, 8, 8, 0]}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.map((stage, index) => (
            <div key={index} className="text-center p-3 rounded-lg bg-muted/50">
              <div className="text-sm text-muted-foreground truncate">{stage.stage}</div>
              <div className="text-lg font-bold" style={{ color: stage.color }}>
                {stage.count}
              </div>
              <div className="text-xs text-muted-foreground">{stage.percentage}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionFunnelChart;
